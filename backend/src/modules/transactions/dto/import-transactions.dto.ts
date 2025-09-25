import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ImportTransactionDto {
    @ApiProperty({ description: 'Data da transação (formato: YYYY-MM-DD)' })
    @IsString()
    date: string;

    @ApiProperty({ description: 'Descrição da transação' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Valor da transação' })
    @IsString()
    amount: string;

    @ApiProperty({ description: 'Tipo da transação (income, expense, transfer)' })
    @IsString()
    type: string;

    @ApiPropertyOptional({ description: 'Status da transação' })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional({ description: 'Categoria da transação' })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiPropertyOptional({ description: 'Observações' })
    @IsOptional()
    @IsString()
    notes?: string;
}

export class ImportTransactionsDto {
    @ApiProperty({ description: 'Lista de transações para importar' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImportTransactionDto)
    transactions: ImportTransactionDto[];

    @ApiProperty({ description: 'ID da conta para vincular as transações' })
    @IsString()
    accountId: string;

    @ApiPropertyOptional({ description: 'Opções de importação' })
    @IsOptional()
    importOptions?: {
        skipDuplicates?: boolean;
        updateExisting?: boolean;
        defaultCategory?: string;
        defaultStatus?: string;
    };
}

export class ImportResultDto {
    @ApiProperty({ description: 'Número total de transações processadas' })
    totalProcessed: number;

    @ApiProperty({ description: 'Número de transações importadas com sucesso' })
    successCount: number;

    @ApiProperty({ description: 'Número de transações com erro' })
    errorCount: number;

    @ApiProperty({ description: 'Número de transações duplicadas (se skipDuplicates = true)' })
    duplicateCount: number;

    @ApiProperty({ description: 'Lista de erros encontrados' })
    errors: Array<{
        row: number;
        field: string;
        message: string;
        data: any;
    }>;

    @ApiProperty({ description: 'Transações importadas com sucesso' })
    importedTransactions: any[];
}
