-- Script para atualizar a tabela recurring_transactions
-- Execute este script diretamente no banco de dados PostgreSQL

-- Adicionar novas colunas à tabela recurring_transactions
ALTER TABLE recurring_transactions 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled'));

ALTER TABLE recurring_transactions 
ADD COLUMN IF NOT EXISTS "autoExecute" BOOLEAN DEFAULT true;

ALTER TABLE recurring_transactions 
ADD COLUMN IF NOT EXISTS "advanceDays" INTEGER DEFAULT 1;

ALTER TABLE recurring_transactions 
ADD COLUMN IF NOT EXISTS "customFrequency" JSONB;

ALTER TABLE recurring_transactions 
ADD COLUMN IF NOT EXISTS "lastExecutedAt" TIMESTAMP;

ALTER TABLE recurring_transactions 
ADD COLUMN IF NOT EXISTS "nextExecutionDate" TIMESTAMP;

ALTER TABLE recurring_transactions 
ADD COLUMN IF NOT EXISTS "executionCount" INTEGER DEFAULT 0;

ALTER TABLE recurring_transactions 
ADD COLUMN IF NOT EXISTS "totalExecutions" INTEGER DEFAULT 0;

-- Atualizar enum da coluna frequency
ALTER TABLE recurring_transactions 
ALTER COLUMN frequency TYPE VARCHAR(20);

-- Adicionar índices para melhor performance
CREATE INDEX IF NOT EXISTS "IDX_RECURRING_TRANSACTIONS_USER_ID" 
ON recurring_transactions ("userId");

CREATE INDEX IF NOT EXISTS "IDX_RECURRING_TRANSACTIONS_STATUS" 
ON recurring_transactions (status);

CREATE INDEX IF NOT EXISTS "IDX_RECURRING_TRANSACTIONS_NEXT_EXECUTION" 
ON recurring_transactions ("nextExecutionDate");

CREATE INDEX IF NOT EXISTS "IDX_RECURRING_TRANSACTIONS_ACTIVE" 
ON recurring_transactions ("isActive", status, "autoExecute");

-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'recurring_transactions' 
ORDER BY ordinal_position;
