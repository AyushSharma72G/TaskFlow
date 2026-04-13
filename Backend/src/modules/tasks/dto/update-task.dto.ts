import {
    IsString,
    IsNotEmpty,
    IsEnum,
    IsOptional,
    IsDateString,
    IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TaskPriority, TaskStatus } from '@prisma/client';

export class UpdateTaskDto {
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    title?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(TaskStatus)
    @IsOptional()
    status?: TaskStatus;

    @IsEnum(TaskPriority)
    @IsOptional()
    priority?: TaskPriority;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === null || value === undefined) {
            return undefined;
        }

        if (!Array.isArray(value)) {
            return [];
        }

        return value.filter(
            (id): id is string => typeof id === 'string' && id.trim() !== '',
        );
    })
    @IsArray()
    @IsString({ each: true })
    assigneeIds?: string[];

    @IsDateString()
    @IsOptional()
    dueDate?: string;
}
