import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RecurringTransactionsService } from '../services/recurring-transactions.service';

@Injectable()
export class RecurringTransactionsTask {
    private readonly logger = new Logger(RecurringTransactionsTask.name);

    constructor(
        private readonly recurringTransactionsService: RecurringTransactionsService,
    ) { }

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async executeRecurringTransactions() {
        this.logger.log('Iniciando execução automática de transações recorrentes...');

        try {
            const result = await this.recurringTransactionsService.executePendingTransactions();

            this.logger.log(`Execução concluída: ${result.executed} transações executadas`);

            if (result.errors.length > 0) {
                this.logger.error(`Erros encontrados: ${result.errors.join(', ')}`);
            }
        } catch (error) {
            this.logger.error('Erro durante execução automática de transações recorrentes:', error);
        }
    }

    @Cron('0 6 * * *') // Todo dia às 6h da manhã
    async checkUpcomingTransactions() {
        this.logger.log('Verificando transações recorrentes que serão executadas hoje...');

        try {
            // Buscar transações que serão executadas hoje
            const upcoming = await this.recurringTransactionsService.getUpcomingExecutions('system', 1);

            if (upcoming.length > 0) {
                this.logger.log(`${upcoming.length} transações recorrentes serão executadas hoje`);

                // Aqui você pode implementar notificações para usuários
                // Por exemplo, enviar email ou push notification
                for (const transaction of upcoming) {
                    this.logger.log(`- ${transaction.description} (${transaction.amount}) será executada hoje`);
                }
            } else {
                this.logger.log('Nenhuma transação recorrente será executada hoje');
            }
        } catch (error) {
            this.logger.error('Erro ao verificar transações próximas:', error);
        }
    }

    @Cron('0 0 1 * *') // Todo dia 1 do mês à meia-noite
    async monthlyRecurringTransactionsReport() {
        this.logger.log('Gerando relatório mensal de transações recorrentes...');

        try {
            // Buscar todas as transações recorrentes ativas
            const activeRecurring = await this.recurringTransactionsService.findAll('system', {
                activeOnly: true,
                status: 'active' as any,
            });

            this.logger.log(`Relatório mensal: ${activeRecurring.length} transações recorrentes ativas`);

            // Estatísticas por frequência
            const frequencyStats = activeRecurring.reduce((acc, transaction) => {
                acc[transaction.frequency] = (acc[transaction.frequency] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            this.logger.log('Distribuição por frequência:', frequencyStats);

            // Estatísticas por tipo
            const typeStats = activeRecurring.reduce((acc, transaction) => {
                acc[transaction.type] = (acc[transaction.type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            this.logger.log('Distribuição por tipo:', typeStats);

        } catch (error) {
            this.logger.error('Erro ao gerar relatório mensal:', error);
        }
    }

    @Cron('0 0 * * 0') // Todo domingo à meia-noite
    async weeklyMaintenance() {
        this.logger.log('Executando manutenção semanal de transações recorrentes...');

        try {
            // Aqui você pode implementar tarefas de manutenção como:
            // - Limpeza de transações antigas
            // - Verificação de integridade
            // - Otimização de índices
            // - Backup de dados importantes

            this.logger.log('Manutenção semanal concluída');
        } catch (error) {
            this.logger.error('Erro durante manutenção semanal:', error);
        }
    }
}
