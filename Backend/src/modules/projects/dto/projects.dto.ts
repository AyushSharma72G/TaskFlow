import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  @IsNotEmpty()
  title!: string;


  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;


  @IsString()
  @IsDateString()
  @IsNotEmpty()
  dueDate!: string;
}


export class UpdateProjectDto {

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  title?: string;


  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;


  @IsOptional()
  @IsString()
  @IsDateString()
  dueDate?: string;
}

