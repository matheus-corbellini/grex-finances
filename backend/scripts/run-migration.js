const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Configuração do banco de dados
const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'grex_finances_dev',
});

async function runMigration() {
    try {
        await client.connect();
        console.log('Conectado ao banco de dados PostgreSQL');

        // Ler o arquivo SQL
        const sqlPath = path.join(__dirname, 'update-recurring-transactions.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        // Executar as queries
        await client.query(sql);
        console.log('Migration executada com sucesso!');

        // Verificar se a tabela foi atualizada
        const result = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default 
      FROM information_schema.columns 
      WHERE table_name = 'recurring_transactions' 
      ORDER BY ordinal_position
    `);

        console.log('\nColunas da tabela recurring_transactions:');
        console.table(result.rows);

    } catch (error) {
        console.error('Erro ao executar migration:', error);
    } finally {
        await client.end();
    }
}

runMigration();
