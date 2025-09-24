import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TransactionTypeEnum {
    INCOME = 'income',
    EXPENSE = 'expense',
    TRANSFER = 'transfer'
}

export enum TransactionStatusEnum {
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export class CreateTransactionDto {
    @ApiProperty({ description: 'Descrição da transação' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Valor da transação' })
    @IsNumber()
    amount: number;

    @ApiProperty({ description: 'Tipo da transação', enum: TransactionTypeEnum })
    @IsEnum(TransactionTypeEnum)
    type: TransactionTypeEnum;

    @ApiProperty({ description: 'Status da transação', enum: TransactionStatusEnum })
    @IsEnum(TransactionStatusEnum)
    status: TransactionStatusEnum;

    @ApiProperty({ description: 'ID da conta' })
    @IsString()
    accountId: string;

    @ApiProperty({ description: 'ID da categoria', required: false })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiProperty({ description: 'Data da transação' })
    @IsDateString()
    date: string;

    @ApiProperty({ description: 'Observações', required: false })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiProperty({ description: 'É transação recorrente', required: false })
    @IsOptional()
    @IsBoolean()
    isRecurring?: boolean;

    @ApiProperty({ description: 'ID da transação recorrente', required: false })
    @IsOptional()
    @IsString()
    recurringTransactionId?: string;
}
