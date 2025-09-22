import { IsOptional, IsString, IsBoolean, IsEnum } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { AccountTypeEnum } from "./create-account.dto";

export class AccountFiltersDto {
    @ApiPropertyOptional({ description: 'Filtrar por tipo de conta', enum: AccountTypeEnum })
    @IsOptional()
    @IsEnum(AccountTypeEnum)
    type?: AccountTypeEnum;

    @ApiPropertyOptional({ description: 'Filtrar por nome do banco' })
    @IsOptional()
    @IsString()
    bankName?: string;

    @ApiPropertyOptional({ description: 'Filtrar apenas contas ativas' })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ description: 'Filtrar apenas contas arquivadas' })
    @IsOptional()
    @IsBoolean()
    isArchived?: boolean;

    @ApiPropertyOptional({ description: 'Buscar por nome da conta' })
    @IsOptional()
    @IsString()
    search?: string;
}
