"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
    AddSubcategoryModal,
    AdvancedPreferencesModal,
    ReportPreviewModal,
    TransactionViewModal,
    AccountDetailsModal
} from "@/components/modals";
import {
    Plus,
    Settings,
    FileText,
    Receipt,
    CreditCard,
    Eye
} from "lucide-react";

// Dados de exemplo para os modais
const sampleCategories = [
    {
        id: "1",
        name: "Alimentação",
        type: "expense" as any,
        color: "#ef4444",
        icon: "utensils",
        isDefault: false,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "2",
        name: "Transporte",
        type: "expense" as any,
        color: "#3b82f6",
        icon: "car",
        isDefault: false,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: "3",
        name: "Salário",
        type: "income" as any,
        color: "#10b981",
        icon: "money",
        isDefault: false,
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

const sampleReport = {
    id: "1",
    userId: "user1",
    name: "Relatório Mensal - Janeiro 2024",
    type: "SPENDING_ANALYSIS" as any,
    description: "Análise detalhada dos gastos do mês de janeiro",
    parameters: {
        dateRange: {
            startDate: new Date("2024-01-01"),
            endDate: new Date("2024-01-31"),
            period: "1M" as any
        },
        currency: "BRL"
    },
    data: {
        summary: {
            totalIncome: 5000,
            totalExpenses: 3500,
            netIncome: 1500,
            totalAssets: 25000,
            totalLiabilities: 5000,
            netWorth: 20000,
            period: "Janeiro 2024",
            currency: "BRL"
        },
        details: [],
        charts: [
            {
                type: "pie" as any,
                title: "Gastos por Categoria",
                data: {
                    labels: ["Alimentação", "Transporte", "Lazer"],
                    datasets: [{ label: "Valor", data: [1500, 800, 1200] }]
                }
            }
        ],
        insights: [
            {
                type: "SPENDING_TREND" as any,
                title: "Aumento nos Gastos",
                description: "Seus gastos aumentaram 15% em relação ao mês anterior",
                value: 3500,
                change: 500,
                changePercentage: 15,
                trend: "up" as any,
                severity: "warning" as any
            }
        ]
    },
    generatedAt: new Date(),
    isScheduled: false
};

const sampleTransaction = {
    id: "1",
    userId: "user1",
    accountId: "acc1",
    categoryId: "cat1",
    amount: 150.50,
    description: "Supermercado Extra",
    notes: "Compras da semana",
    type: "EXPENSE" as any,
    status: "COMPLETED" as any,
    date: new Date(),
    tags: ["supermercado", "alimentação"],
    location: "São Paulo, SP",
    receipt: "https://example.com/receipt.pdf",
    isRecurring: false,
    createdAt: new Date(),
    updatedAt: new Date()
};

const sampleAccount = {
    id: "1",
    userId: "user1",
    name: "Conta Corrente Nubank",
    type: { id: "1", name: "Conta Corrente", category: "CHECKING" as any },
    balance: 2500.75,
    currency: "BRL",
    isActive: true,
    bankName: "Nubank",
    accountNumber: "12345-6",
    description: "Conta principal para gastos do dia a dia",
    color: "#8b5cf6",
    icon: "credit-card",
    createdAt: new Date(),
    updatedAt: new Date()
};

export default function TestModals() {
    const [showAddSubcategoryModal, setShowAddSubcategoryModal] = useState(false);
    const [showAdvancedPreferencesModal, setShowAdvancedPreferencesModal] = useState(false);
    const [showReportPreviewModal, setShowReportPreviewModal] = useState(false);
    const [showTransactionViewModal, setShowTransactionViewModal] = useState(false);
    const [showAccountDetailsModal, setShowAccountDetailsModal] = useState(false);

    const handleAddSubcategory = (data: any) => {
        console.log("Adicionando subcategoria:", data);
        setShowAddSubcategoryModal(false);
    };

    const handleSavePreferences = (preferences: any) => {
        console.log("Salvando preferências:", preferences);
        setShowAdvancedPreferencesModal(false);
    };

    const handleExportReport = (format: "pdf" | "csv" | "xlsx") => {
        console.log("Exportando relatório:", format);
    };

    const handleEditTransaction = () => {
        console.log("Editando transação");
    };

    const handleDeleteTransaction = () => {
        console.log("Excluindo transação");
        setShowTransactionViewModal(false);
    };

    const handleDuplicateTransaction = () => {
        console.log("Duplicando transação");
    };

    const handleShareTransaction = () => {
        console.log("Compartilhando transação");
    };

    const handleEditAccount = () => {
        console.log("Editando conta");
    };

    const handleDeleteAccount = () => {
        console.log("Excluindo conta");
        setShowAccountDetailsModal(false);
    };

    const handleExportAccount = () => {
        console.log("Exportando dados da conta");
    };

    const handleShareAccount = () => {
        console.log("Compartilhando conta");
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
                {/* Header Section */}
                <div className="relative overflow-hidden bg-white">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-5"></div>
                    <div className="relative px-6 py-12">
                        <div className="text-center max-w-4xl mx-auto">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                                <Settings className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
                                Teste dos Novos Modais
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                                Explore os novos modais criados para o sistema. Cada um foi projetado com foco na experiência do usuário e funcionalidade completa.
                            </p>
                            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span>5 Modais Criados</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span>Design Responsivo</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span>Validação Completa</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modals Grid */}
                <div className="px-6 py-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Modal de Adicionar Subcategoria */}
                            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <Plus className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Adicionar Subcategoria</h3>
                                            <p className="text-gray-600 leading-relaxed">Modal para criar subcategorias com validação completa e preview em tempo real</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                            <span>Seletor de categoria pai</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                            <span>Paleta de cores personalizada</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                            <span>Preview em tempo real</span>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setShowAddSubcategoryModal(true)}
                                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />
                                        Testar Modal
                                    </Button>
                                </div>
                            </div>

                            {/* Modal de Preferências Avançadas */}
                            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <Settings className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Preferências Avançadas</h3>
                                            <p className="text-gray-600 leading-relaxed">Configurações detalhadas do sistema com interface em abas organizadas</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                            <span>6 categorias de configurações</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                            <span>Interface com abas intuitivas</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                            <span>Switches e selects avançados</span>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setShowAdvancedPreferencesModal(true)}
                                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <Settings className="w-5 h-5 mr-2" />
                                        Testar Modal
                                    </Button>
                                </div>
                            </div>

                            {/* Modal de Preview de Relatórios */}
                            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200">
                                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <FileText className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Preview de Relatórios</h3>
                                            <p className="text-gray-600 leading-relaxed">Visualização completa de relatórios com exportação e compartilhamento</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                            <span>4 seções organizadas</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                            <span>Exportação em múltiplos formatos</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                            <span>Insights e análises detalhadas</span>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setShowReportPreviewModal(true)}
                                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <Eye className="w-5 h-5 mr-2" />
                                        Testar Modal
                                    </Button>
                                </div>
                            </div>

                            {/* Modal de Visualização de Transações */}
                            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200">
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <Receipt className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Visualizar Transação</h3>
                                            <p className="text-gray-600 leading-relaxed">Detalhes completos da transação com ações contextuais</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                            <span>Informações detalhadas</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                            <span>Ações de edição e exclusão</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                            <span>Visualização de anexos</span>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setShowTransactionViewModal(true)}
                                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <Eye className="w-5 h-5 mr-2" />
                                        Testar Modal
                                    </Button>
                                </div>
                            </div>

                            {/* Modal de Detalhes de Conta */}
                            <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            <CreditCard className="w-7 h-7 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Detalhes da Conta</h3>
                                            <p className="text-gray-600 leading-relaxed">Informações completas da conta com histórico e estatísticas</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                                            <span>Visão geral completa</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                                            <span>Histórico de transações</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                                            <span>Gráficos de evolução</span>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setShowAccountDetailsModal(true)}
                                        className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <Eye className="w-5 h-5 mr-2" />
                                        Testar Modal
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Footer Section */}
                        <div className="mt-16 text-center">
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">🎉 Modais Prontos para Uso</h3>
                                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                    Todos os modais foram criados seguindo as melhores práticas de UX/UI, com design responsivo,
                                    validação completa e integração perfeita com o sistema existente.
                                </p>
                                <div className="flex flex-wrap justify-center gap-4 text-sm">
                                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span>TypeScript</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span>Responsivo</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                        <span>Acessível</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                        <span>Validação</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modais */}
                <AddSubcategoryModal
                    isOpen={showAddSubcategoryModal}
                    onClose={() => setShowAddSubcategoryModal(false)}
                    onSubmit={handleAddSubcategory}
                    categories={sampleCategories}
                />

                <AdvancedPreferencesModal
                    isOpen={showAdvancedPreferencesModal}
                    onClose={() => setShowAdvancedPreferencesModal(false)}
                    onSave={handleSavePreferences}
                />

                <ReportPreviewModal
                    isOpen={showReportPreviewModal}
                    onClose={() => setShowReportPreviewModal(false)}
                    report={sampleReport}
                    onExport={handleExportReport}
                />

                <TransactionViewModal
                    isOpen={showTransactionViewModal}
                    onClose={() => setShowTransactionViewModal(false)}
                    transaction={sampleTransaction}
                    account={sampleAccount}
                    onEdit={handleEditTransaction}
                    onDelete={handleDeleteTransaction}
                    onDuplicate={handleDuplicateTransaction}
                    onShare={handleShareTransaction}
                />

                <AccountDetailsModal
                    isOpen={showAccountDetailsModal}
                    onClose={() => setShowAccountDetailsModal(false)}
                    account={sampleAccount}
                    accountType={sampleAccount.type}
                    recentTransactions={[sampleTransaction]}
                    onEdit={handleEditAccount}
                    onDelete={handleDeleteAccount}
                    onExport={handleExportAccount}
                    onShare={handleShareAccount}
                />
            </div>
        </DashboardLayout>
    );
}
