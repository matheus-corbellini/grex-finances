import { RecurringTransactionsService } from '../services/recurring-transactions.service';
import { CreateRecurringTransactionDto } from '../dto/recurring-transaction.dto';
import { RecurringFrequency } from '../entities/recurring-transaction.entity';

/**
 * Exemplos de uso do sistema de transações recorrentes
 * Este arquivo demonstra como criar diferentes tipos de transações recorrentes
 */
export class RecurringTransactionsExample {
    constructor(private readonly recurringTransactionsService: RecurringTransactionsService) { }

    /**
     * Exemplo 1: Salário mensal
     */
    async createMonthlySalary(userId: string, accountId: string, categoryId: string) {
        const salaryDto: CreateRecurringTransactionDto = {
            accountId,
            description: 'Salário mensal',
            amount: 5000.00,
            type: 'income',
            frequency: RecurringFrequency.MONTHLY,
            startDate: '2024-01-01',
            categoryId,
            notes: 'Salário da empresa',
            autoExecute: true,
            advanceDays: 1,
            tags: ['salário', 'renda-fixa']
        };

        return await this.recurringTransactionsService.create(userId, salaryDto);
    }

    /**
     * Exemplo 2: Aluguel mensal com data de fim
     */
    async createMonthlyRent(userId: string, accountId: string, categoryId: string) {
        const rentDto: CreateRecurringTransactionDto = {
            accountId,
            description: 'Aluguel do apartamento',
            amount: 1200.00,
            type: 'expense',
            frequency: RecurringFrequency.MONTHLY,
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            categoryId,
            notes: 'Aluguel mensal do apartamento',
            autoExecute: true,
            advanceDays: 3,
            tags: ['aluguel', 'moradia']
        };

        return await this.recurringTransactionsService.create(userId, rentDto);
    }

    /**
     * Exemplo 3: Investimento trimestral
     */
    async createQuarterlyInvestment(userId: string, accountId: string, categoryId: string) {
        const investmentDto: CreateRecurringTransactionDto = {
            accountId,
            description: 'Investimento em fundos',
            amount: 2000.00,
            type: 'expense',
            frequency: RecurringFrequency.QUARTERLY,
            startDate: '2024-01-01',
            categoryId,
            notes: 'Investimento trimestral em fundos de renda fixa',
            autoExecute: true,
            advanceDays: 7,
            tags: ['investimento', 'renda-fixa']
        };

        return await this.recurringTransactionsService.create(userId, investmentDto);
    }

    /**
     * Exemplo 4: Freelance a cada 3 dias
     */
    async createFreelanceEvery3Days(userId: string, accountId: string, categoryId: string) {
        const freelanceDto: CreateRecurringTransactionDto = {
            accountId,
            description: 'Freelance de desenvolvimento',
            amount: 500.00,
            type: 'income',
            frequency: RecurringFrequency.CUSTOM,
            startDate: '2024-01-01',
            categoryId,
            notes: 'Projetos de freelance',
            autoExecute: true,
            advanceDays: 1,
            customFrequency: {
                type: 'days',
                interval: 3
            },
            tags: ['freelance', 'desenvolvimento']
        };

        return await this.recurringTransactionsService.create(userId, freelanceDto);
    }

    /**
     * Exemplo 5: Aulas particulares às segundas e sextas
     */
    async createPrivateLessons(userId: string, accountId: string, categoryId: string) {
        const lessonsDto: CreateRecurringTransactionDto = {
            accountId,
            description: 'Aulas particulares de matemática',
            amount: 100.00,
            type: 'income',
            frequency: RecurringFrequency.CUSTOM,
            startDate: '2024-01-01',
            endDate: '2024-06-30',
            categoryId,
            notes: 'Aulas particulares de matemática',
            autoExecute: true,
            advanceDays: 1,
            customFrequency: {
                type: 'weeks',
                interval: 1,
                daysOfWeek: [1, 5] // Segunda e sexta
            },
            tags: ['aulas', 'educação']
        };

        return await this.recurringTransactionsService.create(userId, lessonsDto);
    }

    /**
     * Exemplo 6: Conta de luz todo dia 15 do mês
     */
    async createElectricBill(userId: string, accountId: string, categoryId: string) {
        const billDto: CreateRecurringTransactionDto = {
            accountId,
            description: 'Conta de luz',
            amount: 150.00,
            type: 'expense',
            frequency: RecurringFrequency.CUSTOM,
            startDate: '2024-01-01',
            categoryId,
            notes: 'Conta de energia elétrica',
            autoExecute: true,
            advanceDays: 5,
            customFrequency: {
                type: 'months',
                interval: 1,
                daysOfMonth: [15] // Todo dia 15
            },
            tags: ['conta', 'energia']
        };

        return await this.recurringTransactionsService.create(userId, billDto);
    }

    /**
     * Exemplo 7: Dividendos anuais em janeiro e julho
     */
    async createAnnualDividends(userId: string, accountId: string, categoryId: string) {
        const dividendsDto: CreateRecurringTransactionDto = {
            accountId,
            description: 'Dividendos de ações',
            amount: 1000.00,
            type: 'income',
            frequency: RecurringFrequency.CUSTOM,
            startDate: '2024-01-01',
            categoryId,
            notes: 'Dividendos semestrais de ações',
            autoExecute: true,
            advanceDays: 10,
            customFrequency: {
                type: 'years',
                interval: 1,
                monthsOfYear: [1, 7] // Janeiro e julho
            },
            tags: ['dividendos', 'investimentos']
        };

        return await this.recurringTransactionsService.create(userId, dividendsDto);
    }

    /**
     * Exemplo 8: Transação sem execução automática (manual)
     */
    async createManualRecurring(userId: string, accountId: string, categoryId: string) {
        const manualDto: CreateRecurringTransactionDto = {
            accountId,
            description: 'Revisão do carro',
            amount: 300.00,
            type: 'expense',
            frequency: RecurringFrequency.MONTHLY,
            startDate: '2024-01-01',
            categoryId,
            notes: 'Revisão mensal do veículo',
            autoExecute: false, // Execução manual
            advanceDays: 7,
            tags: ['manutenção', 'veículo']
        };

        return await this.recurringTransactionsService.create(userId, manualDto);
    }

    /**
     * Exemplo de como buscar próximas execuções
     */
    async getUpcomingExecutions(userId: string, days: number = 30) {
        return await this.recurringTransactionsService.getUpcomingExecutions(userId, days);
    }

    /**
     * Exemplo de como executar uma transação manualmente
     */
    async executeManually(userId: string, recurringTransactionId: string, executionDate?: string) {
        return await this.recurringTransactionsService.execute(userId, {
            recurringTransactionId,
            executionDate: executionDate || new Date().toISOString(),
            forceExecution: false
        });
    }

    /**
     * Exemplo de como pausar e retomar uma transação
     */
    async pauseAndResume(userId: string, recurringTransactionId: string) {
        // Pausar
        const paused = await this.recurringTransactionsService.pause(userId, recurringTransactionId);
        console.log('Transação pausada:', paused.id);

        // Retomar
        const resumed = await this.recurringTransactionsService.resume(userId, recurringTransactionId);
        console.log('Transação retomada:', resumed.id);

        return resumed;
    }

    /**
     * Exemplo de como buscar histórico de execuções
     */
    async getExecutionHistory(userId: string, recurringTransactionId: string) {
        return await this.recurringTransactionsService.getExecutionHistory(userId, recurringTransactionId);
    }
}
