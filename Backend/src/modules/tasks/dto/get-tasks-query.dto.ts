import { IsOptional, IsString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class GetTasksQueryDto {
    @IsOptional()
    @IsString()
    cursor?: string; // last task id from previous page

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit: number = 3;
}
