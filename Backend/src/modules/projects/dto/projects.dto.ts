import {
  IsInt,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export const PROJECT_DUE_FILTERS = [
  'all',
  'overdue',
  'today',
  'this_week',
  'next_30_days',
] as const;

export type ProjectDueFilter = (typeof PROJECT_DUE_FILTERS)[number];

export class CreateProjectDto {
  @IsString()
  @MinLength(4)
  @MaxLength(150)
  @IsNotEmpty()
  title!: string;


  @IsOptional()
  @IsString()
  @MaxLength(280)
  description?: string;


  @IsString()
  @IsDateString()
  @IsNotEmpty()
  dueDate!: string;
}


export class UpdateProjectDto {

  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(150)
  title?: string;


  @IsOptional()
  @IsString()
  @MaxLength(280)
  description?: string;


  @IsOptional()
  @IsString()
  @IsDateString()
  dueDate?: string;
}

export class GetProjectsQueryDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  search?: string;

  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value !== 'string') return undefined;
    const normalized = value.trim().toLowerCase();
    if (normalized === 'true') return true;
    if (normalized === 'false') return false;
    return undefined;
  })
  ownerOnly?: boolean;

  @IsOptional()
  @IsString()
  @IsIn(PROJECT_DUE_FILTERS)
  dueFilter?: ProjectDueFilter;
}

