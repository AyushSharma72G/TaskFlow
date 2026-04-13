import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

const safeUserSelect = {
    id: true,
    name: true,
    email: true,
    avatarUrl: true,
    provider: true,
    providerId: true,
    createdAt: true,
    updatedAt: true,
} as const;

export type SafeUser = {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    provider: string | null;
    providerId: string | null;
    createdAt: Date;
    updatedAt: Date;
};

@Injectable()
export class AuthRepository {
    constructor(private readonly prisma: PrismaService) {}
    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async findByProvider(provider: string, providerId: string) {
        return this.prisma.user.findFirst({
            where: {
                provider,
                providerId,
            },
        });
    }

    async createOAuthUser(data: {
        name: string;
        email: string;
        provider: string;
        providerId: string;
        avatarUrl?: string;
    }): Promise<SafeUser> {
        return (await this.prisma.user.create({
            data,
            select: safeUserSelect,
        })) as SafeUser;
    }

    async linkOAuthProvider(
        userId: string,
        provider: string,
        providerId: string,
        avatarUrl?: string,
    ): Promise<SafeUser> {
        return (await this.prisma.user.update({
            where: { id: userId },
            data: {
                provider,
                providerId,
                ...(avatarUrl ? { avatarUrl } : {}),
            },
            select: safeUserSelect,
        })) as SafeUser;
    }

    async findById(id: string): Promise<SafeUser | null> {
        return (await this.prisma.user.findUnique({
            where: { id },
            select: safeUserSelect,
        })) as SafeUser | null;
    }
    async findByIdWithPassword(
        id: string,
    ): Promise<{ id: string; password: string | null } | null> {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                password: true,
            },
        });
    }
    async findByIdWithAuthSecrets(id: string): Promise<{
        id: string;
        email: string;
        password: string | null;
        refreshTokenHash: string | null;
    } | null> {
        return this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                password: true,
                refreshTokenHash: true,
            },
        });
    }
    async createUser(data: {
        name: string;
        email: string;
        password: string;
    }): Promise<SafeUser> {
        return (await this.prisma.user.create({
            data,
            select: safeUserSelect,
        })) as SafeUser;
    }
    async updateUser(
        id: string,
        data: {
            name?: string;
            avatarUrl?: string;
        },
    ): Promise<SafeUser> {
        return (await this.prisma.user.update({
            where: { id },
            data,
            select: safeUserSelect,
        })) as SafeUser;
    }
    async updateAvatarUrl(
        id: string,
        avatarUrl: string | null,
    ): Promise<SafeUser> {
        return (await this.prisma.user.update({
            where: { id },
            data: { avatarUrl },
            select: safeUserSelect,
        })) as SafeUser;
    }
    async updatePassword(id: string, password: string): Promise<void> {
        await this.prisma.user.update({
            where: { id },
            data: { password },
            select: { id: true },
        });
    }
    async updateRefreshTokenHash(
        id: string,
        refreshTokenHash: string | null,
    ): Promise<void> {
        await this.prisma.user.update({
            where: { id },
            data: { refreshTokenHash },
            select: { id: true },
        });
    }
    async findUserRoleInProject(
        userId: string,
        projectId: string,
    ): Promise<string | null> {
        const member = await this.prisma.projectMember.findUnique({
            where: {
                userId_projectId: {
                    userId,
                    projectId,
                },
            },
            select: {
                role: true,
            },
        });

        return member?.role ?? null;
    }
}
