import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateCreditCardsTable1700000000006 implements MigrationInterface {
    name = 'CreateCreditCardsTable1700000000006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ===== CREATE CREDIT_CARDS TABLE =====
        await queryRunner.createTable(
            new Table({
                name: "credit_cards",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "user_id",
                        type: "uuid"
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100"
                    },
                    {
                        name: "description",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "brand",
                        type: "varchar",
                        length: "20"
                    },
                    {
                        name: "last_four_digits",
                        type: "varchar",
                        length: "4"
                    },
                    {
                        name: "holder_name",
                        type: "varchar",
                        length: "100",
                        isNullable: true
                    },
                    {
                        name: "credit_limit",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        default: 0
                    },
                    {
                        name: "available_limit",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        default: 0
                    },
                    {
                        name: "current_balance",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        default: 0
                    },
                    {
                        name: "interest_rate",
                        type: "decimal",
                        precision: 5,
                        scale: 2,
                        default: 0
                    },
                    {
                        name: "annual_fee",
                        type: "decimal",
                        precision: 5,
                        scale: 2,
                        default: 0
                    },
                    {
                        name: "expiration_date",
                        type: "date",
                        isNullable: true
                    },
                    {
                        name: "closing_date",
                        type: "date",
                        isNullable: true
                    },
                    {
                        name: "due_date",
                        type: "date",
                        isNullable: true
                    },
                    {
                        name: "status",
                        type: "varchar",
                        length: "20",
                        default: "'active'"
                    },
                    {
                        name: "is_active",
                        type: "boolean",
                        default: true
                    },
                    {
                        name: "is_default",
                        type: "boolean",
                        default: false
                    },
                    {
                        name: "external_id",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "metadata",
                        type: "jsonb",
                        isNullable: true
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    }
                ]
            }),
            true
        );

        // ===== ADD CREDIT_CARD_ID TO TRANSACTIONS TABLE =====
        await queryRunner.query(`
            ALTER TABLE "transactions" 
            ADD COLUMN "credit_card_id" UUID
        `);

        // ===== CREATE FOREIGN KEYS =====

        // Credit Cards Foreign Key
        await queryRunner.createForeignKey(
            "credit_cards",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE"
            })
        );

        // Transactions Foreign Key
        await queryRunner.createForeignKey(
            "transactions",
            new TableForeignKey({
                columnNames: ["credit_card_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "credit_cards",
                onDelete: "SET NULL"
            })
        );

        // ===== CREATE INDEXES =====

        // Credit Cards Indexes
        await queryRunner.createIndex(
            "credit_cards",
            new TableIndex({
                name: "IDX_credit_cards_user",
                columnNames: ["user_id"]
            })
        );

        await queryRunner.createIndex(
            "credit_cards",
            new TableIndex({
                name: "IDX_credit_cards_user_active",
                columnNames: ["user_id", "is_active"]
            })
        );

        await queryRunner.createIndex(
            "credit_cards",
            new TableIndex({
                name: "IDX_credit_cards_user_default",
                columnNames: ["user_id", "is_default"]
            })
        );

        await queryRunner.createIndex(
            "credit_cards",
            new TableIndex({
                name: "IDX_credit_cards_status",
                columnNames: ["status"]
            })
        );

        await queryRunner.createIndex(
            "credit_cards",
            new TableIndex({
                name: "IDX_credit_cards_brand",
                columnNames: ["brand"]
            })
        );

        await queryRunner.createIndex(
            "credit_cards",
            new TableIndex({
                name: "IDX_credit_cards_external_id",
                columnNames: ["external_id"]
            })
        );

        // Transactions Indexes
        await queryRunner.createIndex(
            "transactions",
            new TableIndex({
                name: "IDX_transactions_credit_card",
                columnNames: ["credit_card_id"]
            })
        );

        await queryRunner.createIndex(
            "transactions",
            new TableIndex({
                name: "IDX_transactions_credit_card_date",
                columnNames: ["credit_card_id", "date"]
            })
        );

        // ===== INSERT SAMPLE CREDIT CARDS =====
        await queryRunner.query(`
            INSERT INTO "credit_cards" (
                "user_id", "name", "description", "brand", "last_four_digits", 
                "holder_name", "credit_limit", "available_limit", "interest_rate", 
                "annual_fee", "status", "is_default", "metadata"
            ) VALUES
            (
                (SELECT "id" FROM "users" LIMIT 1),
                'Cartão Principal',
                'Cartão de crédito principal da igreja',
                'visa',
                '1234',
                'Igreja Exemplo',
                5000.00,
                5000.00,
                2.99,
                120.00,
                'active',
                true,
                '{"bankName": "Banco do Brasil", "notes": "Cartão corporativo"}'
            ),
            (
                (SELECT "id" FROM "users" LIMIT 1),
                'Cartão Secundário',
                'Cartão para despesas menores',
                'mastercard',
                '5678',
                'Igreja Exemplo',
                2000.00,
                2000.00,
                3.49,
                80.00,
                'active',
                false,
                '{"bankName": "Itaú", "notes": "Cartão pessoal"}'
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys first
        const creditCardsTable = await queryRunner.getTable("credit_cards");
        if (creditCardsTable) {
            const fks = creditCardsTable.foreignKeys;
            for (const fk of fks) {
                await queryRunner.dropForeignKey("credit_cards", fk);
            }
        }

        const transactionsTable = await queryRunner.getTable("transactions");
        if (transactionsTable) {
            const fks = transactionsTable.foreignKeys;
            for (const fk of fks) {
                if (fk.columnNames.includes("credit_card_id")) {
                    await queryRunner.dropForeignKey("transactions", fk);
                }
            }
        }

        // Drop tables
        await queryRunner.dropTable("credit_cards");

        // Remove added column from transactions table
        await queryRunner.query(`
            ALTER TABLE "transactions" 
            DROP COLUMN IF EXISTS "credit_card_id"
        `);
    }
}
