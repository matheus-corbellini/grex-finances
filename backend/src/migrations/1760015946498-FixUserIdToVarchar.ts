import { MigrationInterface, QueryRunner } from "typeorm";

export class FixUserIdToVarchar1760015946498 implements MigrationInterface {
    name = 'FixUserIdToVarchar1760015946498'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Verificar e alterar o tipo de userId em users (se necessário)
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'users' 
                    AND column_name = 'id' 
                    AND data_type = 'uuid'
                ) THEN
                    ALTER TABLE "users" ALTER COLUMN "id" TYPE varchar(255);
                END IF;
            END $$;
        `);

        // Verificar e alterar o tipo de userId em accounts (se necessário)
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'accounts' 
                    AND column_name = 'userId' 
                    AND data_type = 'uuid'
                ) THEN
                    ALTER TABLE "accounts" ALTER COLUMN "userId" TYPE varchar(255);
                END IF;
            END $$;
        `);

        // Verificar e alterar o tipo de userId em categories (se necessário)
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'categories' 
                    AND column_name = 'userId' 
                    AND data_type = 'uuid'
                ) THEN
                    ALTER TABLE "categories" ALTER COLUMN "userId" TYPE varchar(255);
                END IF;
            END $$;
        `);

        // Verificar e alterar o tipo de userId em recurring_transactions (se existir)
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_name = 'recurring_transactions'
                ) AND EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'recurring_transactions' 
                    AND column_name = 'userId' 
                    AND data_type = 'uuid'
                ) THEN
                    ALTER TABLE "recurring_transactions" ALTER COLUMN "userId" TYPE varchar(255);
                END IF;
            END $$;
        `);

        // Verificar e alterar o tipo de userId em budgets (se existir)
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_name = 'budgets'
                ) AND EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'budgets' 
                    AND column_name = 'userId' 
                    AND data_type = 'uuid'
                ) THEN
                    ALTER TABLE "budgets" ALTER COLUMN "userId" TYPE varchar(255);
                END IF;
            END $$;
        `);

        // Verificar e alterar o tipo de userId em goals (se existir)
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_name = 'goals'
                ) AND EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'goals' 
                    AND column_name = 'userId' 
                    AND data_type = 'uuid'
                ) THEN
                    ALTER TABLE "goals" ALTER COLUMN "userId" TYPE varchar(255);
                END IF;
            END $$;
        `);

        // Verificar e alterar o tipo de userId em contacts (se existir)
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_name = 'contacts'
                ) AND EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'contacts' 
                    AND column_name = 'userId' 
                    AND data_type = 'uuid'
                ) THEN
                    ALTER TABLE "contacts" ALTER COLUMN "userId" TYPE varchar(255);
                END IF;
            END $$;
        `);

        // Verificar e alterar o tipo de userId em credit_cards (se existir)
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_name = 'credit_cards'
                ) AND EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'credit_cards' 
                    AND column_name = 'userId' 
                    AND data_type = 'uuid'
                ) THEN
                    ALTER TABLE "credit_cards" ALTER COLUMN "userId" TYPE varchar(255);
                END IF;
            END $$;
        `);

        // Verificar e alterar o tipo de userId em webhooks (se existir)
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_name = 'webhooks'
                ) AND EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'webhooks' 
                    AND column_name = 'userId' 
                    AND data_type = 'uuid'
                ) THEN
                    ALTER TABLE "webhooks" ALTER COLUMN "userId" TYPE varchar(255);
                END IF;
            END $$;
        `);

        // Verificar e alterar o tipo de userId em user_profiles (se existir)
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_name = 'user_profiles'
                ) AND EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'user_profiles' 
                    AND column_name = 'userId' 
                    AND data_type = 'uuid'
                ) THEN
                    ALTER TABLE "user_profiles" ALTER COLUMN "userId" TYPE varchar(255);
                END IF;
            END $$;
        `);

        // Verificar e alterar o tipo de userId em organizations (se existir)
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_name = 'organizations'
                ) AND EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'organizations' 
                    AND column_name = 'userId' 
                    AND data_type = 'uuid'
                ) THEN
                    ALTER TABLE "organizations" ALTER COLUMN "userId" TYPE varchar(255);
                END IF;
            END $$;
        `);

        // Verificar e alterar o tipo de userId em user_preferences (se existir)
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_name = 'user_preferences'
                ) AND EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'user_preferences' 
                    AND column_name = 'userId' 
                    AND data_type = 'uuid'
                ) THEN
                    ALTER TABLE "user_preferences" ALTER COLUMN "userId" TYPE varchar(255);
                END IF;
            END $$;
        `);

        // Verificar e alterar o tipo de userId em investments (se existir)
        await queryRunner.query(`
            DO $$ 
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.tables 
                    WHERE table_name = 'investments'
                ) AND EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name = 'investments' 
                    AND column_name = 'userId' 
                    AND data_type = 'uuid'
                ) THEN
                    ALTER TABLE "investments" ALTER COLUMN "userId" TYPE varchar(255);
                END IF;
            END $$;
        `);

        console.log('✅ Migration concluída: userId alterado para VARCHAR(255) em todas as tabelas');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log('⚠️  Não é possível reverter esta migration automaticamente.');
        console.log('Se necessário, você deve restaurar o backup do banco de dados.');
    }
}

