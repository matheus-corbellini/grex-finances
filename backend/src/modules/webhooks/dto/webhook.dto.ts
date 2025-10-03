import { IsString, IsOptional, IsBoolean, IsArray, IsObject, IsUrl } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateWebhookDto {
    @ApiProperty({ description: "Nome do webhook" })
    @IsString()
    name: string;

    @ApiProperty({ description: "URL do webhook" })
    @IsUrl()
    url: string;

    @ApiPropertyOptional({ description: "Descrição do webhook" })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: "Eventos que disparam o webhook",
        example: ["contact.created", "contact.updated", "transaction.created"]
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    events?: string[];

    @ApiPropertyOptional({ description: "Headers customizados" })
    @IsOptional()
    @IsObject()
    headers?: Record<string, string>;

    @ApiPropertyOptional({ description: "Secret para assinatura HMAC" })
    @IsOptional()
    @IsString()
    secret?: string;

    @ApiPropertyOptional({ description: "Status ativo/inativo" })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateWebhookDto {
    @ApiPropertyOptional({ description: "Nome do webhook" })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: "URL do webhook" })
    @IsOptional()
    @IsUrl()
    url?: string;

    @ApiPropertyOptional({ description: "Descrição do webhook" })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        description: "Eventos que disparam o webhook",
        example: ["contact.created", "contact.updated", "transaction.created"]
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    events?: string[];

    @ApiPropertyOptional({ description: "Headers customizados" })
    @IsOptional()
    @IsObject()
    headers?: Record<string, string>;

    @ApiPropertyOptional({ description: "Secret para assinatura HMAC" })
    @IsOptional()
    @IsString()
    secret?: string;

    @ApiPropertyOptional({ description: "Status ativo/inativo" })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
