import { ApiProperty } from "@nestjs/swagger";

export class AccountSummaryDto {
    @ApiProperty({ description: 'Total de contas' })
    totalAccounts: number;

    @ApiProperty({ description: 'Saldo total de todas as contas' })
    totalBalance: number;

    @ApiProperty({ description: 'Número de contas ativas' })
    activeAccounts: number;

    @ApiProperty({ description: 'Número de contas arquivadas' })
    archivedAccounts: number;

    @ApiProperty({ description: 'Contagem de contas por tipo' })
    accountsByType: Record<string, number>;
}
