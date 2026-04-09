import {
    BadRequestException,
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { compare, hash } from 'bcrypt';
import { sign, verify, type SignOptions } from 'jsonwebtoken';
import config from '../../../config/env.config';
import { AUTH_MESSAGES } from '../../../common/messages/auth.messages';
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
                throw new UnauthorizedException(AUTH_MESSAGES.errors.userNotFound);
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
}
