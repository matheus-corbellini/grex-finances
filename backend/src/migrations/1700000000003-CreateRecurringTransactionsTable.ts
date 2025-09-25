import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRecurringTransactionsTable1700000000003 implements MigrationInterface {
    name = 'CreateRecurringTransactionsTable1700000000003';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criar tabela recurring_transactions
        await queryRunner.query(`
            CREATE TABLE "recurring_transactions" (
                "id" varchar(36) PRIMARY KEY NOT NULL DEFAULT (uuid()),
                "userId" varchar(36) NOT NULL,
                "accountId" varchar(36) NOT NULL,
                "categoryId" varchar(36),
                "description" varchar(255) NOT NULL,
                "amount" decimal(15,2) NOT NULL,
                "type" varchar(20) NOT NULL,
                "frequency" varchar(20) NOT NULL,
                "startDate" timestamp NOT NULL,
                "endDate" timestamp,
                "status" varchar(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
                "isActive" boolean DEFAULT true,
                "autoExecute" boolean DEFAULT true,
                "advanceDays" integer DEFAULT 1,
                "notes" text,
                "tags" text,
                "customFrequency" text,
                "lastExecutedAt" timestamp,
                "nextExecutionDate" timestamp,
                "executionCount" integer DEFAULT 0,
                "totalExecutions" integer DEFAULT 0,
                "createdAt" timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
                "updatedAt" timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
                CONSTRAINT "FK_recurring_transactions_user" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE,
                CONSTRAINT "FK_recurring_transactions_account" FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE,
                CONSTRAINT "FK_recurring_transactions_category" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE SET NULL
            )
        `);

        // Criar índices para melhor performance
        await queryRunner.query(`
            CREATE INDEX "IDX_RECURRING_TRANSACTIONS_USER_ID" 
            ON recurring_transactions ("userId")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_RECURRING_TRANSACTIONS_STATUS" 
            ON recurring_transactions (status)
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_RECURRING_TRANSACTIONS_NEXT_EXECUTION" 
            ON recurring_transactions ("nextExecutionDate")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_RECURRING_TRANSACTIONS_ACTIVE" 
            ON recurring_transactions ("isActive", status, "autoExecute")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover índices
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_RECURRING_TRANSACTIONS_ACTIVE"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_RECURRING_TRANSACTIONS_NEXT_EXECUTION"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_RECURRING_TRANSACTIONS_STATUS"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_RECURRING_TRANSACTIONS_USER_ID"`);

        // Remover tabela
        await queryRunner.query(`DROP TABLE "recurring_transactions"`);
    }
}
