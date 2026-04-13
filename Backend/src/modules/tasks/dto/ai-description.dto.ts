import { IsString, IsNotEmpty } from 'class-validator';

export class AiDescriptionDto {
    @IsString()
    @IsNotEmpty()
    title: string;
}
