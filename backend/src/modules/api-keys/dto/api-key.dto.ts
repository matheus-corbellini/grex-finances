import { IsString, IsOptional, IsBoolean, IsArray, IsObject, IsDateString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateApiKeyDto {
    @ApiProperty({ description: "Nome descritivo da chave API" })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: "Descrição da chave API" })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: "Data de expiração da chave" })
    @IsOptional()
    @IsDateString()
    expiresAt?: string;

    @ApiPropertyOptional({
        description: "Permissões da chave",
        example: { contacts: true, transactions: true, webhooks: false }
    })
    @IsOptional()
    @IsObject()
    permissions?: {
        contacts: boolean;
        transactions: boolean;
        webhooks: boolean;
    };

    @ApiPropertyOptional({
        description: "IPs permitidos (vazio = todos)",
        example: ["192.168.1.1", "10.0.0.1"]
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    allowedIps?: string[];
}

export class UpdateApiKeyDto {
    @ApiPropertyOptional({ description: "Nome descritivo da chave API" })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: "Descrição da chave API" })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: "Status ativo/inativo" })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ description: "Data de expiração da chave" })
    @IsOptional()
    @IsDateString()
    expiresAt?: string;

    @ApiPropertyOptional({
        description: "Permissões da chave",
        example: { contacts: true, transactions: true, webhooks: false }
    })
    @IsOptional()
    @IsObject()
    permissions?: {
        contacts: boolean;
        transactions: boolean;
        webhooks: boolean;
    };

    @ApiPropertyOptional({
        description: "IPs permitidos (vazio = todos)",
        example: ["192.168.1.1", "10.0.0.1"]
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    allowedIps?: string[];
}

export class ApiKeyFiltersDto {
    @ApiPropertyOptional({ description: "Filtrar por status ativo" })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ description: "Filtrar por nome" })
    @IsOptional()
    @IsString()
    name?: string;
}
