import { ApiProperty } from '@nestjs/swagger';

export class TransactionCountDto {
    @ApiProperty({ description: 'Total de transações' })
    total: number;

    @ApiProperty({ description: 'Número de receitas' })
    income: number;

    @ApiProperty({ description: 'Número de despesas' })
    expenses: number;

    @ApiProperty({ description: 'Número de transferências' })
    transfers: number;
}

export class TransactionSummaryDto {
    @ApiProperty({ description: 'Total de receitas' })
    totalIncome: number;

    @ApiProperty({ description: 'Total de despesas' })
    totalExpenses: number;

    @ApiProperty({ description: 'Total de transferências' })
    totalTransfers: number;

    @ApiProperty({ description: 'Valor líquido (receitas - despesas)' })
    netAmount: number;

    @ApiProperty({ description: 'Contagem de transações', type: TransactionCountDto })
    transactionCount: TransactionCountDto;
}
