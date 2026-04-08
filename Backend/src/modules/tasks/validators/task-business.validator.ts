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

    //  validate conditions to create the task

    async validateCreateTask(params: {
        projectId: string;
        assignedToId: string;
        createdById: string;
    }): Promise<void> {
        const { projectId, assignedToId, createdById } = params;

        const [project, assignedUser, creatorMembership, assignedMembership] =
            await Promise.all([
                this.prisma.project.findUnique({
                    where: { id: projectId },
                    select: { id: true },
                }),
                this.prisma.user.findUnique({
                    where: { id: assignedToId },
                    select: { id: true },
                }),
                this.prisma.projectMember.findUnique({
                    where: {
                        userId_projectId: {
                            userId: createdById,
                            projectId,
                        },
                    },
                    select: { id: true, role: true },
                }),
                this.prisma.projectMember.findUnique({
                    where: {
                        userId_projectId: {
                            userId: assignedToId,
                            projectId,
                        },
                    },
                    select: { id: true, role: true },
                }),
            ]);

        if (!project) {
            throw new NotFoundException(TASK_MESSAGES.PROJECT_NOT_FOUND);
        }

        if (!assignedUser) {
            throw new NotFoundException(TASK_MESSAGES.ASSIGNED_USER_NOT_FOUND);
        }

        if (!creatorMembership) {
            throw new ForbiddenException(
                TASK_MESSAGES.CREATOR_NOT_PROJECT_MEMBER,
            );
        }

        if (!assignedMembership) {
            throw new BadRequestException(
                TASK_MESSAGES.ASSIGNED_USER_NOT_PROJECT_MEMBER,
            );
        }
    }

    // if the user can change the project

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

    // if the user cann acccess the task
    async validateTaskAccess(params: {
        taskId: string;
        userId: string;
    }): Promise<{
        id: string;
        projectId: string;
        assignedToId: string | null;
        createdById: string;
        status: string;
        title: string;
    }> {
        const { taskId, userId } = params;

        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
            select: {
                id: true,
                projectId: true,
                assignedToId: true,
                createdById: true,
                title: true,
                status: true,
            },
        });

        if (!task) {
            throw new NotFoundException(TASK_MESSAGES.TASK_NOT_FOUND);
        }

        const membership = await this.prisma.projectMember.findUnique({
            where: {
                userId_projectId: {
                    userId,
                    projectId: task.projectId,
                },
            },
            select: { id: true },
        });

        if (!membership) {
            throw new ForbiddenException(
                TASK_MESSAGES.CREATOR_NOT_PROJECT_MEMBER,
            );
        }

        return task;
    }

    // if the user exist in the project

    async validateAssignedUserInProject(params: {
        projectId: string;
        assignedToId: string;
    }): Promise<void> {
        const { projectId, assignedToId } = params;

        const [assignedUser, assignedMembership] = await Promise.all([
            this.prisma.user.findUnique({
                where: { id: assignedToId },
                select: { id: true },
            }),
            this.prisma.projectMember.findUnique({
                where: {
                    userId_projectId: {
                        userId: assignedToId,
                        projectId,
                    },
                },
                select: { id: true },
            }),
        ]);

        if (!assignedUser) {
            throw new NotFoundException(TASK_MESSAGES.ASSIGNED_USER_NOT_FOUND);
        }

        if (!assignedMembership) {
            throw new BadRequestException(
                TASK_MESSAGES.ASSIGNED_USER_NOT_PROJECT_MEMBER,
            );
        }
    }
}
