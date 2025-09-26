-- Comandos SQL para visualizar transações:

-- Ver todas as transações
SELECT * FROM transactions;

-- Ver transações com informações da conta
SELECT t.*, a.name as account_name 
FROM transactions t 
LEFT JOIN accounts a ON t.accountId = a.id;

-- Ver transações com categoria
SELECT t.*, c.name as category_name 
FROM transactions t 
LEFT JOIN categories c ON t.categoryId = c.id;

-- Ver resumo por tipo
SELECT type, COUNT(*) as total, SUM(amount) as total_amount 
FROM transactions 
GROUP BY type;

-- Ver transações recentes
SELECT * FROM transactions 
ORDER BY date DESC 
LIMIT 10;

-- Ver estrutura da tabela
.schema transactions
