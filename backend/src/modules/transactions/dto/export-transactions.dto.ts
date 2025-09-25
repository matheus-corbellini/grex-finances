import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ExportFormat {
    CSV = 'csv',
    PDF = 'pdf',
    EXCEL = 'excel'
}

export enum ExportTemplate {
    SIMPLE = 'simple',
    DETAILED = 'detailed',
    BANK_STATEMENT = 'bank_statement',
    TAX_REPORT = 'tax_report'
}

export class ExportTransactionsDto {
    @ApiPropertyOptional({ description: 'Formato de exportação' })
    @IsOptional()
    @IsEnum(ExportFormat)
    format?: ExportFormat = ExportFormat.CSV;

    @ApiPropertyOptional({ description: 'Template de exportação' })
    @IsOptional()
    @IsEnum(ExportTemplate)
    template?: ExportTemplate = ExportTemplate.SIMPLE;

    @ApiPropertyOptional({ description: 'Data inicial (YYYY-MM-DD)' })
    @IsOptional()
    @IsDateString()
    startDate?: string;

    @ApiPropertyOptional({ description: 'Data final (YYYY-MM-DD)' })
    @IsOptional()
    @IsDateString()
    endDate?: string;

    @ApiPropertyOptional({ description: 'ID da conta específica' })
    @IsOptional()
    @IsString()
    accountId?: string;

    @ApiPropertyOptional({ description: 'ID da categoria específica' })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @ApiPropertyOptional({ description: 'Tipo de transação' })
    @IsOptional()
    @IsString()
    type?: string;

    @ApiPropertyOptional({ description: 'Status da transação' })
    @IsOptional()
    @IsString()
    status?: string;

    @ApiPropertyOptional({ description: 'Incluir resumo financeiro' })
    @IsOptional()
    includeSummary?: boolean = true;

    @ApiPropertyOptional({ description: 'Incluir gráficos' })
    @IsOptional()
    includeCharts?: boolean = false;

    @ApiPropertyOptional({ description: 'Nome personalizado do arquivo' })
    @IsOptional()
    @IsString()
    filename?: string;
}

export class ExportResultDto {
    @ApiProperty({ description: 'Conteúdo do arquivo exportado' })
    content: string | Buffer;

    @ApiProperty({ description: 'Nome do arquivo' })
    filename: string;

    @ApiProperty({ description: 'Tipo MIME do arquivo' })
    mimeType: string;

    @ApiProperty({ description: 'Tamanho do arquivo em bytes' })
    size: number;

    @ApiProperty({ description: 'Data de geração' })
    generatedAt: string;

    @ApiProperty({ description: 'Número de transações exportadas' })
    transactionCount: number;

    @ApiPropertyOptional({ description: 'Resumo financeiro (se solicitado)' })
    summary?: any;
}
