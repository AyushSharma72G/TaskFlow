import {
    BadRequestException,
    Injectable,
    NotFoundException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { TASK_MESSAGES } from '../constants/task-messages.constant';

@Injectable()
export class TaskBusinessValidator {
    constructor(private readonly prisma: PrismaService) {}

    async validateCreateTask(params: {
        projectId: string;
        assigneeIds: string[];
        createdById: string;
    }): Promise<void> {
        const { projectId, assigneeIds, createdById } = params;

        const uniqueAssigneeIds = [...new Set(assigneeIds)];

        const [project, creatorMembership, users, memberships] =
            await Promise.all([
                this.prisma.project.findUnique({
                    where: { id: projectId },
                    select: { id: true },
                }),
                this.prisma.projectMember.findUnique({
                    where: {
                        userId_projectId: {
                            userId: createdById,
                            projectId,
                        },
                    },
                    select: { id: true },
                }),
                this.prisma.user.findMany({
                    where: {
                        id: { in: uniqueAssigneeIds },
                    },
                    select: { id: true },
                }),
                this.prisma.projectMember.findMany({
                    where: {
                        projectId,
                        userId: { in: uniqueAssigneeIds },
                    },
                    select: { userId: true },
                }),
            ]);

        if (!project) {
            throw new NotFoundException(TASK_MESSAGES.PROJECT_NOT_FOUND);
        }

        if (!creatorMembership) {
            throw new ForbiddenException(
                TASK_MESSAGES.CREATOR_NOT_PROJECT_MEMBER,
            );
        }

        if (users.length !== uniqueAssigneeIds.length) {
            throw new NotFoundException(TASK_MESSAGES.ASSIGNED_USER_NOT_FOUND);
        }

        if (memberships.length !== uniqueAssigneeIds.length) {
            throw new BadRequestException(
                TASK_MESSAGES.ASSIGNED_USER_NOT_PROJECT_MEMBER,
            );
        }
    }

    async validateProjectAccess(params: {
        projectId: string;
        userId: string;
    }): Promise<void> {
        const { projectId, userId } = params;

        const [project, membership] = await Promise.all([
            this.prisma.project.findUnique({
                where: { id: projectId },
                select: { id: true },
            }),
            this.prisma.projectMember.findUnique({
                where: {
                    userId_projectId: {
                        userId,
                        projectId,
                    },
                },
                select: { id: true },
            }),
        ]);

        if (!project) {
            throw new NotFoundException(TASK_MESSAGES.PROJECT_NOT_FOUND);
        }

        if (!membership) {
            throw new ForbiddenException(
                TASK_MESSAGES.CREATOR_NOT_PROJECT_MEMBER,
            );
        }
    }

    async validateTaskAccess(params: {
        taskId: string;
        userId: string;
    }): Promise<{
        id: string;
        projectId: string;
        createdById: string;
        status: string;
        title: string;
    }> {
        const { taskId, userId } = params;

        const [task, allMemberships] = await Promise.all([
            this.prisma.task.findUnique({
                where: { id: taskId },
                select: {
                    id: true,
                    projectId: true,
                    createdById: true,
                    status: true,
                    title: true,
                },
            }),

            this.prisma.projectMember.findMany({
                where: { userId },
                select: { projectId: true },
            }),
        ]);

        if (!task) {
            throw new NotFoundException(TASK_MESSAGES.TASK_NOT_FOUND);
        }

        const isMember = allMemberships.some(
            (m) => m.projectId === task.projectId,
        );

        if (!isMember) {
            throw new ForbiddenException(
                TASK_MESSAGES.CREATOR_NOT_PROJECT_MEMBER,
            );
        }

        return task;
    }

    async validateAssigneesInProject(params: {
        projectId: string;
        assigneeIds: string[];
    }): Promise<void> {
        const { projectId, assigneeIds } = params;

        const uniqueAssigneeIds = [...new Set(assigneeIds)];

        const [users, memberships] = await Promise.all([
            this.prisma.user.findMany({
                where: {
                    id: { in: uniqueAssigneeIds },
                },
                select: { id: true },
            }),
            this.prisma.projectMember.findMany({
                where: {
                    projectId,
                    userId: { in: uniqueAssigneeIds },
                },
                select: { userId: true },
            }),
        ]);

        if (users.length !== uniqueAssigneeIds.length) {
            throw new NotFoundException(TASK_MESSAGES.ASSIGNED_USER_NOT_FOUND);
        }

        if (memberships.length !== uniqueAssigneeIds.length) {
            throw new BadRequestException(
                TASK_MESSAGES.ASSIGNED_USER_NOT_PROJECT_MEMBER,
            );
        }
    }
}
