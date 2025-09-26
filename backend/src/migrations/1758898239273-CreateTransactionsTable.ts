import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTransactionsTable1758898239273 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criar tabela transactions
        await queryRunner.query(`
            CREATE TABLE "transactions" (
                "id" varchar(36) PRIMARY KEY NOT NULL DEFAULT (uuid()),
                "description" varchar(255) NOT NULL,
                "amount" decimal(10,2) NOT NULL,
                "type" varchar(20) NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
                "status" varchar(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'cancelled')),
                "accountId" varchar(36) NOT NULL,
                "categoryId" varchar(36),
                "date" datetime NOT NULL,
                "notes" text,
                "isRecurring" boolean NOT NULL DEFAULT false,
                "recurringTransactionId" varchar(36),
                "createdAt" timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
                "updatedAt" timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
                CONSTRAINT "FK_transactions_account" FOREIGN KEY ("accountId") REFERENCES "accounts" ("id") ON DELETE CASCADE,
                CONSTRAINT "FK_transactions_category" FOREIGN KEY ("categoryId") REFERENCES "categories" ("id") ON DELETE SET NULL,
                CONSTRAINT "FK_transactions_recurring" FOREIGN KEY ("recurringTransactionId") REFERENCES "recurring_transactions" ("id") ON DELETE SET NULL
            )
        `);

        // Criar índices para melhor performance
        await queryRunner.query(`CREATE INDEX "IDX_transactions_accountId" ON "transactions" ("accountId")`);
        await queryRunner.query(`CREATE INDEX "IDX_transactions_categoryId" ON "transactions" ("categoryId")`);
        await queryRunner.query(`CREATE INDEX "IDX_transactions_date" ON "transactions" ("date")`);
        await queryRunner.query(`CREATE INDEX "IDX_transactions_type" ON "transactions" ("type")`);
        await queryRunner.query(`CREATE INDEX "IDX_transactions_status" ON "transactions" ("status")`);
        await queryRunner.query(`CREATE INDEX "IDX_transactions_isRecurring" ON "transactions" ("isRecurring")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover índices
        await queryRunner.query(`DROP INDEX "IDX_transactions_isRecurring"`);
        await queryRunner.query(`DROP INDEX "IDX_transactions_status"`);
        await queryRunner.query(`DROP INDEX "IDX_transactions_type"`);
        await queryRunner.query(`DROP INDEX "IDX_transactions_date"`);
        await queryRunner.query(`DROP INDEX "IDX_transactions_categoryId"`);
        await queryRunner.query(`DROP INDEX "IDX_transactions_accountId"`);

        // Remover tabela
        await queryRunner.query(`DROP TABLE "transactions"`);
    }

}
