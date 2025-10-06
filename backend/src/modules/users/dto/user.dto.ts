import { IsEmail, IsString, IsOptional, IsBoolean, IsPhoneNumber, MinLength, MaxLength, IsEnum } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ example: "joao@exemplo.com" })
    @IsEmail()
    email: string;

    @ApiProperty({ example: "João" })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    firstName: string;

    @ApiProperty({ example: "Silva" })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    lastName: string;

    @ApiProperty({ example: "senha123" })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiPropertyOptional({ example: "(11) 99999-9999" })
    @IsOptional()
    @IsPhoneNumber("BR")
    phone?: string;

    @ApiPropertyOptional({ example: "https://exemplo.com/avatar.jpg" })
    @IsOptional()
    @IsString()
    avatar?: string;
}

export class UpdateUserDto {
    @ApiPropertyOptional({ example: "João" })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    firstName?: string;

    @ApiPropertyOptional({ example: "Silva" })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    lastName?: string;

    @ApiPropertyOptional({ example: "(11) 99999-9999" })
    @IsOptional()
    @IsPhoneNumber("BR")
    phone?: string;

    @ApiPropertyOptional({ example: "https://exemplo.com/avatar.jpg" })
    @IsOptional()
    @IsString()
    avatar?: string;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    emailVerified?: boolean;
}

export class ChangePasswordDto {
    @ApiProperty({ example: "senhaAtual123" })
    @IsString()
    currentPassword: string;

    @ApiProperty({ example: "novaSenha123" })
    @IsString()
    @MinLength(6)
    newPassword: string;
}

export class AssignRoleDto {
    @ApiProperty({ example: "uuid-do-role" })
    @IsString()
    roleId: string;

    @ApiPropertyOptional({ example: "Usuário promovido a administrador" })
    @IsOptional()
    @IsString()
    reason?: string;

    @ApiPropertyOptional({ example: "2024-12-31T23:59:59.000Z" })
    @IsOptional()
    expiresAt?: Date;
}

export class UserResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    phone?: string;

    @ApiProperty()
    avatar?: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    emailVerified: boolean;

    @ApiProperty()
    lastLoginAt?: Date;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    roles?: Array<{
        id: string;
        name: string;
        permissions: string[];
        assignedAt: Date;
        expiresAt?: Date;
    }>;
}
