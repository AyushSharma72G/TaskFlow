import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ActivityActionType } from '../constants/activity-action';

export class CreateActivityLogDto {
    action: ActivityActionType;

    @IsOptional()
    @IsString()
    detail?: Record<string, any>;

    @IsUUID()
    projectId: string;

    @IsUUID()
    userId: string;
}
