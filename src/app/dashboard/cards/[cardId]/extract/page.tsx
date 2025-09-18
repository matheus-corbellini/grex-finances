"use client";

import React, { useMemo, use } from "react";
import DashboardLayout from "../../../../../components/layout/DashboardLayout";
import { ClientOnly } from "../../../../../components/layout/ClientOnly";
import { useRouter } from "next/navigation";
import { ArrowLeft, Download, Filter, Calendar } from "lucide-react";
import styles from "./ExtractPage.module.css";

// Dados ilustrativos do extrato
const dummyStatementData = [
    { id: 1, date: "2024-01-25", description: "Posto Shell", amount: -85.00, type: "expense", category: "Combustível" },
    { id: 2, date: "2024-01-24", description: "Supermercado Pague Menos", amount: -120.50, type: "expense", category: "Alimentação" },
    { id: 3, date: "2024-01-23", description: "Netflix", amount: -45.90, type: "expense", category: "Entretenimento" },
    { id: 4, date: "2024-01-22", description: "Farmácia", amount: -30.25, type: "expense", category: "Saúde" },
    { id: 5, date: "2024-01-21", description: "Restaurante", amount: -75.00, type: "expense", category: "Alimentação" },
    { id: 6, date: "2024-01-20", description: "Uber", amount: -25.00, type: "expense", category: "Transporte" },
    { id: 7, date: "2024-01-19", description: "Loja de Roupas", amount: -150.00, type: "expense", category: "Vestuário" },
    { id: 8, date: "2024-01-18", description: "Pagamento Fatura", amount: -2000.00, type: "bill_payment", category: "Pagamento" },
    { id: 9, date: "2024-01-17", description: "Depósito", amount: 500.00, type: "income", category: "Depósito" },
    { id: 10, date: "2024-01-16", description: "Academia", amount: -80.00, type: "expense", category: "Saúde" },
    { id: 11, date: "2024-01-15", description: "Livraria", amount: -45.00, type: "expense", category: "Educação" },
    { id: 12, date: "2024-01-14", description: "Cinema", amount: -30.00, type: "expense", category: "Entretenimento" },
];

// Dados dos cartões
const dummyCardData = {
    1: {
        cardNumber: "5555 1234 5678 9012",
        cardholderName: "MARIA LÚCIA SILVA",
        bankName: "Itaú",
        cardType: "mastercard",
        limit: "R$ 8.000,00",
        used: "R$ 2.300,00",
        available: "R$ 5.700,00"
    },
    2: {
        cardNumber: "4444 1234 5678 3456",
        cardholderName: "JOÃO SILVA",
        bankName: "Santander",
        cardType: "visa",
        limit: "R$ 15.000,00",
        used: "R$ 6.500,00",
        available: "R$ 8.500,00"
    },
    3: {
        cardNumber: "3782 123456 78901",
        cardholderName: "MARIA LÚCIA SILVA",
        bankName: "Banco do Brasil",
        cardType: "amex",
        limit: "R$ 12.000,00",
        used: "R$ 12.800,00",
        available: "R$ -800,00"
    }
};

interface ExtractPageProps {
    params: Promise<{
        cardId: string;
    }>;
}

export default function ExtractPage({ params }: ExtractPageProps) {
    const router = useRouter();
    const { cardId } = use(params);

    const cardInfo = useMemo(() => {
        return dummyCardData[parseInt(cardId) as keyof typeof dummyCardData] || null;
    }, [cardId]);

    const statement = useMemo(() => {
        // Em uma aplicação real, você buscaria os dados do extrato baseado no cardId
        return dummyStatementData;
    }, []);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });
    };

    const getAmountClass = (amount: number) => {
        if (amount > 0) return styles.income;
        if (amount < 0) return styles.expense;
        return "";
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "expense":
                return "credit-card";
            case "income":
                return "money";
            case "bill_payment":
                return "document";
            default:
                return "credit-card";
        }
    };

    const totalExpenses = useMemo(() => {
        return statement
            .filter(t => t.amount < 0)
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    }, [statement]);

    const totalIncome = useMemo(() => {
        return statement
            .filter(t => t.amount > 0)
            .reduce((sum, t) => sum + t.amount, 0);
    }, [statement]);

    if (!cardInfo) {
        return (
            <DashboardLayout>
                <ClientOnly>
                    <div className={styles.container}>
                        <div className={styles.header}>
                            <button onClick={() => router.back()} className={styles.backButton}>
                                <ArrowLeft size={18} /> Voltar
                            </button>
                            <h1 className={styles.title}>Extrato do Cartão</h1>
                        </div>
                        <div className={styles.errorMessage}>
                            <p>Cartão não encontrado.</p>
                        </div>
                    </div>
                </ClientOnly>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <ClientOnly>
                <div className={styles.container}>
                    {/* Header */}
                    <div className={styles.header}>
                        <button onClick={() => router.back()} className={styles.backButton}>
                            <ArrowLeft size={18} /> Voltar
                        </button>
                        <h1 className={styles.title}>Extrato do Cartão</h1>
                        <div className={styles.headerActions}>
                            <button className={styles.actionButton}>
                                <Filter size={16} />
                                Filtrar
                            </button>
                            <button className={styles.actionButton}>
                                <Calendar size={16} />
                                Período
                            </button>
                            <button className={styles.actionButton}>
                                <Download size={16} />
                                Exportar
                            </button>
                        </div>
                    </div>

                    {/* Card Summary */}
                    <div className={styles.cardSummary}>
                        <div className={styles.cardInfo}>
                            <h2 className={styles.cardName}>{cardInfo.cardholderName}</h2>
                            <p className={styles.cardNumber}>{cardInfo.cardNumber}</p>
                            <p className={styles.bankName}>{cardInfo.bankName} • {cardInfo.cardType.toUpperCase()}</p>
                        </div>
                        <div className={styles.cardLimits}>
                            <div className={styles.limitItem}>
                                <span className={styles.limitLabel}>Limite Total</span>
                                <span className={styles.limitValue}>{cardInfo.limit}</span>
                            </div>
                            <div className={styles.limitItem}>
                                <span className={styles.limitLabel}>Valor Usado</span>
                                <span className={styles.usedValue}>{cardInfo.used}</span>
                            </div>
                            <div className={styles.limitItem}>
                                <span className={styles.limitLabel}>Disponível</span>
                                <span className={styles.availableValue}>{cardInfo.available}</span>
                            </div>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className={styles.summaryStats}>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Total de Gastos</span>
                            <span className={styles.statValue}>{formatCurrency(totalExpenses)}</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Total de Entradas</span>
                            <span className={styles.statValue}>{formatCurrency(totalIncome)}</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Saldo do Período</span>
                            <span className={`${styles.statValue} ${totalIncome - totalExpenses >= 0 ? styles.positive : styles.negative}`}>
                                {formatCurrency(totalIncome - totalExpenses)}
                            </span>
                        </div>
                    </div>

                    {/* Statement List */}
                    <div className={styles.statementContainer}>
                        <h3 className={styles.sectionTitle}>Transações</h3>
                        {statement.length === 0 ? (
                            <div className={styles.noTransactions}>
                                <p>Nenhuma transação encontrada para este período.</p>
                            </div>
                        ) : (
                            <div className={styles.statementList}>
                                {statement.map((transaction) => (
                                    <div key={transaction.id} className={styles.transactionItem}>
                                        <div className={styles.transactionIcon}>
                                            {getTypeIcon(transaction.type)}
                                        </div>
                                        <div className={styles.transactionDetails}>
                                            <div className={styles.transactionDescription}>
                                                {transaction.description}
                                            </div>
                                            <div className={styles.transactionMeta}>
                                                <span className={styles.transactionDate}>
                                                    {formatDate(transaction.date)}
                                                </span>
                                                <span className={styles.transactionCategory}>
                                                    {transaction.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={`${styles.transactionAmount} ${getAmountClass(transaction.amount)}`}>
                                            {formatCurrency(transaction.amount)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </ClientOnly>
        </DashboardLayout>
    );
}
