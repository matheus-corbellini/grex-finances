import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateUsersRolesAndBillingTables1700000000005 implements MigrationInterface {
    name = 'CreateUsersRolesAndBillingTables1700000000005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // ===== UPDATE USERS TABLE =====
        await queryRunner.query(`
            ALTER TABLE "users" 
            ADD COLUMN "phone" VARCHAR(20),
            ADD COLUMN "avatar" VARCHAR(500),
            ADD COLUMN "last_login_at" TIMESTAMP,
            ADD COLUMN "email_verification_token" VARCHAR(255),
            ADD COLUMN "password_reset_token" VARCHAR(255),
            ADD COLUMN "password_reset_expires" TIMESTAMP,
            ADD COLUMN "login_attempts" INTEGER DEFAULT 0,
            ADD COLUMN "locked_until" TIMESTAMP
        `);

        // ===== CREATE ROLES TABLE =====
        await queryRunner.createTable(
            new Table({
                name: "roles",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "50",
                        isUnique: true
                    },
                    {
                        name: "description",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "permissions",
                        type: "text",
                        isArray: true,
                        default: "ARRAY[]::text[]"
                    },
                    {
                        name: "is_active",
                        type: "boolean",
                        default: true
                    },
                    {
                        name: "is_system",
                        type: "boolean",
                        default: false
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

        // ===== CREATE USER_ROLES TABLE =====
        await queryRunner.createTable(
            new Table({
                name: "user_roles",
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
                        name: "role_id",
                        type: "uuid"
                    },
                    {
                        name: "assigned_by",
                        type: "uuid",
                        isNullable: true
                    },
                    {
                        name: "reason",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "is_active",
                        type: "boolean",
                        default: true
                    },
                    {
                        name: "expires_at",
                        type: "timestamp",
                        isNullable: true
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP"
                    }
                ]
            }),
            true
        );

        // ===== CREATE PLANS TABLE =====
        await queryRunner.createTable(
            new Table({
                name: "plans",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()"
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100",
                        isUnique: true
                    },
                    {
                        name: "description",
                        type: "text"
                    },
                    {
                        name: "type",
                        type: "varchar",
                        length: "20"
                    },
                    {
                        name: "price",
                        type: "decimal",
                        precision: 10,
                        scale: 2
                    },
                    {
                        name: "currency",
                        type: "varchar",
                        length: "3",
                        default: "'BRL'"
                    },
                    {
                        name: "billing_cycle",
                        type: "varchar",
                        length: "20"
                    },
                    {
                        name: "features",
                        type: "jsonb"
                    },
                    {
                        name: "is_active",
                        type: "boolean",
                        default: true
                    },
                    {
                        name: "is_popular",
                        type: "boolean",
                        default: false
                    },
                    {
                        name: "stripe_price_id",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "mercado_pago_plan_id",
                        type: "varchar",
                        length: "255",
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

        // ===== CREATE SUBSCRIPTIONS TABLE =====
        await queryRunner.createTable(
            new Table({
                name: "subscriptions",
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
                        name: "plan_id",
                        type: "uuid"
                    },
                    {
                        name: "status",
                        type: "varchar",
                        length: "20",
                        default: "'inactive'"
                    },
                    {
                        name: "stripe_subscription_id",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "mercado_pago_subscription_id",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "current_period_start",
                        type: "timestamp",
                        isNullable: true
                    },
                    {
                        name: "current_period_end",
                        type: "timestamp",
                        isNullable: true
                    },
                    {
                        name: "trial_start",
                        type: "timestamp",
                        isNullable: true
                    },
                    {
                        name: "trial_end",
                        type: "timestamp",
                        isNullable: true
                    },
                    {
                        name: "cancelled_at",
                        type: "timestamp",
                        isNullable: true
                    },
                    {
                        name: "cancel_reason",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "auto_renew",
                        type: "boolean",
                        default: true
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

        // ===== CREATE PAYMENTS TABLE =====
        await queryRunner.createTable(
            new Table({
                name: "payments",
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
                        name: "subscription_id",
                        type: "uuid"
                    },
                    {
                        name: "amount",
                        type: "decimal",
                        precision: 10,
                        scale: 2
                    },
                    {
                        name: "currency",
                        type: "varchar",
                        length: "3",
                        default: "'BRL'"
                    },
                    {
                        name: "status",
                        type: "varchar",
                        length: "20",
                        default: "'pending'"
                    },
                    {
                        name: "method",
                        type: "varchar",
                        length: "20"
                    },
                    {
                        name: "stripe_payment_intent_id",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "mercado_pago_payment_id",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "pix_code",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "pix_qr_code",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "bank_transfer_code",
                        type: "varchar",
                        length: "255",
                        isNullable: true
                    },
                    {
                        name: "failure_reason",
                        type: "text",
                        isNullable: true
                    },
                    {
                        name: "refunded_at",
                        type: "timestamp",
                        isNullable: true
                    },
                    {
                        name: "refund_reason",
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

        // ===== CREATE FOREIGN KEYS =====

        // User Roles Foreign Keys
        await queryRunner.createForeignKey(
            "user_roles",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE"
            })
        );

        await queryRunner.createForeignKey(
            "user_roles",
            new TableForeignKey({
                columnNames: ["role_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "roles",
                onDelete: "CASCADE"
            })
        );

        await queryRunner.createForeignKey(
            "user_roles",
            new TableForeignKey({
                columnNames: ["assigned_by"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "SET NULL"
            })
        );

        // Subscriptions Foreign Keys
        await queryRunner.createForeignKey(
            "subscriptions",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE"
            })
        );

        await queryRunner.createForeignKey(
            "subscriptions",
            new TableForeignKey({
                columnNames: ["plan_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "plans",
                onDelete: "CASCADE"
            })
        );

        // Payments Foreign Keys
        await queryRunner.createForeignKey(
            "payments",
            new TableForeignKey({
                columnNames: ["user_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE"
            })
        );

        await queryRunner.createForeignKey(
            "payments",
            new TableForeignKey({
                columnNames: ["subscription_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "subscriptions",
                onDelete: "CASCADE"
            })
        );

        // ===== CREATE INDEXES =====

        // User Roles Indexes
        await queryRunner.createIndex(
            "user_roles",
            new TableIndex({
                name: "IDX_user_roles_user_role",
                columnNames: ["user_id", "role_id"],
                isUnique: true
            })
        );

        await queryRunner.createIndex(
            "user_roles",
            new TableIndex({
                name: "IDX_user_roles_active",
                columnNames: ["user_id", "is_active"]
            })
        );

        // Subscriptions Indexes
        await queryRunner.createIndex(
            "subscriptions",
            new TableIndex({
                name: "IDX_subscriptions_user_active",
                columnNames: ["user_id", "status"]
            })
        );

        await queryRunner.createIndex(
            "subscriptions",
            new TableIndex({
                name: "IDX_subscriptions_stripe",
                columnNames: ["stripe_subscription_id"]
            })
        );

        await queryRunner.createIndex(
            "subscriptions",
            new TableIndex({
                name: "IDX_subscriptions_mercado_pago",
                columnNames: ["mercado_pago_subscription_id"]
            })
        );

        // Payments Indexes
        await queryRunner.createIndex(
            "payments",
            new TableIndex({
                name: "IDX_payments_user",
                columnNames: ["user_id"]
            })
        );

        await queryRunner.createIndex(
            "payments",
            new TableIndex({
                name: "IDX_payments_subscription",
                columnNames: ["subscription_id"]
            })
        );

        await queryRunner.createIndex(
            "payments",
            new TableIndex({
                name: "IDX_payments_stripe",
                columnNames: ["stripe_payment_intent_id"]
            })
        );

        await queryRunner.createIndex(
            "payments",
            new TableIndex({
                name: "IDX_payments_mercado_pago",
                columnNames: ["mercado_pago_payment_id"]
            })
        );

        // ===== INSERT DEFAULT ROLES =====
        await queryRunner.query(`
            INSERT INTO "roles" ("name", "description", "permissions", "is_system") VALUES
            ('Administrador', 'Acesso total ao sistema', ARRAY['admin:all'], true),
            ('Gerente', 'Acesso de gerenciamento', ARRAY['user:read', 'user:update', 'transaction:read', 'transaction:update', 'report:read'], false),
            ('Usuário', 'Acesso básico', ARRAY['transaction:read', 'transaction:create', 'account:read', 'category:read'], false)
        `);

        // ===== INSERT DEFAULT PLANS =====
        await queryRunner.query(`
            INSERT INTO "plans" ("name", "description", "type", "price", "currency", "billing_cycle", "features", "is_popular") VALUES
            ('Gratuito', 'Plano gratuito para começar', 'free', 0.00, 'BRL', 'monthly', 
             '{"maxUsers": 1, "maxTransactions": 100, "maxAccounts": 3, "maxCategories": 10, "apiAccess": false, "webhooks": false, "reports": false, "support": "email"}', false),
            ('Básico', 'Ideal para pequenas igrejas', 'basic', 29.90, 'BRL', 'monthly',
             '{"maxUsers": 5, "maxTransactions": 1000, "maxAccounts": 10, "maxCategories": 50, "apiAccess": true, "webhooks": false, "reports": true, "support": "email"}', true),
            ('Premium', 'Para igrejas em crescimento', 'premium', 59.90, 'BRL', 'monthly',
             '{"maxUsers": 20, "maxTransactions": 5000, "maxAccounts": 25, "maxCategories": 100, "apiAccess": true, "webhooks": true, "reports": true, "support": "priority"}', false),
            ('Enterprise', 'Solução completa', 'enterprise', 99.90, 'BRL', 'monthly',
             '{"maxUsers": -1, "maxTransactions": -1, "maxAccounts": -1, "maxCategories": -1, "apiAccess": true, "webhooks": true, "reports": true, "support": "dedicated"}', false)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys first
        const tables = ["payments", "subscriptions", "user_roles", "roles", "plans"];

        for (const table of tables) {
            const foreignKeys = await queryRunner.getTable(table);
            if (foreignKeys) {
                const fks = foreignKeys.foreignKeys;
                for (const fk of fks) {
                    await queryRunner.dropForeignKey(table, fk);
                }
            }
        }

        // Drop tables
        await queryRunner.dropTable("payments");
        await queryRunner.dropTable("subscriptions");
        await queryRunner.dropTable("plans");
        await queryRunner.dropTable("user_roles");
        await queryRunner.dropTable("roles");

        // Remove added columns from users table
        await queryRunner.query(`
            ALTER TABLE "users" 
            DROP COLUMN IF EXISTS "phone",
            DROP COLUMN IF EXISTS "avatar",
            DROP COLUMN IF EXISTS "last_login_at",
            DROP COLUMN IF EXISTS "email_verification_token",
            DROP COLUMN IF EXISTS "password_reset_token",
            DROP COLUMN IF EXISTS "password_reset_expires",
            DROP COLUMN IF EXISTS "login_attempts",
            DROP COLUMN IF EXISTS "locked_until"
        `);
    }
}
