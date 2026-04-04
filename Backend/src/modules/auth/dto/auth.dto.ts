import {
	IsEmail,
	IsOptional,
	IsString,
	IsUrl,
	MaxLength,
	MinLength,
} from 'class-validator';

export class RegisterDto {
	@IsString()
	@MinLength(2)
	@MaxLength(100)
	name!: string;

	@IsEmail()
	email!: string;

	@IsString()
	@MinLength(8)
	password!: string;
}

export class LoginDto {
	@IsEmail()
	email!: string;

	@IsString()
	@MinLength(8)
	password!: string;
}

export class UpdateProfileDto {
	@IsOptional()
	@IsString()
	@MinLength(2)
	@MaxLength(100)
	name?: string;

	@IsOptional()
	@IsUrl()
	avatarUrl?: string;
}

export class ChangePasswordDto {
	@IsString()
	@MinLength(8)
	oldPassword!: string;

	@IsString()
	@MinLength(8)
	newPassword!: string;
}
