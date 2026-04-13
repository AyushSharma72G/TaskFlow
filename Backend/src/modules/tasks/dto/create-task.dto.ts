import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsOptional,
    IsDateString,
    IsArray,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '@prisma/client';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;

    @IsEnum(TaskPriority)
    @IsOptional()
    priority?: TaskPriority;

    @IsString()
    @IsNotEmpty()
    projectId: string;

    @IsArray()
    @IsString({ each: true })
    assigneeIds: string[];

    @IsDateString()
    @IsOptional()
    dueDate?: string;
}
