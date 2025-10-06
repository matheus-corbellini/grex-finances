import { IsString, IsOptional, IsBoolean, IsEnum, IsArray, ValidateNested, MinLength, MaxLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";

export enum CategoryType {
    INCOME = "income",
    EXPENSE = "expense",
    TRANSFER = "transfer",
    OTHER = "other"
}

export class CreateCategoryDto {
    @ApiProperty({ example: "Dízimos" })
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @ApiPropertyOptional({ example: "Dízimos recebidos pelos membros" })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @ApiProperty({ example: "income", enum: CategoryType })
    @IsEnum(CategoryType)
    type: CategoryType;

    @ApiPropertyOptional({ example: "#10B981" })
    @IsOptional()
    @IsString()
    color?: string;

    @ApiPropertyOptional({ example: "💰" })
    @IsOptional()
    @IsString()
    icon?: string;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}

export class UpdateCategoryDto {
    @ApiPropertyOptional({ example: "Dízimos" })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name?: string;

    @ApiPropertyOptional({ example: "Dízimos recebidos pelos membros" })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @ApiPropertyOptional({ example: "income", enum: CategoryType })
    @IsOptional()
    @IsEnum(CategoryType)
    type?: CategoryType;

    @ApiPropertyOptional({ example: "#10B981" })
    @IsOptional()
    @IsString()
    color?: string;

    @ApiPropertyOptional({ example: "💰" })
    @IsOptional()
    @IsString()
    icon?: string;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}

export class CategoryResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    type: CategoryType;

    @ApiProperty()
    color?: string;

    @ApiProperty()
    icon?: string;

    @ApiProperty()
    isDefault: boolean;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class ImportCategoryDto {
    @ApiProperty({ example: "Dízimos" })
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: "Dízimos recebidos pelos membros" })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: "income", enum: CategoryType })
    @IsEnum(CategoryType)
    type: CategoryType;

    @ApiPropertyOptional({ example: "#10B981" })
    @IsOptional()
    @IsString()
    color?: string;

    @ApiPropertyOptional({ example: "💰" })
    @IsOptional()
    @IsString()
    icon?: string;

    @ApiPropertyOptional({ example: false })
    @IsOptional()
    @IsBoolean()
    isDefault?: boolean;
}

export class ImportCategoriesDto {
    @ApiProperty({ type: [ImportCategoryDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImportCategoryDto)
    categories: ImportCategoryDto[];
}

export class ExportCategoriesDto {
    @ApiProperty()
    exportedAt: Date;

    @ApiProperty()
    totalCategories: number;

    @ApiProperty()
    type: string;

    @ApiProperty({ type: [ImportCategoryDto] })
    categories: ImportCategoryDto[];
}

export class CategoryStatsDto {
    @ApiProperty()
    total: number;

    @ApiProperty()
    byType: Record<CategoryType, number>;

    @ApiProperty()
    recentlyCreated: number;

    @ApiProperty()
    recentlyUpdated: number;
}
