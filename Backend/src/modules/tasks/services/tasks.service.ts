import { BadRequestException, Injectable } from '@nestjs/common';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { TasksRepository } from '../repositories/tasks.repository';
import { TaskBusinessValidator } from '../validators/task-business.validator';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TASK_MESSAGES } from '../constants/task-messages.constant';

@Injectable()
export class TasksService {
    constructor(
        private readonly tasksRepository: TasksRepository,
        private readonly taskBusinessValidator: TaskBusinessValidator,
    ) {}

    async createTask(createTaskDto: CreateTaskDto, currentUserId: string) {
        await this.taskBusinessValidator.validateCreateTask({
            projectId: createTaskDto.projectId,
            assignedToId: createTaskDto.assignedToId,
            createdById: currentUserId,
        });

        const createdTask = await this.tasksRepository.create({
            title: createTaskDto.title,
            description: createTaskDto.description,
            status: createTaskDto.status ?? TaskStatus.TODO,
            priority: createTaskDto.priority ?? TaskPriority.MEDIUM,
            projectId: createTaskDto.projectId,
            assignedToId: createTaskDto.assignedToId,
            createdById: currentUserId,
            dueDate: new Date(createTaskDto.dueDate),
        });

        return createdTask;
    }

    async getTasksByProject(projectId: string, currentUserId: string) {
        await this.taskBusinessValidator.validateProjectAccess({
            projectId,
            userId: currentUserId,
        });
        return this.tasksRepository.findAllByProjectId(projectId);
    }

    async updateTask(
        taskId: string,
        updateTaskDto: UpdateTaskDto,
        currentUserId: string,
    ) {
        const task = await this.taskBusinessValidator.validateTaskAccess({
            taskId,
            userId: currentUserId,
        });

        if (Object.keys(updateTaskDto).length === 0) {
            throw new BadRequestException(TASK_MESSAGES.NO_FIELDS_TO_UPDATE);
        }

        if (updateTaskDto.assignedToId) {
            await this.taskBusinessValidator.validateAssignedUserInProject({
                projectId: task.projectId,
                assignedToId: updateTaskDto.assignedToId,
            });
        }

        const updateData: any = {};

        if (updateTaskDto.title !== undefined) {
            updateData.title = updateTaskDto.title;
        }

        if (updateTaskDto.description !== undefined) {
            updateData.description = updateTaskDto.description;
        }

        if (updateTaskDto.status !== undefined) {
            updateData.status = updateTaskDto.status;
        }

        if (updateTaskDto.priority !== undefined) {
            updateData.priority = updateTaskDto.priority;
        }

        if (updateTaskDto.assignedToId !== undefined) {
            updateData.assignedToId = updateTaskDto.assignedToId;
        }

        if (updateTaskDto.dueDate !== undefined) {
            updateData.dueDate = new Date(updateTaskDto.dueDate);
        }

        return this.tasksRepository.update(taskId, updateData);
    }

    async deleteTask(taskId: string, currentUserId: string) {
        await this.taskBusinessValidator.validateTaskAccess({
            taskId,
            userId: currentUserId,
        });

        await this.tasksRepository.delete(taskId);

        return {
            message: TASK_MESSAGES.TASK_DELETED_SUCCESSFULLY,
        };
    }
}
