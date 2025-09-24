import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey, TableIndex } from "typeorm";

export class CreateAccountsTables1700000000000 implements MigrationInterface {
    name = 'CreateAccountsTables1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criar tabela account_types
        await queryRunner.createTable(
            new Table({
                name: "account_types",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid()"
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100",
                        isNullable: false
                    },
                    {
                        name: "category",
                        type: "varchar",
                        length: "50",
                        isNullable: false
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "icon",
                        type: "varchar",
                        length: "50",
                        isNullable: true
                    },
                    {
                        name: "color",
                        type: "varchar",
                        length: "7",
                        isNullable: true
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP"
                    }
                ]
            }),
            true
        );

        // Criar tabela accounts
        await queryRunner.createTable(
            new Table({
                name: "accounts",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid()"
                    },
                    {
                        name: "userId",
                        type: "varchar",
                        length: "36",
                        isNullable: false
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100",
                        isNullable: false
                    },
                    {
                        name: "typeId",
                        type: "varchar",
                        length: "36",
                        isNullable: false
                    },
                    {
                        name: "balance",
                        type: "decimal",
                        precision: 15,
                        scale: 2,
                        default: 0,
                        isNullable: false
                    },
                    {
                        name: "currency",
                        type: "varchar",
                        length: "3",
                        default: "'BRL'",
                        isNullable: false
                    },
                    {
                        name: "isActive",
                        type: "boolean",
                        default: true,
                        isNullable: false
                    },
                    {
                        name: "bankName",
                        type: "varchar",
                        length: "100",
                        isNullable: true
                    },
                    {
                        name: "accountNumber",
                        type: "varchar",
                        length: "50",
                        isNullable: true
                    },
                    {
                        name: "agency",
                        type: "varchar",
                        length: "20",
                        isNullable: true
                    },
                    {
                        name: "description",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "color",
                        type: "varchar",
                        length: "7",
                        isNullable: true
                    },
                    {
                        name: "icon",
                        type: "varchar",
                        length: "50",
                        isNullable: true
                    },
                    {
                        name: "isArchived",
                        type: "boolean",
                        default: false,
                        isNullable: false
                    },
                    {
                        name: "archivedAt",
                        type: "timestamp",
                        isNullable: true
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP"
                    }
                ]
            }),
            true
        );

        // Criar tabela account_balance_history
        await queryRunner.createTable(
            new Table({
                name: "account_balance_history",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        length: "36",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid()"
                    },
                    {
                        name: "accountId",
                        type: "varchar",
                        length: "36",
                        isNullable: false
                    },
                    {
                        name: "previousBalance",
                        type: "decimal",
                        precision: 15,
                        scale: 2,
                        isNullable: false
                    },
                    {
                        name: "newBalance",
                        type: "decimal",
                        precision: 15,
                        scale: 2,
                        isNullable: false
                    },
                    {
                        name: "difference",
                        type: "decimal",
                        precision: 15,
                        scale: 2,
                        isNullable: false
                    },
                    {
                        name: "reason",
                        type: "varchar",
                        length: "200",
                        isNullable: true
                    },
                    {
                        name: "transactionId",
                        type: "varchar",
                        length: "36",
                        isNullable: true
                    },
                    {
                        name: "source",
                        type: "varchar",
                        length: "20",
                        default: "'manual'",
                        isNullable: false
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    }
                ]
            }),
            true
        );

        // Criar foreign keys
        await queryRunner.createForeignKey(
            "accounts",
            new TableForeignKey({
                columnNames: ["typeId"],
                referencedColumnNames: ["id"],
                referencedTableName: "account_types",
                onDelete: "RESTRICT"
            })
        );

        await queryRunner.createForeignKey(
            "account_balance_history",
            new TableForeignKey({
                columnNames: ["accountId"],
                referencedColumnNames: ["id"],
                referencedTableName: "accounts",
                onDelete: "CASCADE"
            })
        );

        // Criar índices para performance
        await queryRunner.createIndex(
            "accounts",
            new TableIndex({
                name: "IDX_accounts_userId",
                columnNames: ["userId"]
            })
        );

        await queryRunner.createIndex(
            "accounts",
            new TableIndex({
                name: "IDX_accounts_typeId",
                columnNames: ["typeId"]
            })
        );

        await queryRunner.createIndex(
            "accounts",
            new TableIndex({
                name: "IDX_accounts_isActive",
                columnNames: ["isActive"]
            })
        );

        await queryRunner.createIndex(
            "accounts",
            new TableIndex({
                name: "IDX_accounts_isArchived",
                columnNames: ["isArchived"]
            })
        );

        await queryRunner.createIndex(
            "account_balance_history",
            new TableIndex({
                name: "IDX_balance_history_accountId",
                columnNames: ["accountId"]
            })
        );

        await queryRunner.createIndex(
            "account_balance_history",
            new TableIndex({
                name: "IDX_balance_history_createdAt",
                columnNames: ["createdAt"]
            })
        );

        await queryRunner.createIndex(
            "account_types",
            new TableIndex({
                name: "IDX_account_types_category",
                columnNames: ["category"]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover foreign keys
        const accountsTable = await queryRunner.getTable("accounts");
        const accountBalanceHistoryTable = await queryRunner.getTable("account_balance_history");

        if (accountsTable) {
            const foreignKey = accountsTable.foreignKeys.find(fk => fk.columnNames.indexOf("typeId") !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey("accounts", foreignKey);
            }
        }

        if (accountBalanceHistoryTable) {
            const foreignKey = accountBalanceHistoryTable.foreignKeys.find(fk => fk.columnNames.indexOf("accountId") !== -1);
            if (foreignKey) {
                await queryRunner.dropForeignKey("account_balance_history", foreignKey);
            }
        }

        // Remover tabelas
        await queryRunner.dropTable("account_balance_history");
        await queryRunner.dropTable("accounts");
        await queryRunner.dropTable("account_types");
    }
}
