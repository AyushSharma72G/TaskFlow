import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { TaskPriority, TaskStatus } from '@prisma/client';
import { TasksRepository } from '../repositories/tasks.repository';
import { TaskBusinessValidator } from '../validators/task-business.validator';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { AiDescriptionDto } from '../dto/ai-description.dto';
import { TASK_MESSAGES } from '../constants/task-messages.constant';
import { ActivityAction } from 'src/modules/activity_log/constants/activity-action';
import {
    TaskCreatedEvent,
    TaskDeletedEvent,
    TaskStatusChangedEvent,
} from 'src/modules/activity_log/events/activity-log.events';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class TasksService {
    constructor(
        private readonly tasksRepository: TasksRepository,
        private readonly taskBusinessValidator: TaskBusinessValidator,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    async createTask(createTaskDto: CreateTaskDto, currentUserId: string) {
        await this.taskBusinessValidator.validateCreateTask({
            projectId: createTaskDto.projectId,
            assigneeIds: createTaskDto.assigneeIds,
            createdById: currentUserId,
        });

        const createdTask = await this.tasksRepository.create({
            title: createTaskDto.title,
            description: createTaskDto.description,
            status: createTaskDto.status ?? TaskStatus.TODO,
            priority: createTaskDto.priority ?? TaskPriority.MEDIUM,
            projectId: createTaskDto.projectId,
            createdById: currentUserId,
            dueDate: createTaskDto.dueDate
                ? new Date(createTaskDto.dueDate)
                : undefined,
            assigneeIds: [...new Set(createTaskDto.assigneeIds)],
        });

        //logging task creation
        const event = new TaskCreatedEvent(
            createdTask.projectId,
            currentUserId,
            {
                taskTitle: createdTask.title,
                assigneeIds: createTaskDto.assigneeIds ?? [],
            },
        );
        this.eventEmitter.emit(ActivityAction.TASK_CREATED, event);

        return createdTask;
    }

    async getTasksByProject(
        projectId: string,
        currentUserId: string,
        cursor?: string,
        limit?: number,
    ) {
        await this.taskBusinessValidator.validateProjectAccess({
            projectId,
            userId: currentUserId,
        });

        return this.tasksRepository.findAllByProjectId(
            projectId,
            cursor,
            limit,
        );
    }

    async getTaskById(taskId: string, currentUserId: string) {
        await this.taskBusinessValidator.validateTaskAccess({
            taskId,
            userId: currentUserId,
        });

        const task = await this.tasksRepository.findById(taskId);

        if (!task) {
            throw new NotFoundException(TASK_MESSAGES.TASK_NOT_FOUND);
        }

        return task;
    }

    async getTaskAssignees(taskId: string, currentUserId: string) {
        await this.taskBusinessValidator.validateTaskAccess({
            taskId,
            userId: currentUserId,
        });

        const task = await this.tasksRepository.findTaskUsers(taskId);

        return {
            taskId: task?.id,
            taskTitle: task?.title,
            assignees:
                task?.assignees.map((assignment) => assignment.user) ?? [],
        };
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

        if (updateTaskDto.assigneeIds && updateTaskDto.assigneeIds.length > 0) {
            await this.taskBusinessValidator.validateAssigneesInProject({
                projectId: task.projectId,
                assigneeIds: updateTaskDto.assigneeIds,
            });
        }

        const updateData: {
            title?: string;
            description?: string;
            status?: TaskStatus;
            priority?: TaskPriority;
            dueDate?: Date;
            assigneeIds?: string[];
        } = {};

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

        if (updateTaskDto.assigneeIds !== undefined) {
            updateData.assigneeIds = [...new Set(updateTaskDto.assigneeIds)];
        }

        if (updateTaskDto.dueDate !== undefined) {
            updateData.dueDate = new Date(updateTaskDto.dueDate);
        }

        const updatedTask = await this.tasksRepository.update(
            taskId,
            updateData,
        );

        if (
            updateTaskDto.status !== undefined &&
            updateTaskDto.status !== task.status
        ) {
            const event = new TaskStatusChangedEvent(
                task.projectId,
                currentUserId,
                {
                    taskTitle: task.title,
                    from: task.status,
                    to: updateTaskDto.status,
                },
            );
            this.eventEmitter.emit(ActivityAction.TASK_STATUS_CHANGED, event);
        }

        return updatedTask;
    }

    async deleteTask(taskId: string, currentUserId: string) {
        const task = await this.taskBusinessValidator.validateTaskAccess({
            taskId,
            userId: currentUserId,
        });

        await this.tasksRepository.delete(taskId);

        //logging task deletion
        const event = new TaskDeletedEvent(task.projectId, currentUserId, {
            taskTitle: task.title,
        });
        this.eventEmitter.emit(ActivityAction.TASK_DELETED, event);

        return { message: TASK_MESSAGES.TASK_DELETED_SUCCESSFULLY };
    }

    // generate task description
    async generateTaskDescription(
        userId: string,
        aiDescriptionDto: AiDescriptionDto,
    ) {
        // validate user is member of project
        await this.taskBusinessValidator.validateProjectAccess({
            projectId: aiDescriptionDto.projectId,
            userId,
        });

        //  generate description
        const description = await this.tasksRepository.generateDescription({
            title: aiDescriptionDto.title,
        });

        return { description };
    }
}
