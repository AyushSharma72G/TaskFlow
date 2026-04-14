import { readFile, unlink } from 'node:fs/promises';
import {
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { compare, hash } from 'bcrypt';
import { sign, verify, type SignOptions } from 'jsonwebtoken';
import config from '../../../config/env.config';
import { AUTH_MESSAGES } from '../../../common/messages/auth.messages';
import {
    deleteFile,
    uploadFile,
} from '../../../common/storage/storageOperations';
import { STORAGE_PROVIDER_KEYS } from '../../../common/storage/storage.interface';
import {
    ChangePasswordDto,
    LoginDto,
    RegisterDto,
    UpdateProfileDto,
} from '../dto/auth.dto';
import { AuthRepository, type SafeUser } from '../repositories/auth.repository';
import { OAuthProviderRegistry } from '../oauth-provider.registry';
import type { NormalisedUser } from '../interfaces/oauth-provider.interface';
import { AuthBusinessValidator } from '../validators/auth-business.validator';

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly providerRegistry: OAuthProviderRegistry,
        private readonly authBusinessValidator: AuthBusinessValidator,
    ) {}

    initiateOAuth(providerName: string, state?: string): string {
        const provider = this.providerRegistry.get(providerName);
        return provider.getAuthUrl(state);
    }

    async handleOAuthCallback(
        providerName: string,
        req: Request,
    ): Promise<{
        user: SafeUser;
        accessToken: string;
        refreshToken: string;
    }> {
        const provider = this.providerRegistry.get(providerName);
        const callbackResult = await provider.validateCallback(req);
        const normalizedUser = await provider.getUser(callbackResult);
        this.authBusinessValidator.validateOAuthUser(normalizedUser);
        const user = await this.findOrCreateUser(normalizedUser);
        const { accessToken, refreshToken } = this.issueTokens(
            user.id,
            user.email,
        );
        await this.setRefreshToken(user.id, refreshToken);

        return {
            user,
            accessToken,
            refreshToken,
        };
    }

    async findOrCreateUser(user: NormalisedUser): Promise<SafeUser> {
        const byProvider = await this.authRepository.findByProvider(
            user.providerName,
            user.providerId,
        );
        if (byProvider) {
            const safe = await this.authRepository.findById(byProvider.id);
            if (!safe) {
                throw new UnauthorizedException(
                    AUTH_MESSAGES.errors.userNotFound,
                );
            }
            return safe;
        }

        const byEmail = await this.authRepository.findByEmail(user.email);
        if (byEmail) {
            return this.authRepository.linkOAuthProvider(
                byEmail.id,
                user.providerName,
                user.providerId,
                user.avatar,
            );
        }

        const name = `${user.firstName} ${user.lastName}`.trim();
        return this.authRepository.createOAuthUser({
            name,
            email: user.email,
            provider: user.providerName,
            providerId: user.providerId,
            avatarUrl: user.avatar,
        });
    }

    generateJwt(user: SafeUser): string {
        return this.signAccessToken(user.id, user.email);
    }

    async register(dto: RegisterDto): Promise<{
        user: SafeUser;
        accessToken: string;
        refreshToken: string;
    }> {
        const existingUser = await this.authRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException(AUTH_MESSAGES.errors.emailAlreadyInUse);
        }
        this.authBusinessValidator.validatePasswordStrength(dto.password);
        const hashedPassword = await hash(dto.password, 10);
        const user = await this.authRepository.createUser({
            name: dto.name,
            email: dto.email,
            password: hashedPassword,
        });
        const { accessToken, refreshToken } = this.issueTokens(
            user.id,
            user.email,
        );
        await this.setRefreshToken(user.id, refreshToken);
        return { user, accessToken, refreshToken };
    }
    async login(dto: LoginDto): Promise<{
        user: SafeUser;
        accessToken: string;
        refreshToken: string;
    }> {
        const user = await this.authRepository.findByEmail(dto.email);
        if (!user?.password) {
            throw new UnauthorizedException(
                AUTH_MESSAGES.errors.invalidCredentials,
            );
        }
        const validPassword = await compare(dto.password, user.password);
        if (!validPassword) {
            throw new UnauthorizedException(
                AUTH_MESSAGES.errors.invalidCredentials,
            );
        }
        const safeUser = await this.authRepository.findById(user.id);
        if (!safeUser) {
            throw new UnauthorizedException(AUTH_MESSAGES.errors.userNotFound);
        }
        const { accessToken, refreshToken } = this.issueTokens(
            safeUser.id,
            safeUser.email,
        );
        await this.setRefreshToken(safeUser.id, refreshToken);
        return { user: safeUser, accessToken, refreshToken };
    }
    async getProfile(userId: string): Promise<SafeUser> {
        const user = await this.authRepository.findById(userId);
        if (!user) {
            throw new UnauthorizedException(AUTH_MESSAGES.errors.userNotFound);
        }
        return user;
    }
    async updateProfile(
        userId: string,
        dto: UpdateProfileDto,
    ): Promise<SafeUser> {
        if (dto.name === undefined && dto.avatarUrl === undefined) {
            throw new BadRequestException(
                AUTH_MESSAGES.errors.emptyProfileUpdate,
            );
        }
        return this.authRepository.updateUser(userId, {
            name: dto.name,
            avatarUrl: dto.avatarUrl,
        });
    }
    async uploadAvatar(
        userId: string,
        file: Express.Multer.File,
    ): Promise<SafeUser> {
        await this.getProfile(userId);

        const fileName = this.getAvatarFileName(userId);
        const fileBuffer = await this.readAvatarTempFile(file.path);

        try {
            const uploaded = await this.uploadAvatarWithRetry(
                fileBuffer,
                fileName,
                file.mimetype,
                userId,
            );

            return this.authRepository.updateAvatarUrl(userId, uploaded.url);
        } catch {
            throw new InternalServerErrorException(
                AUTH_MESSAGES.errors.avatarUploadFailed,
            );
        } finally {
            await unlink(file.path).catch(() => undefined);
        }
    }
    async removeAvatar(userId: string): Promise<SafeUser> {
        await this.getProfile(userId);

        const fileKey = this.getAvatarFileKey(userId);

        await deleteFile(STORAGE_PROVIDER_KEYS.cloudinary, fileKey).catch(
            () => undefined,
        );

        try {
            return await this.authRepository.updateAvatarUrl(userId, null);
        } catch {
            throw new InternalServerErrorException(
                AUTH_MESSAGES.errors.avatarRemoveFailed,
            );
        }
    }
    async changePassword(
        userId: string,
        dto: ChangePasswordDto,
    ): Promise<void> {
        if (dto.oldPassword === dto.newPassword) {
            throw new BadRequestException(
                AUTH_MESSAGES.errors.newPasswordMustDifferFromOld,
            );
        }
        this.authBusinessValidator.validatePasswordStrength(dto.newPassword);
        const user = await this.authRepository.findByIdWithPassword(userId);
        if (!user?.password) {
            throw new UnauthorizedException(AUTH_MESSAGES.errors.userNotFound);
        }
        const validOldPassword = await compare(dto.oldPassword, user.password);
        if (!validOldPassword) {
            throw new UnauthorizedException(
                AUTH_MESSAGES.errors.oldPasswordIncorrect,
            );
        }
        const newHashedPassword = await hash(dto.newPassword, 10);
        await this.authRepository.updatePassword(userId, newHashedPassword);
    }
    async refresh(refreshToken: string): Promise<{
        user: SafeUser;
        accessToken: string;
        refreshToken: string;
    }> {
        const payload = this.verifyRefreshToken(refreshToken);
        const userAuth = await this.authRepository.findByIdWithAuthSecrets(
            payload.sub,
        );
        if (!userAuth?.refreshTokenHash) {
            throw new UnauthorizedException(
                AUTH_MESSAGES.errors.invalidRefreshToken,
            );
        }
        const validRefreshToken = await compare(
            refreshToken,
            userAuth.refreshTokenHash,
        );
        if (!validRefreshToken) {
            throw new UnauthorizedException(
                AUTH_MESSAGES.errors.invalidRefreshToken,
            );
        }
        const safeUser = await this.authRepository.findById(userAuth.id);
        if (!safeUser) {
            throw new UnauthorizedException(AUTH_MESSAGES.errors.userNotFound);
        }
        const tokens = this.issueTokens(safeUser.id, safeUser.email);
        await this.setRefreshToken(safeUser.id, tokens.refreshToken);
        return {
            user: safeUser,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        };
    }
    async revokeRefreshToken(userId: string): Promise<void> {
        await this.authRepository.updateRefreshTokenHash(userId, null);
    }
    async getCurrentUserDetails(userId: string): Promise<SafeUser> {
        return this.getProfile(userId);
    }
    async getCurrentUserRole(
        userId: string,
        projectId: string,
    ): Promise<{
        projectId: string;
        role: string | null;
    }> {
        const role = await this.authRepository.findUserRoleInProject(
            userId,
            projectId,
        );
        return {
            projectId,
            role,
        };
    }
    private issueTokens(
        userId: string,
        email: string,
    ): { accessToken: string; refreshToken: string } {
        return {
            accessToken: this.signAccessToken(userId, email),
            refreshToken: this.signRefreshToken(userId, email),
        };
    }
    private signAccessToken(userId: string, email: string): string {
        const expiresIn =
            config.ACCESS_TOKEN_EXPIRES_IN as SignOptions['expiresIn'];
        return sign({ sub: userId, email }, config.JWT_SECRET, {
            expiresIn,
        });
    }
    private signRefreshToken(userId: string, email: string): string {
        const expiresIn =
            config.REFRESH_TOKEN_EXPIRES_IN as SignOptions['expiresIn'];
        return sign({ sub: userId, email }, config.REFRESH_TOKEN_SECRET, {
            expiresIn,
        });
    }
    private verifyRefreshToken(refreshToken: string): {
        sub: string;
        email: string;
    } {
        try {
            const payload = verify(
                refreshToken,
                config.REFRESH_TOKEN_SECRET,
            ) as {
                sub?: string;
                email?: string;
            };
            if (!payload.sub || !payload.email) {
                throw new UnauthorizedException(
                    AUTH_MESSAGES.errors.invalidRefreshToken,
                );
            }
            return { sub: payload.sub, email: payload.email };
        } catch {
            throw new UnauthorizedException(
                AUTH_MESSAGES.errors.invalidRefreshToken,
            );
        }
    }
    private async setRefreshToken(
        userId: string,
        refreshToken: string,
    ): Promise<void> {
        const hashedRefreshToken = await hash(refreshToken, 10);
        await this.authRepository.updateRefreshTokenHash(
            userId,
            hashedRefreshToken,
        );
    }
    private getAvatarFileName(userId: string): string {
        return `user-${userId}-avatar`;
    }
    private getAvatarFileKey(userId: string): string {
        return `${config.AVATAR_FOLDER}/${this.getAvatarFileName(userId)}`;
    }

    private async readAvatarTempFile(filePath: string): Promise<Buffer> {
        try {
            return await readFile(filePath);
        } catch {
            throw new InternalServerErrorException(
                AUTH_MESSAGES.errors.avatarUploadFailed,
            );
        }
    }

    private async uploadAvatarWithRetry(
        buffer: Buffer,
        fileName: string,
        mimeType: string,
        userId: string,
    ): Promise<Awaited<ReturnType<typeof uploadFile>>> {
        const maxAttempts = Math.max(
            1,
            Math.floor(config.AVATAR_UPLOAD_RETRY_COUNT),
        );

        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
            try {
                return await uploadFile(STORAGE_PROVIDER_KEYS.cloudinary, {
                    buffer,
                    fileName,
                    mimeType,
                    folder: config.AVATAR_FOLDER,
                    metadata: { userId },
                });
            } catch {
                if (attempt === maxAttempts) {
                    throw new InternalServerErrorException(
                        AUTH_MESSAGES.errors.avatarUploadFailed,
                    );
                }
            }
        }

        throw new InternalServerErrorException(
            AUTH_MESSAGES.errors.avatarUploadFailed,
        );
    }
}
