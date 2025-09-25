import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional, IsDateString, IsBoolean, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum RecurringFrequency {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    QUARTERLY = 'quarterly',
    YEARLY = 'yearly',
    CUSTOM = 'custom'
}

export enum RecurringStatus {
    ACTIVE = 'active',
    PAUSED = 'paused',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export class CustomFrequencyDto {
    @ApiProperty({ description: 'Tipo de frequência customizada' })
    @IsString()
    type: 'days' | 'weeks' | 'months' | 'years';

    @ApiProperty({ description: 'Intervalo da frequência' })
    @IsNumber()
    interval: number;

    @ApiProperty({ description: 'Dias específicos da semana (0-6, onde 0 = domingo)', required: false })
    @IsOptional()
    @IsNumber({}, { each: true })
    daysOfWeek?: number[];

    @ApiProperty({ description: 'Dias específicos do mês (1-31)', required: false })
    @IsOptional()
    @IsNumber({}, { each: true })
    daysOfMonth?: number[];

    @ApiProperty({ description: 'Meses específicos do ano (1-12)', required: false })
    @IsOptional()
    @IsNumber({}, { each: true })
    monthsOfYear?: number[];
}

export class CreateRecurringTransactionDto {
    @ApiProperty({ description: 'ID da conta' })
    @IsString()
    accountId: string;

    @ApiProperty({ description: 'Descrição da transação recorrente' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Valor da transação' })
    @IsNumber()
    amount: number;

    @ApiProperty({ description: 'Tipo da transação', enum: ['income', 'expense', 'transfer'] })
    @IsEnum(['income', 'expense', 'transfer'])
    type: string;

    @ApiProperty({ description: 'Frequência da recorrência', enum: RecurringFrequency })
    @IsEnum(RecurringFrequency)
    frequency: RecurringFrequency;

    @ApiProperty({ description: 'Data de início da recorrência' })
    @IsDateString()
    startDate: string;

    @ApiProperty({ description: 'Data de fim da recorrência', required: false })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiProperty({ description: 'Observações', required: false })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiProperty({ description: 'ID da categoria', required: false })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiProperty({ description: 'Configuração de frequência customizada', required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => CustomFrequencyDto)
    customFrequency?: CustomFrequencyDto;

    @ApiProperty({ description: 'Tags para organização', required: false })
    @IsOptional()
    @IsString({ each: true })
    tags?: string[];

    @ApiProperty({ description: 'Se deve executar automaticamente', default: true })
    @IsOptional()
    @IsBoolean()
    autoExecute?: boolean;

    @ApiProperty({ description: 'Dias de antecedência para execução (para notificações)', default: 1 })
    @IsOptional()
    @IsNumber()
    advanceDays?: number;
}

export class UpdateRecurringTransactionDto {
    @ApiProperty({ description: 'Descrição da transação recorrente', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Valor da transação', required: false })
    @IsOptional()
    @IsNumber()
    amount?: number;

    @ApiProperty({ description: 'Tipo da transação', enum: ['income', 'expense', 'transfer'], required: false })
    @IsOptional()
    @IsEnum(['income', 'expense', 'transfer'])
    type?: string;

    @ApiProperty({ description: 'Frequência da recorrência', enum: RecurringFrequency, required: false })
    @IsOptional()
    @IsEnum(RecurringFrequency)
    frequency?: RecurringFrequency;

    @ApiProperty({ description: 'Data de início da recorrência', required: false })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiProperty({ description: 'Data de fim da recorrência', required: false })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiProperty({ description: 'Observações', required: false })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiProperty({ description: 'ID da categoria', required: false })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiProperty({ description: 'Configuração de frequência customizada', required: false })
    @IsOptional()
    @ValidateNested()
    @Type(() => CustomFrequencyDto)
    customFrequency?: CustomFrequencyDto;

    @ApiProperty({ description: 'Tags para organização', required: false })
    @IsOptional()
    @IsString({ each: true })
    tags?: string[];

    @ApiProperty({ description: 'Se deve executar automaticamente', required: false })
    @IsOptional()
    @IsBoolean()
    autoExecute?: boolean;

    @ApiProperty({ description: 'Dias de antecedência para execução', required: false })
    @IsOptional()
    @IsNumber()
    advanceDays?: number;

    @ApiProperty({ description: 'Status da recorrência', enum: RecurringStatus, required: false })
    @IsOptional()
    @IsEnum(RecurringStatus)
    status?: RecurringStatus;
}

export class ExecuteRecurringTransactionDto {
    @ApiProperty({ description: 'ID da transação recorrente' })
    @IsString()
    recurringTransactionId: string;

    @ApiProperty({ description: 'Data específica para execução (opcional)', required: false })
    @IsOptional()
    @IsDateString()
    executionDate?: string;

    @ApiProperty({ description: 'Se deve criar transação mesmo se já existir para esta data', default: false })
    @IsOptional()
    @IsBoolean()
    forceExecution?: boolean;
}

export class RecurringTransactionFiltersDto {
    @ApiProperty({ description: 'Filtrar por status', enum: RecurringStatus, required: false })
    @IsOptional()
    @IsEnum(RecurringStatus)
    status?: RecurringStatus;

    @ApiProperty({ description: 'Filtrar por frequência', enum: RecurringFrequency, required: false })
    @IsOptional()
    @IsEnum(RecurringFrequency)
    frequency?: RecurringFrequency;

    @ApiProperty({ description: 'Filtrar por tipo', enum: ['income', 'expense', 'transfer'], required: false })
    @IsOptional()
    @IsEnum(['income', 'expense', 'transfer'])
    type?: string;

    @ApiProperty({ description: 'Filtrar por conta', required: false })
    @IsOptional()
    @IsString()
    accountId?: string;

    @ApiProperty({ description: 'Filtrar por categoria', required: false })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiProperty({ description: 'Filtrar por data de início (from)', required: false })
    @IsOptional()
    @IsDateString()
    startDateFrom?: string;

    @ApiProperty({ description: 'Filtrar por data de início (to)', required: false })
    @IsOptional()
    @IsDateString()
    startDateTo?: string;

    @ApiProperty({ description: 'Filtrar apenas ativas', default: true })
    @IsOptional()
    @IsBoolean()
    activeOnly?: boolean;
}
