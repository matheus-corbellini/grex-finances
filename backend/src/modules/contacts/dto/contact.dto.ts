import { IsString, IsOptional, IsEmail, IsBoolean, IsObject, IsUUID } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateContactDto {
    @ApiPropertyOptional({ description: "ID externo para integração" })
    @IsOptional()
    @IsString()
    externalId?: string;

    @ApiProperty({ description: "Nome do contato" })
    @IsString()
    name: string;

    @ApiPropertyOptional({ description: "Email do contato" })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ description: "Telefone do contato" })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ description: "CPF/CNPJ do contato" })
    @IsOptional()
    @IsString()
    document?: string;

    @ApiPropertyOptional({ description: "Endereço do contato" })
    @IsOptional()
    @IsObject()
    address?: {
        street?: string;
        number?: string;
        complement?: string;
        neighborhood?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
    };

    @ApiPropertyOptional({ description: "Dados adicionais" })
    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}

export class UpdateContactDto {
  @ApiPropertyOptional({ description: "ID externo para integração" })
  @IsOptional()
  @IsString()
  externalId?: string;

  @ApiPropertyOptional({ description: "Nome do contato" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: "Email do contato" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: "Telefone do contato" })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: "CPF/CNPJ do contato" })
  @IsOptional()
  @IsString()
  document?: string;

  @ApiPropertyOptional({ description: "Endereço do contato" })
  @IsOptional()
  @IsObject()
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };

  @ApiPropertyOptional({ description: "Dados adicionais" })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ description: "Status ativo/inativo" })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ContactFiltersDto {
    @ApiPropertyOptional({ description: "Filtrar por nome" })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ description: "Filtrar por email" })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ description: "Filtrar por telefone" })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiPropertyOptional({ description: "Filtrar por CPF/CNPJ" })
    @IsOptional()
    @IsString()
    document?: string;

    @ApiPropertyOptional({ description: "Filtrar por ID externo" })
    @IsOptional()
    @IsString()
    externalId?: string;

    @ApiPropertyOptional({ description: "Filtrar por status ativo" })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
