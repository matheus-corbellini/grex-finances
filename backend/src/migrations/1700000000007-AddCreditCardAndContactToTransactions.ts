import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreditCardAndContactToTransactions1700000000007 implements MigrationInterface {
    name = 'AddCreditCardAndContactToTransactions1700000000007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Adicionar coluna creditCardId
        await queryRunner.query(`
            ALTER TABLE "transactions" 
            ADD COLUMN "credit_card_id" UUID
        `);

        // Adicionar coluna contactId
        await queryRunner.query(`
            ALTER TABLE "transactions" 
            ADD COLUMN "contact_id" UUID
        `);

        // Adicionar foreign keys
        await queryRunner.query(`
            ALTER TABLE "transactions" 
            ADD CONSTRAINT "FK_transactions_credit_card" 
            FOREIGN KEY ("credit_card_id") REFERENCES "credit_cards"("id") 
            ON DELETE SET NULL
        `);

        await queryRunner.query(`
            ALTER TABLE "transactions" 
            ADD CONSTRAINT "FK_transactions_contact" 
            FOREIGN KEY ("contact_id") REFERENCES "contacts"("id") 
            ON DELETE SET NULL
        `);

        // Adicionar índices
        await queryRunner.query(`
            CREATE INDEX "IDX_transactions_credit_card" 
            ON "transactions" ("credit_card_id")
        `);

        await queryRunner.query(`
            CREATE INDEX "IDX_transactions_contact" 
            ON "transactions" ("contact_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover índices
        await queryRunner.query(`DROP INDEX "IDX_transactions_contact"`);
        await queryRunner.query(`DROP INDEX "IDX_transactions_credit_card"`);

        // Remover foreign keys
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_transactions_contact"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP CONSTRAINT "FK_transactions_credit_card"`);

        // Remover colunas
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "contact_id"`);
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "credit_card_id"`);
    }
}
