import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
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
    description: string;
    amount: number;
    type: TransactionTypeEnum;
    status: TransactionStatusEnum;
    accountId: string;
    categoryId?: string;
    date: string;
    notes?: string;
    isRecurring?: boolean;
    recurringTransactionId?: string;
}
