import { IsOptional, IsString, IsDateString, IsEnum } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export enum HistoryPeriodEnum {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly'
}

export class HistoryFiltersDto {
    @ApiPropertyOptional({ description: 'Data de início (ISO string)' })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ description: 'Data de fim (ISO string)' })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiPropertyOptional({ description: 'Período de agrupamento', enum: HistoryPeriodEnum })
    @IsOptional()
    @IsEnum(HistoryPeriodEnum)
    period?: HistoryPeriodEnum = HistoryPeriodEnum.DAILY;
}
