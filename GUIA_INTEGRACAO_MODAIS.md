# 📋 Guia de Integração dos Modais

## 🎯 **Onde os Modais Estão Atualmente**

### ✅ **Página de Teste**
- **URL**: `/dashboard/test-modals`
- **Status**: ✅ Funcionando perfeitamente
- **Modais**: Todos os 5 modais disponíveis para teste

---

## 🚀 **Onde Integrar Cada Modal**

### 1. **AddSubcategoryModal** - Adicionar Subcategoria
**Onde usar:**
- 📁 `/dashboard/settings/page.tsx` - Seção de categorias
- 📁 `/dashboard/reports/categories/page.tsx` - Relatórios de categorias

**Como integrar:**
```tsx
// Na página de configurações (settings)
import { AddSubcategoryModal } from "@/components/modals";

// Adicionar botão na seção de categorias
<Button onClick={() => setShowAddSubcategoryModal(true)}>
  <Plus className="w-4 h-4 mr-2" />
  Adicionar Subcategoria
</Button>

// Adicionar o modal
<AddSubcategoryModal
  isOpen={showAddSubcategoryModal}
  onClose={() => setShowAddSubcategoryModal(false)}
  onSubmit={handleAddSubcategory}
  categories={categories}
/>
```

### 2. **AdvancedPreferencesModal** - Preferências Avançadas
**Onde usar:**
- 📁 `/dashboard/settings/page.tsx` - Configurações gerais
- 📁 `/dashboard/settings/account-confirmation/page.tsx` - Configurações de conta

**Como integrar:**
```tsx
// Na página de configurações
import { AdvancedPreferencesModal } from "@/components/modals";

// Adicionar botão nas configurações
<Button onClick={() => setShowAdvancedPreferences(true)}>
  <Settings className="w-4 h-4 mr-2" />
  Preferências Avançadas
</Button>

// Adicionar o modal
<AdvancedPreferencesModal
  isOpen={showAdvancedPreferences}
  onClose={() => setShowAdvancedPreferences(false)}
  onSave={handleSavePreferences}
  initialPreferences={preferences}
/>
```

### 3. **ReportPreviewModal** - Preview de Relatórios
**Onde usar:**
- 📁 `/dashboard/reports/page.tsx` - Página principal de relatórios
- 📁 `/dashboard/reports/cash-flow/page.tsx` - Relatório de fluxo de caixa
- 📁 `/dashboard/reports/income-statement/page.tsx` - Demonstração de resultados
- 📁 `/dashboard/reports/categories/page.tsx` - Relatório de categorias
- 📁 `/dashboard/reports/bank-accounts/page.tsx` - Relatório de contas bancárias

**Como integrar:**
```tsx
// Na página de relatórios
import { ReportPreviewModal } from "@/components/modals";

// Adicionar botão de visualizar relatório
<Button onClick={() => setShowReportPreview(true)}>
  <Eye className="w-4 h-4 mr-2" />
  Visualizar Relatório
</Button>

// Adicionar o modal
<ReportPreviewModal
  isOpen={showReportPreview}
  onClose={() => setShowReportPreview(false)}
  report={generatedReport}
  onExport={handleExportReport}
  onShare={handleShareReport}
/>
```

### 4. **TransactionViewModal** - Visualizar Transação
**Onde usar:**
- 📁 `/dashboard/transactions/page.tsx` - Página de transações
- 📁 `/dashboard/page.tsx` - Dashboard principal (transações recentes)

**Como integrar:**
```tsx
// Na página de transações
import { TransactionViewModal } from "@/components/modals";

// Adicionar ação de visualizar na lista de transações
<Button onClick={() => handleViewTransaction(transaction)}>
  <Eye className="w-4 h-4 mr-2" />
  Visualizar
</Button>

// Adicionar o modal
<TransactionViewModal
  isOpen={showTransactionView}
  onClose={() => setShowTransactionView(false)}
  transaction={selectedTransaction}
  account={accounts.find(acc => acc.id === selectedTransaction.accountId)}
  category={categories.find(cat => cat.id === selectedTransaction.categoryId)}
  onEdit={handleEditTransaction}
  onDelete={handleDeleteTransaction}
  onDuplicate={handleDuplicateTransaction}
  onShare={handleShareTransaction}
/>
```

### 5. **AccountDetailsModal** - Detalhes da Conta
**Onde usar:**
- 📁 `/dashboard/accounts/page.tsx` - Página de contas
- 📁 `/dashboard/page.tsx` - Dashboard principal (resumo de contas)

**Como integrar:**
```tsx
// Na página de contas
import { AccountDetailsModal } from "@/components/modals";

// Adicionar ação de visualizar na lista de contas
<Button onClick={() => handleViewAccount(account)}>
  <Eye className="w-4 h-4 mr-2" />
  Ver Detalhes
</Button>

// Adicionar o modal
<AccountDetailsModal
  isOpen={showAccountDetails}
  onClose={() => setShowAccountDetails(false)}
  account={selectedAccount}
  accountType={accountTypes.find(type => type.id === selectedAccount.typeId)}
  recentTransactions={recentTransactions}
  balanceHistory={balanceHistory}
  onEdit={handleEditAccount}
  onDelete={handleDeleteAccount}
  onExport={handleExportAccount}
  onShare={handleShareAccount}
/>
```

---

## 📍 **Páginas Específicas para Integração**

### 🏠 **Dashboard Principal** (`/dashboard/page.tsx`)
- **TransactionViewModal** - Para transações recentes
- **AccountDetailsModal** - Para resumo de contas

### 💳 **Contas** (`/dashboard/accounts/page.tsx`)
- **AccountDetailsModal** - Visualizar detalhes da conta
- **AdvancedPreferencesModal** - Configurações de conta

### 💰 **Transações** (`/dashboard/transactions/page.tsx`)
- **TransactionViewModal** - Visualizar transação
- **AddSubcategoryModal** - Adicionar subcategoria (se houver seletor de categoria)

### 📊 **Relatórios** (`/dashboard/reports/page.tsx`)
- **ReportPreviewModal** - Visualizar relatórios gerados
- **AdvancedPreferencesModal** - Configurações de relatórios

### ⚙️ **Configurações** (`/dashboard/settings/page.tsx`)
- **AddSubcategoryModal** - Gerenciar subcategorias
- **AdvancedPreferencesModal** - Configurações avançadas

### 🏦 **Cartões** (`/dashboard/cards/page.tsx`)
- **AccountDetailsModal** - Para cartões de crédito (como tipo de conta)

---

## 🔧 **Passos para Integração**

### 1. **Importar o Modal**
```tsx
import { ModalName } from "@/components/modals";
```

### 2. **Adicionar Estado**
```tsx
const [showModal, setShowModal] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
```

### 3. **Criar Handlers**
```tsx
const handleOpenModal = (item) => {
  setSelectedItem(item);
  setShowModal(true);
};

const handleCloseModal = () => {
  setShowModal(false);
  setSelectedItem(null);
};
```

### 4. **Adicionar Botão/Ação**
```tsx
<Button onClick={() => handleOpenModal(item)}>
  <Icon className="w-4 h-4 mr-2" />
  Ação
</Button>
```

### 5. **Adicionar Modal**
```tsx
<ModalName
  isOpen={showModal}
  onClose={handleCloseModal}
  // ... outras props específicas
/>
```

---

## 🎨 **Exemplo Prático - Página de Transações**

Vou mostrar como integrar o `TransactionViewModal` na página de transações:

```tsx
// src/app/dashboard/transactions/page.tsx
import { TransactionViewModal } from "@/components/modals";

export default function Transactions() {
  const [showTransactionView, setShowTransactionView] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionView(true);
  };

  return (
    <DashboardLayout>
      {/* Lista de transações */}
      {transactions.map(transaction => (
        <div key={transaction.id} className="transaction-item">
          <div className="transaction-info">
            <span>{transaction.description}</span>
            <span>{transaction.amount}</span>
          </div>
          <Button onClick={() => handleViewTransaction(transaction)}>
            <Eye className="w-4 h-4 mr-2" />
            Visualizar
          </Button>
        </div>
      ))}

      {/* Modal */}
      {selectedTransaction && (
        <TransactionViewModal
          isOpen={showTransactionView}
          onClose={() => setShowTransactionView(false)}
          transaction={selectedTransaction}
          account={accounts.find(acc => acc.id === selectedTransaction.accountId)}
          category={categories.find(cat => cat.id === selectedTransaction.categoryId)}
          onEdit={() => console.log("Editar")}
          onDelete={() => console.log("Excluir")}
          onDuplicate={() => console.log("Duplicar")}
          onShare={() => console.log("Compartilhar")}
        />
      )}
    </DashboardLayout>
  );
}
```

---

## 🚀 **Próximos Passos**

1. **Escolha uma página** para começar a integração
2. **Siga os passos** de integração acima
3. **Teste o modal** na página escolhida
4. **Repita** para outras páginas conforme necessário
5. **Customize** os dados conforme sua estrutura

Todos os modais estão prontos e podem ser integrados em qualquer página do sistema! 🎉
