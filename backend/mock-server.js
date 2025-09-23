const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3002', 'http://127.0.0.1:3000', 'http://127.0.0.1:3002'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));
app.use(express.json());

// Mock data para contas
const mockAccounts = [
    {
        id: "1",
        userId: "user1",
        name: "Conta Corrente Sicredi",
        typeId: "1",
        type: {
            id: "1",
            name: "Conta Corrente",
            category: "checking",
            description: "Conta corrente bancária",
            icon: "bank-sicredi"
        },
        balance: 25000.00,
        currency: "BRL",
        isActive: true,
        bankName: "Banco cooperativo Sicredi S.A",
        accountNumber: "12345-6",
        agency: "1234",
        description: "Conta principal",
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "2",
        userId: "user1",
        name: "Conta Poupança BB",
        typeId: "2",
        type: {
            id: "2",
            name: "Poupança",
            category: "savings",
            description: "Conta poupança",
            icon: "bank-bb"
        },
        balance: 15000.00,
        currency: "BRL",
        isActive: true,
        bankName: "Banco do Brasil S.A",
        accountNumber: "67890-1",
        agency: "5678",
        description: "Poupança para emergências",
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// Mock data para categorias
const mockCategories = [
    { id: "1", name: "Alimentação", type: "expense", color: "#FF6B6B", icon: "utensils" },
    { id: "2", name: "Transporte", type: "expense", color: "#4ECDC4", icon: "car" },
    { id: "3", name: "Salário", type: "income", color: "#45B7D1", icon: "briefcase" },
    { id: "4", name: "Freelance", type: "income", color: "#96CEB4", icon: "laptop" },
    { id: "5", name: "Lazer", type: "expense", color: "#FECA57", icon: "smile" },
    { id: "6", name: "Saúde", type: "expense", color: "#FF9FF3", icon: "heart" },
    { id: "7", name: "Educação", type: "expense", color: "#54A0FF", icon: "book" },
    { id: "8", name: "Outros", type: "both", color: "#5F27CD", icon: "more-horizontal" }
];

// Mock data para transações
const mockTransactions = [
    {
        id: "1",
        userId: "user1",
        accountId: "1",
        categoryId: "3",
        amount: 5000.00,
        description: "Salário mensal",
        notes: "Pagamento referente ao mês de julho",
        type: "income",
        status: "completed",
        date: "2024-07-30T09:00:00.000Z",
        tags: ["trabalho", "salário"],
        isRecurring: true,
        createdAt: "2024-07-30T09:00:00.000Z",
        updatedAt: "2024-07-30T09:00:00.000Z"
    },
    {
        id: "2",
        userId: "user1",
        accountId: "1",
        categoryId: "1",
        amount: -150.75,
        description: "Supermercado Extra",
        notes: "Compras da semana",
        type: "expense",
        status: "completed",
        date: "2024-07-29T18:30:00.000Z",
        tags: ["supermercado", "alimentação"],
        location: "Shopping Center Norte",
        isRecurring: false,
        createdAt: "2024-07-29T18:30:00.000Z",
        updatedAt: "2024-07-29T18:30:00.000Z"
    },
    {
        id: "3",
        userId: "user1",
        accountId: "2",
        categoryId: "2",
        amount: -45.90,
        description: "Uber - Corrida",
        notes: "Casa para o trabalho",
        type: "expense",
        status: "completed",
        date: "2024-07-29T08:15:00.000Z",
        tags: ["transporte", "uber"],
        location: "São Paulo, SP",
        isRecurring: false,
        createdAt: "2024-07-29T08:15:00.000Z",
        updatedAt: "2024-07-29T08:15:00.000Z"
    },
    {
        id: "4",
        userId: "user1",
        accountId: "1",
        categoryId: "4",
        amount: 800.00,
        description: "Projeto freelance - Website",
        notes: "Desenvolvimento de site institucional",
        type: "income",
        status: "pending",
        date: "2024-07-28T14:00:00.000Z",
        tags: ["freelance", "desenvolvimento"],
        isRecurring: false,
        createdAt: "2024-07-28T14:00:00.000Z",
        updatedAt: "2024-07-28T14:00:00.000Z"
    },
    {
        id: "5",
        userId: "user1",
        accountId: "2",
        categoryId: "5",
        amount: -89.90,
        description: "Netflix - Assinatura",
        notes: "Plano premium mensal",
        type: "expense",
        status: "completed",
        date: "2024-07-28T00:01:00.000Z",
        tags: ["streaming", "entretenimento"],
        isRecurring: true,
        createdAt: "2024-07-28T00:01:00.000Z",
        updatedAt: "2024-07-28T00:01:00.000Z"
    },
    {
        id: "6",
        userId: "user1",
        accountId: "1",
        categoryId: "6",
        amount: -250.00,
        description: "Consulta médica",
        notes: "Check-up anual",
        type: "expense",
        status: "completed",
        date: "2024-07-27T15:30:00.000Z",
        tags: ["saúde", "médico"],
        location: "Hospital Sírio-Libanês",
        isRecurring: false,
        createdAt: "2024-07-27T15:30:00.000Z",
        updatedAt: "2024-07-27T15:30:00.000Z"
    },
    {
        id: "7",
        userId: "user1",
        accountId: "1",
        categoryId: "7",
        amount: -199.90,
        description: "Curso online - React",
        notes: "Curso avançado de React e Next.js",
        type: "expense",
        status: "completed",
        date: "2024-07-26T10:00:00.000Z",
        tags: ["educação", "programação"],
        isRecurring: false,
        createdAt: "2024-07-26T10:00:00.000Z",
        updatedAt: "2024-07-26T10:00:00.000Z"
    },
    {
        id: "8",
        userId: "user1",
        accountId: "1",
        categoryId: "1",
        amount: -75.50,
        description: "Restaurante Japonês",
        notes: "Jantar em família",
        type: "expense",
        status: "completed",
        date: "2024-07-25T19:45:00.000Z",
        tags: ["alimentação", "restaurante", "família"],
        location: "Shopping Iguatemi",
        isRecurring: false,
        createdAt: "2024-07-25T19:45:00.000Z",
        updatedAt: "2024-07-25T19:45:00.000Z"
    },
    {
        id: "9",
        userId: "user1",
        accountId: "1",
        categoryId: "2",
        amount: -120.00,
        description: "Combustível - Posto Shell",
        notes: "Tanque cheio",
        type: "expense",
        status: "completed",
        date: "2024-07-24T16:20:00.000Z",
        tags: ["combustível", "carro"],
        location: "Av. Paulista, 1000",
        isRecurring: false,
        createdAt: "2024-07-24T16:20:00.000Z",
        updatedAt: "2024-07-24T16:20:00.000Z"
    },
    {
        id: "10",
        userId: "user1",
        accountId: "1",
        categoryId: "8",
        amount: -50.00,
        description: "Transferência para poupança",
        notes: "Reserva de emergência",
        type: "transfer",
        status: "completed",
        date: "2024-07-23T12:00:00.000Z",
        tags: ["poupança", "reserva"],
        isRecurring: true,
        createdAt: "2024-07-23T12:00:00.000Z",
        updatedAt: "2024-07-23T12:00:00.000Z"
    }
];

// Rotas
app.get('/accounts', (req, res) => {
    console.log('GET /accounts - Retornando contas mockadas');
    res.json(mockAccounts);
});

app.post('/accounts', (req, res) => {
    console.log('POST /accounts - Criando nova conta:', req.body);

    // Mapear tipo de conta
    const typeMapping = {
        'bank': { id: '1', name: 'Conta Bancária', category: 'checking', description: 'Conta bancária', icon: 'bank-bb' },
        'wallet': { id: '2', name: 'Carteira Digital', category: 'cash', description: 'Carteira digital', icon: 'wallet' },
        'credit_card': { id: '3', name: 'Cartão de Crédito', category: 'credit_card', description: 'Cartão de crédito', icon: 'credit-card' },
        'savings': { id: '4', name: 'Poupança', category: 'savings', description: 'Conta poupança', icon: 'piggy-bank' }
    };

    const accountType = typeMapping[req.body.type] || typeMapping['bank'];

    const newAccount = {
        id: (mockAccounts.length + 1).toString(),
        userId: "user1",
        name: req.body.name,
        typeId: accountType.id,
        type: accountType,
        balance: req.body.initialBalance || 0,
        currency: req.body.currency || "BRL",
        isActive: true,
        bankName: req.body.bankName,
        accountNumber: req.body.accountNumber,
        agency: req.body.agency,
        description: req.body.description,
        color: req.body.color,
        icon: req.body.icon || accountType.icon,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    mockAccounts.push(newAccount);
    res.status(201).json(newAccount);
});

app.get('/accounts/:id', (req, res) => {
    const account = mockAccounts.find(acc => acc.id === req.params.id);
    if (!account) {
        return res.status(404).json({ message: 'Conta não encontrada' });
    }
    res.json(account);
});

app.delete('/accounts/:id', (req, res) => {
    const index = mockAccounts.findIndex(acc => acc.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ message: 'Conta não encontrada' });
    }
    mockAccounts.splice(index, 1);
    res.status(204).send();
});

app.get('/accounts/:id/balance-history', (req, res) => {
    const mockHistory = [
        { date: "2024-07-01", balance: 20000 },
        { date: "2024-07-05", balance: 22000 },
        { date: "2024-07-10", balance: 21000 },
        { date: "2024-07-15", balance: 23000 },
        { date: "2024-07-20", balance: 22500 },
        { date: "2024-07-25", balance: 24000 },
        { date: "2024-07-30", balance: 25000 }
    ];
    res.json({ history: mockHistory });
});

app.get('/accounts/:accountId/transactions', (req, res) => {
    const { accountId } = req.params;
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    console.log(`GET /accounts/${accountId}/transactions - Parâmetros:`, req.query);

    // Filtrar transações pela conta
    let filteredTransactions = mockTransactions.filter(t => t.accountId === accountId);

    // Aplicar filtros de data se fornecidos
    if (startDate || endDate) {
        filteredTransactions = filteredTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            if (start && transactionDate < start) return false;
            if (end && transactionDate > end) return false;
            return true;
        });
    }

    // Paginação
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    // Enriquecer transações com dados da conta e categoria
    const enrichedTransactions = paginatedTransactions.map(transaction => {
        const account = mockAccounts.find(acc => acc.id === transaction.accountId);
        const category = mockCategories.find(cat => cat.id === transaction.categoryId);

        return {
            ...transaction,
            account: account ? {
                id: account.id,
                name: account.name,
                type: account.type
            } : null,
            category: category ? {
                id: category.id,
                name: category.name,
                type: category.type,
                color: category.color,
                icon: category.icon
            } : null
        };
    });

    res.json({
        transactions: enrichedTransactions,
        total: filteredTransactions.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(filteredTransactions.length / limitNum)
    });
});

// ===== ENDPOINTS DE TRANSAÇÕES =====

// GET /transactions - Listar todas as transações com filtros e paginação
app.get('/transactions', (req, res) => {
    console.log('GET /transactions - Parâmetros:', req.query);

    let filteredTransactions = [...mockTransactions];
    const { page = 1, limit = 10, search, type, status, accountId, categoryId, startDate, endDate } = req.query;

    // Aplicar filtros
    if (search) {
        filteredTransactions = filteredTransactions.filter(t =>
            t.description.toLowerCase().includes(search.toLowerCase()) ||
            t.notes?.toLowerCase().includes(search.toLowerCase())
        );
    }

    if (type) {
        filteredTransactions = filteredTransactions.filter(t => t.type === type);
    }

    if (status) {
        filteredTransactions = filteredTransactions.filter(t => t.status === status);
    }

    if (accountId) {
        filteredTransactions = filteredTransactions.filter(t => t.accountId === accountId);
    }

    if (categoryId) {
        filteredTransactions = filteredTransactions.filter(t => t.categoryId === categoryId);
    }

    if (startDate) {
        filteredTransactions = filteredTransactions.filter(t => new Date(t.date) >= new Date(startDate));
    }

    if (endDate) {
        filteredTransactions = filteredTransactions.filter(t => new Date(t.date) <= new Date(endDate));
    }

    // Ordenar por data (mais recente primeiro)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Aplicar paginação
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    // Enriquecer transações com dados de conta e categoria
    const enrichedTransactions = paginatedTransactions.map(transaction => {
        const account = mockAccounts.find(acc => acc.id === transaction.accountId);
        const category = mockCategories.find(cat => cat.id === transaction.categoryId);

        return {
            ...transaction,
            account: account ? {
                id: account.id,
                name: account.name,
                type: account.type
            } : null,
            category: category || null
        };
    });

    res.json({
        transactions: enrichedTransactions,
        total: filteredTransactions.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(filteredTransactions.length / limit)
    });
});

// GET /transactions/:id - Obter transação por ID
app.get('/transactions/:id', (req, res) => {
    console.log('GET /transactions/:id - ID:', req.params.id);

    const transaction = mockTransactions.find(t => t.id === req.params.id);
    if (!transaction) {
        return res.status(404).json({ message: 'Transação não encontrada' });
    }

    // Enriquecer com dados de conta e categoria
    const account = mockAccounts.find(acc => acc.id === transaction.accountId);
    const category = mockCategories.find(cat => cat.id === transaction.categoryId);

    const enrichedTransaction = {
        ...transaction,
        account: account ? {
            id: account.id,
            name: account.name,
            type: account.type
        } : null,
        category: category || null
    };

    res.json(enrichedTransaction);
});

// POST /transactions - Criar nova transação
app.post('/transactions', (req, res) => {
    console.log('POST /transactions - Criando nova transação:', req.body);

    const newTransaction = {
        id: (mockTransactions.length + 1).toString(),
        userId: "user1",
        accountId: req.body.accountId,
        categoryId: req.body.categoryId,
        amount: req.body.amount,
        description: req.body.description,
        notes: req.body.notes || null,
        type: req.body.type,
        status: "completed",
        date: req.body.date || new Date().toISOString(),
        tags: req.body.tags || [],
        location: req.body.location || null,
        isRecurring: req.body.isRecurring || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    mockTransactions.push(newTransaction);

    // Atualizar saldo da conta baseado no tipo da transação
    const account = mockAccounts.find(acc => acc.id === req.body.accountId);
    if (account) {
        // Receita: adiciona ao saldo (valor positivo)
        // Despesa: subtrai do saldo (valor negativo)
        const balanceChange = req.body.type === 'income' ? req.body.amount : -req.body.amount;
        account.balance += balanceChange;
        account.updatedAt = new Date().toISOString();

        console.log(`💰 Saldo da conta ${account.name} atualizado: ${account.balance} (${req.body.type}: ${req.body.amount})`);
    }

    res.status(201).json(newTransaction);
});

// PUT /transactions/:id - Atualizar transação
app.put('/transactions/:id', (req, res) => {
    console.log('PUT /transactions/:id - Atualizando transação:', req.params.id, req.body);

    const transactionIndex = mockTransactions.findIndex(t => t.id === req.params.id);
    if (transactionIndex === -1) {
        return res.status(404).json({ message: 'Transação não encontrada' });
    }

    const oldTransaction = mockTransactions[transactionIndex];
    const updatedTransaction = {
        ...oldTransaction,
        ...req.body,
        updatedAt: new Date().toISOString()
    };

    mockTransactions[transactionIndex] = updatedTransaction;

    // Atualizar saldo da conta se o valor ou tipo mudou
    if ((req.body.amount && req.body.amount !== oldTransaction.amount) ||
        (req.body.type && req.body.type !== oldTransaction.type)) {

        const account = mockAccounts.find(acc => acc.id === updatedTransaction.accountId);
        if (account) {
            // Reverter o impacto da transação antiga
            const oldBalanceChange = oldTransaction.type === 'income' ? oldTransaction.amount : -oldTransaction.amount;
            account.balance -= oldBalanceChange;

            // Aplicar o impacto da transação nova
            const newBalanceChange = updatedTransaction.type === 'income' ? updatedTransaction.amount : -updatedTransaction.amount;
            account.balance += newBalanceChange;

            account.updatedAt = new Date().toISOString();

            console.log(`💰 Saldo da conta ${account.name} atualizado após edição: ${account.balance}`);
        }
    }

    res.json(updatedTransaction);
});

// DELETE /transactions/:id - Deletar transação
app.delete('/transactions/:id', (req, res) => {
    console.log('DELETE /transactions/:id - Deletando transação:', req.params.id);

    const transactionIndex = mockTransactions.findIndex(t => t.id === req.params.id);
    if (transactionIndex === -1) {
        return res.status(404).json({ message: 'Transação não encontrada' });
    }

    const transaction = mockTransactions[transactionIndex];

    // Reverter saldo da conta baseado no tipo da transação
    const account = mockAccounts.find(acc => acc.id === transaction.accountId);
    if (account) {
        // Reverter o impacto da transação (oposto da criação)
        const balanceChange = transaction.type === 'income' ? -transaction.amount : transaction.amount;
        account.balance += balanceChange;
        account.updatedAt = new Date().toISOString();

        console.log(`💰 Saldo da conta ${account.name} revertido após exclusão: ${account.balance}`);
    }

    mockTransactions.splice(transactionIndex, 1);
    res.status(204).send();
});

// GET /accounts/:id/transactions - Listar transações de uma conta específica
app.get('/accounts/:accountId/transactions', (req, res) => {
    const { accountId } = req.params;
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    console.log(`GET /accounts/${accountId}/transactions - Parâmetros:`, req.query);

    // Filtrar transações pela conta
    let filteredTransactions = mockTransactions.filter(t => t.accountId === accountId);

    // Aplicar filtros de data se fornecidos
    if (startDate || endDate) {
        filteredTransactions = filteredTransactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            if (start && transactionDate < start) return false;
            if (end && transactionDate > end) return false;
            return true;
        });
    }

    // Ordenar por data (mais recente primeiro)
    filteredTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Aplicar paginação
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    // Enriquecer transações com dados de conta e categoria
    const enrichedTransactions = paginatedTransactions.map(transaction => {
        const account = mockAccounts.find(acc => acc.id === transaction.accountId);
        const category = mockCategories.find(cat => cat.id === transaction.categoryId);

        return {
            ...transaction,
            account: account || null,
            category: category || null
        };
    });

    res.json({
        transactions: enrichedTransactions,
        total: filteredTransactions.length,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(filteredTransactions.length / limit)
    });
});

// GET /categories - Listar categorias
app.get('/categories', (req, res) => {
    console.log('GET /categories - Retornando categorias mockadas');
    res.json(mockCategories);
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Backend funcionando!' });
});

// Rota raiz para evitar 404
app.get('/', (req, res) => {
    res.json({
        message: 'Grex Finances API',
        version: '1.0.0',
        status: 'OK',
        endpoints: [
            'GET /accounts',
            'POST /accounts',
            'GET /accounts/:id',
            'DELETE /accounts/:id',
            'GET /accounts/:id/balance-history',
            'GET /accounts/:id/transactions',
            'GET /health'
        ]
    });
});

app.listen(port, () => {
    console.log(`🚀 Backend mock rodando em: http://localhost:${port}`);
    console.log(`📊 Contas disponíveis: ${mockAccounts.length}`);
});
