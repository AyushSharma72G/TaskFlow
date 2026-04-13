import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class TasksRepository {
    private readonly genAI: GoogleGenerativeAI;

    constructor(
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
    ) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');

        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not configured');
        }

        this.genAI = new GoogleGenerativeAI(apiKey);
    }

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
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                priority: true,
                dueDate: true,
                createdAt: true,

                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },

                assignees: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
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

    // generate task description using Gemini
    async generateDescription(data: { title: string }): Promise<string> {
        const prompt = `
You are an expert project management assistant.

Generate a concise, professional, implementation-focused task description.

Task details:
- Title: ${data.title}

Instructions:
- Write 2 to 3 sentences
- Be clear, practical, and professional
- Describe what needs to be built or completed
- No bullet points
- No markdown
- Return only the description text
        `.trim();

        try {
            const model = this.genAI.getGenerativeModel({
                model: 'gemini-2.5-flash',
            });

            const result = await model.generateContent(prompt);
            const description = result.response.text()?.trim();

            if (!description) {
                throw new InternalServerErrorException(' ');
            }

            return description;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(
                'Failed to generate task description',
            );
        }
    }
}
