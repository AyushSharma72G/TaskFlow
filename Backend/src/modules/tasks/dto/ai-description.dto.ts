import { IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
export class AiDescriptionDto {
    @Transform(({ value }) => value?.trim())
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    projectId: string;
}
