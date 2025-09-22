# 🗄️ Migrações e Seeds - Grex Finances

Este documento explica como usar as migrações e seeds do sistema Grex Finances.

## 📋 Migrações

As migrações são responsáveis por criar e modificar a estrutura do banco de dados.

### 🚀 Comandos Disponíveis

```bash
# Executar todas as migrações pendentes
npm run migration:run

# Reverter a última migração
npm run migration:revert

# Ver status das migrações
npm run migration:show

# Gerar nova migração (quando necessário)
npm run migration:generate src/migrations/NomeDaMigracao
```

### 📁 Estrutura das Migrações

```
src/migrations/
├── migration.config.ts          # Configuração do TypeORM para migrações
├── 1700000000000-CreateAccountsTables.ts
├── 1700000000001-CreateUsersTables.ts
└── 1700000000002-CreateCategoriesTables.ts
```

### 🗃️ Tabelas Criadas

#### 1. **account_types** - Tipos de Conta
- `id` - UUID primário
- `name` - Nome do tipo (ex: "Conta Corrente")
- `category` - Categoria (bank, wallet, credit_card, savings)
- `description` - Descrição do tipo
- `icon` - Ícone do tipo
- `color` - Cor do tipo
- `createdAt` / `updatedAt` - Timestamps

#### 2. **accounts** - Contas
- `id` - UUID primário
- `userId` - ID do usuário proprietário
- `name` - Nome da conta
- `typeId` - ID do tipo de conta
- `balance` - Saldo atual (decimal 15,2)
- `currency` - Moeda (padrão: BRL)
- `isActive` - Se está ativa
- `bankName` - Nome do banco
- `accountNumber` - Número da conta
- `agency` - Agência
- `description` - Descrição da conta
- `color` / `icon` - Personalização visual
- `isArchived` - Se está arquivada
- `archivedAt` - Data de arquivamento
- `createdAt` / `updatedAt` - Timestamps

#### 3. **account_balance_history** - Histórico de Saldo
- `id` - UUID primário
- `accountId` - ID da conta
- `previousBalance` - Saldo anterior
- `newBalance` - Novo saldo
- `difference` - Diferença
- `reason` - Motivo da alteração
- `transactionId` - ID da transação (opcional)
- `source` - Origem (manual, transaction, sync, adjustment)
- `createdAt` - Timestamp

#### 4. **users** - Usuários
- `id` - UUID primário
- `email` - Email único
- `name` - Nome do usuário
- `firebaseUid` - UID do Firebase
- `isActive` - Se está ativo
- `emailVerified` - Se email foi verificado
- `lastLoginAt` - Último login
- `createdAt` / `updatedAt` - Timestamps

#### 5. **user_profiles** - Perfis de Usuário
- `id` - UUID primário
- `userId` - ID do usuário (FK)
- `firstName` / `lastName` - Nome completo
- `phone` - Telefone
- `avatar` - URL do avatar
- `dateOfBirth` - Data de nascimento
- `address` - Endereço completo
- `city` / `state` / `country` - Localização
- `postalCode` - CEP
- `createdAt` / `updatedAt` - Timestamps

#### 6. **categories** - Categorias
- `id` - UUID primário
- `userId` - ID do usuário proprietário
- `name` - Nome da categoria
- `type` - Tipo (income, expense, transfer)
- `color` / `icon` - Personalização visual
- `description` - Descrição
- `isActive` - Se está ativa
- `isDefault` - Se é categoria padrão
- `createdAt` / `updatedAt` - Timestamps

#### 7. **subcategories** - Subcategorias
- `id` - UUID primário
- `categoryId` - ID da categoria pai (FK)
- `name` - Nome da subcategoria
- `color` / `icon` - Personalização visual
- `description` - Descrição
- `isActive` - Se está ativa
- `createdAt` / `updatedAt` - Timestamps

## 🌱 Seeds

Os seeds são responsáveis por popular o banco de dados com dados iniciais.

### 🚀 Comando

```bash
# Executar todos os seeds
npm run seed:run
```

### 📁 Estrutura dos Seeds

```
src/seeds/
├── run-seeds.ts              # Arquivo principal para executar seeds
├── account-types.seed.ts     # Tipos de conta padrão
├── categories.seed.ts        # Categorias e subcategorias padrão
└── admin-user.seed.ts        # Usuário administrador
```

### 📊 Dados Inseridos

#### 1. **Tipos de Conta** (`account-types.seed.ts`)
- Conta Corrente (bank)
- Carteira Digital (wallet)
- Cartão de Crédito (credit_card)
- Poupança (savings)

#### 2. **Categorias** (`categories.seed.ts`)

**Receitas:**
- Salário
- Freelance
- Investimentos
- Outros

**Despesas:**
- Alimentação (com subcategorias: Supermercado, Restaurante, Delivery)
- Transporte (com subcategorias: Combustível, Uber/Taxi, Ônibus, Metrô)
- Moradia
- Saúde
- Educação
- Lazer
- Outros

#### 3. **Usuário Administrador** (`admin-user.seed.ts`)
- Email: `admin@grexfinances.com`
- Nome: `Administrador`
- Perfil completo criado

## 🔧 Configuração

### Variáveis de Ambiente

Certifique-se de que as seguintes variáveis estão configuradas no arquivo `.env`:

```env
# Banco de dados
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_NAME=grex_finances

# Ambiente
NODE_ENV=development
```

### Primeira Execução

1. **Configurar banco de dados:**
   ```bash
   # Criar banco de dados MySQL
   mysql -u root -p
   CREATE DATABASE grex_finances;
   ```

2. **Executar migrações:**
   ```bash
   npm run migration:run
   ```

3. **Executar seeds:**
   ```bash
   npm run seed:run
   ```

## 🚨 Troubleshooting

### Erro de Conexão com Banco
- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão manualmente

### Erro de Migração
- Verifique se o banco de dados existe
- Confirme se as tabelas não foram criadas manualmente
- Use `npm run migration:show` para ver o status

### Erro de Seed
- Execute as migrações primeiro
- Verifique se as tabelas existem
- Confirme se os dados não foram inseridos anteriormente

## 📝 Notas Importantes

1. **Ordem de Execução:** Sempre execute migrações antes dos seeds
2. **Ambiente de Produção:** Use migrações automáticas apenas em desenvolvimento
3. **Backup:** Faça backup antes de executar migrações em produção
4. **Rollback:** Use `migration:revert` para desfazer migrações se necessário

## 🔄 Workflow de Desenvolvimento

1. Fazer alterações nas entidades
2. Gerar nova migração: `npm run migration:generate src/migrations/NomeDaMigracao`
3. Revisar a migração gerada
4. Executar migração: `npm run migration:run`
5. Atualizar seeds se necessário
6. Executar seeds: `npm run seed:run`
