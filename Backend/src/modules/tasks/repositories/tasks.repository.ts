import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma, Task } from '@prisma/client';

@Injectable()
export class TasksRepository {
    constructor(private readonly prisma: PrismaService) {}

    //    create the task
    async create(data: Prisma.TaskUncheckedCreateInput): Promise<Task> {
        return this.prisma.task.create({
            data,
            include: {
                project: true,
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
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
        });
    }

    // find all the task of a project
    async findAllByProjectId(projectId: string) {
        return this.prisma.task.findMany({
            where: { projectId },
            include: {
                project: true,
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
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
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    //  find a single task by id

    async findById(taskId: string) {
        return this.prisma.task.findUnique({
            where: { id: taskId },
            include: {
                project: true,
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
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
        });
    }

    //  update the task
    async update(taskId: string, data: Prisma.TaskUncheckedUpdateInput) {
        return this.prisma.task.update({
            where: { id: taskId },
            data,
            include: {
                project: true,
                assignedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
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
        });
    }

    //  delete the task
    async delete(taskId: string) {
        return this.prisma.task.delete({
            where: { id: taskId },
        });
    }
}
