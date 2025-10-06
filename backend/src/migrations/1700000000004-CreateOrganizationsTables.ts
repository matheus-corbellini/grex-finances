import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateOrganizationsTables1700000000004 implements MigrationInterface {
    name = 'CreateOrganizationsTables1700000000004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Criar tabela organizations
        await queryRunner.createTable(
            new Table({
                name: "organizations",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "userId",
                        type: "uuid",
                        isNullable: false
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                        isNullable: false
                    },
                    {
                        name: "legalName",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "organizationType",
                        type: "varchar",
                        length: "50",
                        isNullable: false,
                        default: "'igreja'"
                    },
                    {
                        name: "document",
                        type: "varchar",
                        length: "20",
                        isNullable: true
                    },
                    {
                        name: "phone",
                        type: "varchar",
                        length: "20",
                        isNullable: true
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "website",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "zipCode",
                        type: "varchar",
                        length: "10",
                        isNullable: true
                    },
                    {
                        name: "address",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "number",
                        type: "varchar",
                        length: "10",
                        isNullable: true
                    },
                    {
                        name: "complement",
                        type: "varchar",
                        length: "100",
                        isNullable: true
                    },
                    {
                        name: "neighborhood",
                        type: "varchar",
                        length: "100",
                        isNullable: true
                    },
                    {
                        name: "city",
                        type: "varchar",
                        length: "100",
                        isNullable: true
                    },
                    {
                        name: "state",
                        type: "varchar",
                        length: "50",
                        isNullable: true
                    },
                    {
                        name: "country",
                        type: "varchar",
                        length: "50",
                        isNullable: true,
                        default: "'Brasil'"
                    },
                    {
                        name: "logo",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "logoPath",
                        type: "varchar",
                        length: "500",
                        isNullable: true
                    },
                    {
                        name: "primaryColor",
                        type: "varchar",
                        length: "7",
                        isNullable: false,
                        default: "'#3b82f6'"
                    },
                    {
                        name: "currency",
                        type: "varchar",
                        length: "3",
                        isNullable: false,
                        default: "'BRL'"
                    },
                    {
                        name: "language",
                        type: "varchar",
                        length: "10",
                        isNullable: false,
                        default: "'pt-BR'"
                    },
                    {
                        name: "timezone",
                        type: "varchar",
                        length: "50",
                        isNullable: false,
                        default: "'America/Sao_Paulo'"
                    },
                    {
                        name: "dateFormat",
                        type: "varchar",
                        length: "20",
                        isNullable: false,
                        default: "'DD/MM/YYYY'"
                    },
                    {
                        name: "fiscalPeriod",
                        type: "varchar",
                        length: "20",
                        isNullable: false,
                        default: "'mensal'"
                    },
                    {
                        name: "notifications",
                        type: "boolean",
                        isNullable: false,
                        default: true
                    },
                    {
                        name: "defaultCategories",
                        type: "boolean",
                        isNullable: false,
                        default: true
                    },
                    {
                        name: "isActive",
                        type: "boolean",
                        isNullable: false,
                        default: true
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

        // Criar tabela user_preferences
        await queryRunner.createTable(
            new Table({
                name: "user_preferences",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "userId",
                        type: "uuid",
                        isNullable: false
                    },
                    {
                        name: "orderType",
                        type: "varchar",
                        length: "20",
                        isNullable: false,
                        default: "'crescente'"
                    },
                    {
                        name: "defaultPeriod",
                        type: "varchar",
                        length: "20",
                        isNullable: false,
                        default: "'mensal'"
                    },
                    {
                        name: "defaultCurrency",
                        type: "varchar",
                        length: "3",
                        isNullable: false,
                        default: "'brl'"
                    },
                    {
                        name: "emailNotifications",
                        type: "boolean",
                        isNullable: false,
                        default: true
                    },
                    {
                        name: "pushNotifications",
                        type: "boolean",
                        isNullable: false,
                        default: true
                    },
                    {
                        name: "smsNotifications",
                        type: "boolean",
                        isNullable: false,
                        default: true
                    },
                    {
                        name: "notificationSettings",
                        type: "json",
                        isNullable: false,
                        default: "'{}'"
                    },
                    {
                        name: "dashboardWidgets",
                        type: "json",
                        isNullable: false,
                        default: "'[]'"
                    },
                    {
                        name: "dashboardLayout",
                        type: "varchar",
                        length: "20",
                        isNullable: false,
                        default: "'grid'"
                    },
                    {
                        name: "itemsPerPage",
                        type: "integer",
                        isNullable: false,
                        default: 20
                    },
                    {
                        name: "defaultReportFormat",
                        type: "varchar",
                        length: "10",
                        isNullable: false,
                        default: "'pdf'"
                    },
                    {
                        name: "includeCharts",
                        type: "boolean",
                        isNullable: false,
                        default: true
                    },
                    {
                        name: "includeDetails",
                        type: "boolean",
                        isNullable: false,
                        default: true
                    },
                    {
                        name: "autoBackup",
                        type: "boolean",
                        isNullable: false,
                        default: true
                    },
                    {
                        name: "backupRetentionDays",
                        type: "integer",
                        isNullable: false,
                        default: 7
                    },
                    {
                        name: "backupFrequency",
                        type: "varchar",
                        length: "20",
                        isNullable: false,
                        default: "'daily'"
                    },
                    {
                        name: "sessionTimeout",
                        type: "integer",
                        isNullable: false,
                        default: 30
                    },
                    {
                        name: "twoFactorAuth",
                        type: "boolean",
                        isNullable: false,
                        default: true
                    },
                    {
                        name: "loginNotifications",
                        type: "boolean",
                        isNullable: false,
                        default: true
                    },
                    {
                        name: "integrationSettings",
                        type: "json",
                        isNullable: false,
                        default: "'{}'"
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

        // Criar foreign keys
        await queryRunner.createForeignKey(
            "organizations",
            new TableForeignKey({
                columnNames: ["userId"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE"
            })
        );

        await queryRunner.createForeignKey(
            "user_preferences",
            new TableForeignKey({
                columnNames: ["userId"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE"
            })
        );

        // Criar índices únicos
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_organizations_user_active" 
            ON "organizations" ("userId") 
            WHERE "isActive" = true
        `);

        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_user_preferences_user" 
            ON "user_preferences" ("userId")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remover foreign keys
        const organizationsTable = await queryRunner.getTable("organizations");
        const userPreferencesTable = await queryRunner.getTable("user_preferences");

        if (organizationsTable) {
            const foreignKey = organizationsTable.foreignKeys.find(
                fk => fk.columnNames.indexOf("userId") !== -1
            );
            if (foreignKey) {
                await queryRunner.dropForeignKey("organizations", foreignKey);
            }
        }

        if (userPreferencesTable) {
            const foreignKey = userPreferencesTable.foreignKeys.find(
                fk => fk.columnNames.indexOf("userId") !== -1
            );
            if (foreignKey) {
                await queryRunner.dropForeignKey("user_preferences", foreignKey);
            }
        }

        // Remover tabelas
        await queryRunner.dropTable("user_preferences");
        await queryRunner.dropTable("organizations");
    }
}
