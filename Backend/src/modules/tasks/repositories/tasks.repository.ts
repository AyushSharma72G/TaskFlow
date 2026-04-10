import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksRepository {
    constructor(private readonly prisma: PrismaService) {}

    private readonly taskInclude = {
        project: true,
        assignees: {
            include: {
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
    } satisfies Prisma.TaskInclude;

    // create the task
    async create(data: {
        title: string;
        description?: string;
        status: Prisma.TaskCreateInput['status'];
        priority: Prisma.TaskCreateInput['priority'];
        projectId: string;
        createdById: string;
        dueDate?: Date;
        assigneeIds: string[];
    }) {
        const { assigneeIds, ...taskData } = data;

        return this.prisma.task.create({
            data: {
                ...taskData,
                assignees: {
                    create: assigneeIds.map((userId) => ({
                        userId,
                    })),
                },
            },
            include: this.taskInclude,
        });
    }

    // find all tasks of a project
    async findAllByProjectId(projectId: string) {
        return this.prisma.task.findMany({
            where: { projectId },
            include: this.taskInclude,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    // find a single task by id
    async findById(taskId: string) {
        return this.prisma.task.findUnique({
            where: { id: taskId },
            include: this.taskInclude,
        });
    }

    // find task users / assignees
    async findTaskUsers(taskId: string) {
        return this.prisma.task.findUnique({
            where: { id: taskId },
            select: {
                id: true,
                title: true,
                assignees: {
                    include: {
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
            },
        });
    }

    // update the task
    async update(
        taskId: string,
        data: {
            title?: string;
            description?: string;
            status?: Prisma.TaskUpdateInput['status'];
            priority?: Prisma.TaskUpdateInput['priority'];
            dueDate?: Date;
            assigneeIds?: string[];
        },
    ) {
        const { assigneeIds, ...taskData } = data;

        return this.prisma.task.update({
            where: { id: taskId },
            data: {
                ...taskData,
                ...(assigneeIds !== undefined
                    ? {
                          assignees: {
                              deleteMany: {},
                              create: assigneeIds.map((userId) => ({
                                  userId,
                              })),
                          },
                      }
                    : {}),
            },
            include: this.taskInclude,
        });
    }

    // delete the task
    async delete(taskId: string) {
        return this.prisma.task.delete({
            where: { id: taskId },
        });
    }
}
