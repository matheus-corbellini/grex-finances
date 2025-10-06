import { IsString, IsOptional, IsEmail, IsBoolean, IsEnum, IsNumber, IsObject, IsArray, Min, Max } from "class-validator";

export class CreateOrganizationDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    legalName?: string;

    @IsEnum(['igreja', 'ministerio', 'ong', 'fundacao', 'outro'])
    organizationType: string;

    @IsOptional()
    @IsString()
    document?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    website?: string;

    // Endereço
    @IsOptional()
    @IsString()
    zipCode?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    number?: string;

    @IsOptional()
    @IsString()
    complement?: string;

    @IsOptional()
    @IsString()
    neighborhood?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    country?: string;

    // Personalização
    @IsOptional()
    @IsString()
    logo?: string;

    @IsOptional()
    @IsString()
    primaryColor?: string;

    @IsOptional()
    @IsEnum(['BRL', 'USD', 'EUR'])
    currency?: string;

    @IsOptional()
    @IsString()
    language?: string;

    @IsOptional()
    @IsString()
    timezone?: string;

    @IsOptional()
    @IsString()
    dateFormat?: string;

    // Configurações fiscais
    @IsOptional()
    @IsEnum(['mensal', 'trimestral', 'semestral', 'anual'])
    fiscalPeriod?: string;

    @IsOptional()
    @IsBoolean()
    notifications?: boolean;

    @IsOptional()
    @IsBoolean()
    defaultCategories?: boolean;
}

export class UpdateOrganizationDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    legalName?: string;

    @IsOptional()
    @IsEnum(['igreja', 'ministerio', 'ong', 'fundacao', 'outro'])
    organizationType?: string;

    @IsOptional()
    @IsString()
    document?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    website?: string;

    // Endereço
    @IsOptional()
    @IsString()
    zipCode?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    number?: string;

    @IsOptional()
    @IsString()
    complement?: string;

    @IsOptional()
    @IsString()
    neighborhood?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    state?: string;

    @IsOptional()
    @IsString()
    country?: string;

    // Personalização
    @IsOptional()
    @IsString()
    logo?: string;

    @IsOptional()
    @IsString()
    primaryColor?: string;

    @IsOptional()
    @IsEnum(['BRL', 'USD', 'EUR'])
    currency?: string;

    @IsOptional()
    @IsString()
    language?: string;

    @IsOptional()
    @IsString()
    timezone?: string;

    @IsOptional()
    @IsString()
    dateFormat?: string;

    // Configurações fiscais
    @IsOptional()
    @IsEnum(['mensal', 'trimestral', 'semestral', 'anual'])
    fiscalPeriod?: string;

    @IsOptional()
    @IsBoolean()
    notifications?: boolean;

    @IsOptional()
    @IsBoolean()
    defaultCategories?: boolean;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UploadLogoDto {
    @IsString()
    logoBase64: string;

    @IsOptional()
    @IsString()
    fileName?: string;
}
