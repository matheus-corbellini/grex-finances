import { MigrationInterface, QueryRunner } from "typeorm";

export class FixCategoriesTypeColumn1758898239274 implements MigrationInterface {
    name = 'FixCategoriesTypeColumn1758898239274'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Primeiro, atualizar todos os valores nulos para um valor padrão
        await queryRunner.query(`
            UPDATE categories 
            SET type = 'expense' 
            WHERE type IS NULL
        `);
        
        // Depois, alterar a coluna para NOT NULL
        await queryRunner.query(`
            ALTER TABLE categories 
            ALTER COLUMN type SET NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverter a alteração
        await queryRunner.query(`
            ALTER TABLE categories 
            ALTER COLUMN type DROP NOT NULL
        `);
    }
}
