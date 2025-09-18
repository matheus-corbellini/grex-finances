# Como Usar os Novos Modais

## 1. Acessar a Página de Teste

Para visualizar todos os modais funcionando, acesse:
```
http://localhost:3000/dashboard/test-modals
```

## 2. Como Integrar em Páginas Existentes

### Exemplo: Adicionando o Modal de Subcategoria na página de Categorias

```tsx
// Na sua página de categorias (ex: src/app/dashboard/categories/page.tsx)
import { AddSubcategoryModal } from "@/components/modals";
import { useState } from "react";

export default function CategoriesPage() {
  const [showAddSubcategoryModal, setShowAddSubcategoryModal] = useState(false);
  const [categories, setCategories] = useState([]);

  const handleAddSubcategory = (data) => {
    // Lógica para salvar a subcategoria
    console.log("Nova subcategoria:", data);
    setShowAddSubcategoryModal(false);
  };

  return (
    <div>
      {/* Seu conteúdo existente */}
      
      {/* Botão para abrir o modal */}
      <Button onClick={() => setShowAddSubcategoryModal(true)}>
        Adicionar Subcategoria
      </Button>

      {/* Modal */}
      <AddSubcategoryModal
        isOpen={showAddSubcategoryModal}
        onClose={() => setShowAddSubcategoryModal(false)}
        onSubmit={handleAddSubcategory}
        categories={categories}
      />
    </div>
  );
}
```

### Exemplo: Adicionando o Modal de Preferências na página de Configurações

```tsx
// Na sua página de configurações
import { AdvancedPreferencesModal } from "@/components/modals";

export default function SettingsPage() {
  const [showAdvancedPreferences, setShowAdvancedPreferences] = useState(false);
  const [preferences, setPreferences] = useState({});

  const handleSavePreferences = (newPreferences) => {
    setPreferences(newPreferences);
    setShowAdvancedPreferences(false);
    // Salvar no backend
  };

  return (
    <div>
      <Button onClick={() => setShowAdvancedPreferences(true)}>
        Preferências Avançadas
      </Button>

      <AdvancedPreferencesModal
        isOpen={showAdvancedPreferences}
        onClose={() => setShowAdvancedPreferences(false)}
        onSave={handleSavePreferences}
        initialPreferences={preferences}
      />
    </div>
  );
}
```

### Exemplo: Adicionando o Modal de Visualização de Transações

```tsx
// Na sua página de transações
import { TransactionViewModal } from "@/components/modals";

export default function TransactionsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };

  const handleEditTransaction = () => {
    // Navegar para página de edição ou abrir modal de edição
    console.log("Editando transação:", selectedTransaction);
  };

  const handleDeleteTransaction = () => {
    // Confirmar e excluir transação
    console.log("Excluindo transação:", selectedTransaction);
    setShowTransactionModal(false);
  };

  return (
    <div>
      {/* Lista de transações */}
      {transactions.map(transaction => (
        <div key={transaction.id} onClick={() => handleViewTransaction(transaction)}>
          {transaction.description} - {transaction.amount}
        </div>
      ))}

      {/* Modal */}
      {selectedTransaction && (
        <TransactionViewModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          transaction={selectedTransaction}
          account={accounts.find(acc => acc.id === selectedTransaction.accountId)}
          category={categories.find(cat => cat.id === selectedTransaction.categoryId)}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          onDuplicate={() => console.log("Duplicar")}
          onShare={() => console.log("Compartilhar")}
        />
      )}
    </div>
  );
}
```

## 3. Modais Disponíveis

### ✅ AddSubcategoryModal
- **Uso**: Adicionar subcategorias a categorias existentes
- **Props principais**: `categories`, `onSubmit`
- **Recursos**: Seletor de categoria, cor, ícone, preview

### ✅ AdvancedPreferencesModal
- **Uso**: Configurações avançadas do sistema
- **Props principais**: `onSave`, `initialPreferences`
- **Recursos**: Interface com abas, switches, selects

### ✅ ReportPreviewModal
- **Uso**: Visualizar relatórios gerados
- **Props principais**: `report`, `onExport`, `onShare`
- **Recursos**: Abas (Resumo, Gráficos, Insights, Detalhes)

### ✅ TransactionViewModal
- **Uso**: Visualizar detalhes de transações
- **Props principais**: `transaction`, `account`, `category`
- **Recursos**: Abas (Detalhes, Observações, Anexos)

### ✅ AccountDetailsModal
- **Uso**: Visualizar detalhes de contas
- **Props principais**: `account`, `accountType`, `recentTransactions`
- **Recursos**: Abas (Visão Geral, Transações, Histórico, Configurações)

## 4. Próximos Passos

1. **Teste os modais** na página `/dashboard/test-modals`
2. **Integre nos locais apropriados** da sua aplicação
3. **Customize os dados** conforme sua estrutura de dados
4. **Adicione as funcionalidades** de backend (salvar, editar, excluir)

## 5. Estrutura de Dados Esperada

Os modais esperam dados no formato definido nos tipos TypeScript em `shared/types/`. Certifique-se de que seus dados seguem essas interfaces:

- `Category` e `Subcategory` para o modal de subcategorias
- `Transaction` para o modal de transações
- `Account` para o modal de contas
- `Report` para o modal de relatórios
