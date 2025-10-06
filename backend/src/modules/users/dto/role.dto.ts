import { IsString, IsOptional, IsBoolean, IsArray, IsEnum, MinLength, MaxLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Permission } from "../entities/role.entity";

export class CreateRoleDto {
    @ApiProperty({ example: "Administrador" })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @ApiPropertyOptional({ example: "Acesso total ao sistema" })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @ApiProperty({ example: ["user:create", "user:read", "user:update"] })
    @IsArray()
    @IsEnum(Permission, { each: true })
    permissions: Permission[];

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateRoleDto {
    @ApiPropertyOptional({ example: "Administrador" })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name?: string;

    @ApiPropertyOptional({ example: "Acesso total ao sistema" })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @ApiPropertyOptional({ example: ["user:create", "user:read", "user:update"] })
    @IsOptional()
    @IsArray()
    @IsEnum(Permission, { each: true })
    permissions?: Permission[];

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class RoleResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    permissions: Permission[];

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isSystem: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    userCount?: number;
}
