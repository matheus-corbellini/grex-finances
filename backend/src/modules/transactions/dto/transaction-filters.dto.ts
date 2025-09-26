import { IsOptional, IsString, IsNumber, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionTypeEnum, TransactionStatusEnum } from './create-transaction.dto';

export class TransactionFiltersDto {
    @ApiProperty({ description: 'ID da conta', required: false })
    @IsOptional()
    @IsString()
    accountId?: string;

    @ApiProperty({ description: 'ID da categoria', required: false })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiProperty({ description: 'Tipo da transação', enum: TransactionTypeEnum, required: false })
    @IsOptional()
    @IsEnum(TransactionTypeEnum)
    type?: TransactionTypeEnum;

    @ApiProperty({ description: 'Status da transação', enum: TransactionStatusEnum, required: false })
    @IsOptional()
    @IsEnum(TransactionStatusEnum)
    status?: TransactionStatusEnum;

    @ApiProperty({ description: 'Data inicial', required: false })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiProperty({ description: 'Data final', required: false })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiProperty({ description: 'Valor mínimo', required: false })
    @IsOptional()
    @IsNumber()
    minAmount?: number;

    @ApiProperty({ description: 'Valor máximo', required: false })
    @IsOptional()
    @IsNumber()
    maxAmount?: number;

    @ApiProperty({ description: 'Busca por descrição', required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ description: 'É transação recorrente', required: false })
    @IsOptional()
    @IsBoolean()
    isRecurring?: boolean;

    @ApiProperty({ description: 'Página', required: false, default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page?: number;

    @ApiProperty({ description: 'Limite de itens por página', required: false, default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit?: number;
}
