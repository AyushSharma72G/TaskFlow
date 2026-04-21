import { Injectable } from '@nestjs/common';
import { Role, TaskStatus } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { ProjectMember, User } from '@prisma/client';
import { TaskPriority } from '@prisma/client';
import type { ProjectDueFilter } from '../dto/projects.dto';

type ProjectUser = {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
};

export type ProjectMemberWithUser = ProjectMember & {
    user: ProjectUser;
};
export type ProjectListItem = {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    createdAt: Date;
    ownerId: string;

    memberCount: number;
    totalTasks: number;
    completedTasks: number;
    avatars: {
        id: string;
        name: string;
        avatarUrl: string | null;
    }[];
};

export type ProjectsPageResult = {
    data: Omit<ProjectListItem, 'progress'>[];
    nextCursor: string | null;
};

export type ProjectCreateResponse = {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    progress: 0;
    memberCount: 1;
    createdAt: Date;
};

export type ProjectUpdateResponse = {
    id: string;
    title: string;
    description: string;
    dueDate: Date;
    createdAt: Date;
};

export type ProjectMemberDetails = {
    id: string;
    role: Role;
    joinedAt: Date;
    user: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
    };
};

export type ProjectTaskDetails = {
    id: string;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: Date | null;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
    assignees: {
        id: string;
        userId: string;
        taskId: string;
        assignedAt: Date;
        user: {
            id: string;
            name: string;
            email: string;
            avatarUrl: string | null;
        };
    }[];
    createdBy: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
    };
};

export type ProjectDetails = {
    id: string;
    title: string;
    description: string;
    dueDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    memberCount: number;
    totalTasks: number;
    completedTasks: number;
    progress: number;
    members: ProjectMemberDetails[];
    tasks: ProjectTaskDetails[];
};

@Injectable()
export class ProjectsRepository {
    constructor(private readonly prisma: PrismaService) {}

    //Returns only projects where user is a member (via ProjectMember)
    // We fetch only counts (no full tasks/members arrays).
    async findProjectsWhereUserIsMember(
        userId: string,
        params: {
            cursor?: string;
            limit: number;
            pageSize: number;
            search?: string;
            ownerOnly: boolean;
            dueFilter: ProjectDueFilter;
        },
    ): Promise<ProjectsPageResult> {
        const where: Prisma.ProjectWhereInput = {
            members: {
                some: { userId },
            },
        };

        if (params.ownerOnly) {
            where.ownerId = userId;
        }

        if (params.search?.trim()) {
            const searchTerm = params.search.trim();
            where.OR = [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
            ];
        }

        const dueDateFilter = this.buildDueDateFilter(params.dueFilter);
        if (dueDateFilter) {
            where.dueDate = dueDateFilter;
        }

        const projects = await this.prisma.project.findMany({
            where,
            take: params.limit,
            skip: params.cursor ? 1 : 0,
            cursor: params.cursor ? { id: params.cursor } : undefined,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                title: true,
                description: true,
                dueDate: true,
                createdAt: true,
                ownerId: true,
                members: {
                    take: 5,
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        members: true,
                        tasks: true,
                    },
                },
            },
        });

        const hasMore = projects.length > params.pageSize;
        const pageProjects = hasMore
            ? projects.slice(0, params.pageSize)
            : projects;
        const projectIds = pageProjects.map((p) => p.id);
        if (projectIds.length === 0) {
            return { data: [], nextCursor: null };
        }

        // Count completed tasks per project (TaskStatus.DONE)
        const completedByProject = await this.prisma.task.groupBy({
            by: ['projectId'],
            where: {
                projectId: { in: projectIds },
                status: TaskStatus.DONE,
            },
            _count: { _all: true },
        });

        const completedMap = new Map(
            completedByProject.map((row) => [row.projectId, row._count._all]),
        );

        const data = pageProjects.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description ?? '',
            dueDate: p.dueDate,
            createdAt: p.createdAt,
            ownerId: p.ownerId,
            memberCount: p._count.members,
            totalTasks: p._count.tasks,
            completedTasks: completedMap.get(p.id) ?? 0,
            avatars: p.members.map((m) => ({
                id: m.user.id,
                name: m.user.name,
                avatarUrl: m.user.avatarUrl,
            })),
        }));

        return {
            data,
            nextCursor: hasMore ? (data[data.length - 1]?.id ?? null) : null,
        };
    }

    private buildDueDateFilter(
        dueFilter: ProjectDueFilter,
    ): Prisma.DateTimeFilter | undefined {
        if (dueFilter === 'all') {
            return undefined;
        }

        const now = new Date();
        const startToday = this.startOfUtcDay(now);
        const startTomorrow = new Date(startToday);
        startTomorrow.setUTCDate(startTomorrow.getUTCDate() + 1);

        if (dueFilter === 'overdue') {
            return { lt: startToday };
        }

        if (dueFilter === 'today') {
            return { gte: startToday, lt: startTomorrow };
        }

        if (dueFilter === 'this_week') {
            const endOfWeek = new Date(startToday);
            endOfWeek.setUTCDate(endOfWeek.getUTCDate() + 7);
            return { gte: startToday, lt: endOfWeek };
        }

        if (dueFilter === 'next_30_days') {
            const endWindow = new Date(startToday);
            endWindow.setUTCDate(endWindow.getUTCDate() + 30);
            return { gte: startToday, lt: endWindow };
        }

        return undefined;
    }

    private startOfUtcDay(date: Date): Date {
        const normalized = new Date(date);
        normalized.setUTCHours(0, 0, 0, 0);
        return normalized;
    }

    async createProjectAndAddOwnerMember(params: {
        userId: string;
        title: string;
        description?: string;
        dueDate: Date;
    }): Promise<ProjectCreateResponse> {
        const project = await this.prisma.project.create({
            data: {
                title: params.title,

                description: params.description ?? '',
                dueDate: params.dueDate,
                ownerId: params.userId,
            },
            select: {
                id: true,
                title: true,
                description: true,
                dueDate: true,
                createdAt: true,
            },
        });

        try {
            await this.prisma.projectMember.create({
                data: {
                    userId: params.userId,
                    projectId: project.id,
                    // "ADMIN" in the API maps to the highest role in our DB enum (OWNER).
                    role: Role.OWNER,
                },
                select: { id: true },
            });
        } catch (error) {
            await this.prisma.project.delete({
                where: { id: project.id },
                select: { id: true },
            });
            throw error;
        }

        return {
            id: project.id,
            title: project.title,
            description: project.description ?? '',
            dueDate: project.dueDate,
            progress: 0,
            memberCount: 1,
            createdAt: project.createdAt,
        };
    }

    // Returns the membership role for a user in a project (or null if not a member)
    async findUserRoleInProject(
        userId: string,
        projectId: string,
    ): Promise<Role | null> {
        const member = await this.prisma.projectMember.findUnique({
            where: {
                userId_projectId: {
                    userId,
                    projectId,
                },
            },
            select: { role: true },
        });

        return member?.role ?? null;
    }

    async updateProjectById(params: {
        projectId: string;
        data: {
            title?: string;
            description?: string;
            dueDate?: Date;
        };
    }): Promise<ProjectUpdateResponse> {
        const project = await this.prisma.project.update({
            where: { id: params.projectId },
            data: params.data,
            select: {
                id: true,
                title: true,
                description: true,
                dueDate: true,
                createdAt: true,
            },
        });

        return {
            ...project,
            description: project.description ?? '',
        };
    }

    async deleteProjectById(projectId: string): Promise<void> {
        await this.prisma.$transaction([
            this.prisma.task.deleteMany({ where: { projectId } }),
            this.prisma.activityLog.deleteMany({ where: { projectId } }),
            this.prisma.projectMember.deleteMany({ where: { projectId } }),
            this.prisma.project.delete({ where: { id: projectId } }),
        ]);
    }

    // Project details for a member (returns null if user is not a member)
    async findProjectDetailsForMember(
        userId: string,
        projectId: string,
    ): Promise<{
        project: {
            id: string;
            title: string;
            description: string;
            dueDate: Date | null;
            createdAt: Date;
            updatedAt: Date;
            _count: { members: number; tasks: number };
            members: ProjectMemberDetails[];
            tasks: ProjectTaskDetails[];
        };
    } | null> {
        const membership = await this.prisma.projectMember.findUnique({
            where: {
                userId_projectId: { userId, projectId },
            },
            select: {
                project: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        dueDate: true,
                        createdAt: true,
                        updatedAt: true,
                        _count: {
                            select: {
                                members: true,
                                tasks: true,
                            },
                        },
                        members: {
                            orderBy: { joinedAt: 'asc' },
                            select: {
                                id: true,
                                role: true,
                                joinedAt: true,
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        avatarUrl: true,
                                        createdAt: true,
                                        updatedAt: true,
                                    },
                                },
                            },
                        },
                        tasks: {
                            orderBy: { createdAt: 'desc' },
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                status: true,
                                priority: true,
                                dueDate: true,
                                createdById: true,
                                createdAt: true,
                                updatedAt: true,
                                assignees: {
                                    select: {
                                        id: true,
                                        userId: true,
                                        taskId: true,
                                        assignedAt: true,
                                        user: {
                                            select: {
                                                id: true,
                                                name: true,
                                                email: true,
                                                avatarUrl: true,
                                            },
                                        },
                                    },
                                },
                                createdBy: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        avatarUrl: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!membership?.project) {
            return null;
        }

        return {
            project: {
                ...membership.project,
                description: membership.project.description ?? '',
            },
        };
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async addMember(projectId: string, userId: string): Promise<ProjectMember> {
        return this.prisma.projectMember.create({
            data: {
                projectId,
                userId,
                role: Role.MEMBER,
            },
        });
    }

    async getProjectMembers(
        projectId: string,
    ): Promise<ProjectMemberWithUser[]> {
        return this.prisma.projectMember.findMany({
            where: { projectId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
    }

    async updateMemberRole(
        projectId: string,
        userId: string,
        role: Role,
    ): Promise<ProjectMember> {
        return this.prisma.projectMember.update({
            where: {
                userId_projectId: {
                    userId,
                    projectId,
                },
            },
            data: { role },
        });
    }

    async removeMember(
        projectId: string,
        userId: string,
    ): Promise<ProjectMember> {
        return this.prisma.projectMember.delete({
            where: {
                userId_projectId: {
                    userId,
                    projectId,
                },
            },
        });
    }
}
