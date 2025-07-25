# Grex Finances

Sistema financeiro completo desenvolvido com Next.js e NestJS.

## 🏗️ Arquitetura

### Frontend (Next.js)

- **Framework**: Next.js 15 com React 19 e TypeScript
- **Estrutura de diretórios organizados por domínio**:
  - `src/services/api/` - Camada de serviços para comunicação com API
  - `src/utils/` - Utilitários para formatação, cálculos e validações
  - `src/components/` - Componentes reutilizáveis
  - `src/hooks/` - Hooks customizados
  - `src/context/` - Context providers para estado global
  - `src/types/` - Tipos TypeScript locais

### Backend (NestJS)

- **Framework**: NestJS com TypeORM e PostgreSQL
- **Arquitetura modular por domínio financeiro**:
  - `modules/users/` - Gestão de usuários e autenticação
  - `modules/accounts/` - Contas bancárias e cartões
  - `modules/transactions/` - Transações financeiras
  - `modules/categories/` - Categorização de transações
  - `modules/budgets/` - Orçamentos e alertas
  - `modules/investments/` - Portfólio de investimentos
  - `modules/goals/` - Metas financeiras
  - `modules/reports/` - Relatórios e análises

### Shared (Tipos TypeScript)

- **Localização**: `shared/types/`
- **Tipos compartilhados** entre frontend e backend
- **Interfaces** para todas as entidades financeiras
- **DTOs** para validação de dados

## 🚀 Funcionalidades Implementadas

### ✅ Estrutura Base

- [x] Módulos organizados por domínio financeiro
- [x] Tipos TypeScript compartilhados
- [x] Serviços de API com interceptors
- [x] Utilitários para cálculos financeiros
- [x] Sistema de autenticação e autorização
- [x] Validações e DTOs estruturados

### 💰 Gestão Financeira

- [x] **Contas**: Múltiplos tipos (conta corrente, poupança, cartão, investimentos)
- [x] **Transações**: CRUD completo com categorização e recorrência
- [x] **Orçamentos**: Planejamento mensal com alertas
- [x] **Categorias**: Sistema hierárquico (categorias e subcategorias)
- [x] **Metas**: Objetivos financeiros com acompanhamento
- [x] **Investimentos**: Portfólio com cálculo de rentabilidade
- [x] **Relatórios**: Análises e insights financeiros

### 🔧 Utilitários Financeiros

- [x] **Formatação de moeda** (Real, Dólar, Euro, etc.)
- [x] **Cálculos financeiros** (juros compostos, prestações, TIR, VPL)
- [x] **Manipulação de datas** financeiras
- [x] **Validações** de CPF, email, valores monetários

### 🔐 Segurança

- [x] **JWT Authentication** com refresh tokens
- [x] **Guards personalizados** para rotas protegidas
- [x] **Controle de acesso** baseado em roles
- [x] **Interceptors** para tratamento de erros

## 📁 Estrutura de Diretórios

```
grex-finances/
├── frontend (Next.js)
│   ├── app/                    # App Router Next.js
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   ├── hooks/             # Hooks customizados
│   │   ├── context/           # Context providers
│   │   ├── services/api/      # Serviços de API
│   │   ├── utils/             # Utilitários frontend
│   │   └── styles/            # Estilos CSS
│   └── package.json
├── backend (NestJS)
│   ├── src/
│   │   ├── modules/           # Módulos por domínio
│   │   │   ├── users/
│   │   │   ├── accounts/
│   │   │   ├── transactions/
│   │   │   ├── categories/
│   │   │   ├── budgets/
│   │   │   ├── investments/
│   │   │   ├── goals/
│   │   │   └── reports/
│   │   ├── common/            # Guards, decorators, DTOs
│   │   └── config/            # Configurações
│   └── package.json
└── shared/
    └── types/                 # Tipos TypeScript compartilhados
        ├── user.types.ts
        ├── account.types.ts
        ├── transaction.types.ts
        ├── budget.types.ts
        ├── investment.types.ts
        ├── goal.types.ts
        └── report.types.ts
```

## 🛠️ Próximos Passos

Para continuar o desenvolvimento:

1. **Implementar as entidades** do backend (User, Account, Transaction, etc.)
2. **Criar os controllers** e services para cada módulo
3. **Implementar middleware de autenticação** JWT
4. **Desenvolver os hooks** customizados do frontend
5. **Criar context providers** para estado global
6. **Integrar com design system** do Figma
7. **Configurar banco de dados** PostgreSQL
8. **Implementar testes** unitários e de integração

## 💡 Observações

- **Estrutura escalável** preparada para crescimento
- **Separação clara** de responsabilidades
- **Tipos seguros** com TypeScript em todo o projeto
- **Reutilização de código** através de utilitários compartilhados
- **Padrões consistentes** entre frontend e backend
- **Arquitetura limpa** seguindo boas práticas

O projeto está com uma base sólida e estruturada para um aplicativo financeiro complexo, pronto para receber a implementação visual e funcional completa.
