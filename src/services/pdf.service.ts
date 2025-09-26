import { Transaction, TransactionType, TransactionStatus } from '../shared/types/transaction.types';
import { Account } from '../shared/types/account.types';
import { Category } from '../shared/types/category.types';

export class PDFService {
    private formatCurrency(amount: number, currency: string = "BRL") {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: currency
        }).format(amount);
    }

    private formatDate(date: Date) {
        return new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }).format(new Date(date));
    }

    private getTransactionTypeLabel(type: TransactionType) {
        const labels = {
            INCOME: "Receita",
            EXPENSE: "Despesa",
            TRANSFER: "Transferência"
        };
        return labels[type] || type;
    }

    private getTransactionStatusLabel(status: TransactionStatus) {
        const labels = {
            PENDING: "Pendente",
            COMPLETED: "Concluída",
            CANCELLED: "Cancelada",
            FAILED: "Falhou"
        };
        return labels[status] || status;
    }

    private getTransactionTypeColor(type: TransactionType) {
        const colors = {
            INCOME: "#059669",
            EXPENSE: "#dc2626",
            TRANSFER: "#3b82f6"
        };
        return colors[type] || "#6b7280";
    }

    private getStatusColor(status: TransactionStatus) {
        const colors = {
            PENDING: "#f59e0b",
            COMPLETED: "#059669",
            CANCELLED: "#6b7280",
            FAILED: "#dc2626"
        };
        return colors[status] || "#6b7280";
    }

    async generateTransactionPDF(
        transaction: Transaction,
        account?: Account,
        category?: Category
    ): Promise<void> {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);

        // Cores
        const primaryColor = this.getTransactionTypeColor(transaction.type);
        const statusColor = this.getStatusColor(transaction.status);
        const textColor = "#1e293b";
        const lightGray = "#64748b";
        const backgroundColor = "#f8fafc";

        // Header
        doc.setFillColor(backgroundColor);
        doc.rect(margin, margin, contentWidth, 40, 'F');

        // Logo/Title
        doc.setFontSize(20);
        doc.setTextColor(textColor);
        doc.setFont("helvetica", "bold");
        doc.text("Comprovante de Transação", margin + 10, margin + 15);

        // Data de geração
        doc.setFontSize(10);
        doc.setTextColor(lightGray);
        doc.setFont("helvetica", "normal");
        doc.text(`Gerado em: ${this.formatDate(new Date())}`, pageWidth - margin - 60, margin + 15);

        let yPosition = margin + 60;

        // Informações da Transação
        doc.setFillColor("#ffffff");
        doc.rect(margin, yPosition, contentWidth, 80, 'F');
        doc.setDrawColor("#e2e8f0");
        doc.rect(margin, yPosition, contentWidth, 80, 'S');

        // Ícone da transação (simulado com texto)
        doc.setFontSize(16);
        doc.setTextColor(primaryColor);
        doc.setFont("helvetica", "bold");
        doc.text(transaction.type === "EXPENSE" ? "↓" : transaction.type === "INCOME" ? "↑" : "↔", margin + 15, yPosition + 20);

        // Descrição da transação
        doc.setFontSize(18);
        doc.setTextColor(textColor);
        doc.setFont("helvetica", "bold");
        doc.text(transaction.description, margin + 35, yPosition + 20);

        // Valor
        doc.setFontSize(24);
        doc.setTextColor(primaryColor);
        doc.setFont("helvetica", "bold");
        const amountText = `${transaction.type === "EXPENSE" ? "-" : transaction.type === "INCOME" ? "+" : ""}${this.formatCurrency(transaction.amount)}`;
        doc.text(amountText, pageWidth - margin - doc.getTextWidth(amountText) - 10, yPosition + 20);

        // Tipo e Status
        doc.setFontSize(12);
        doc.setTextColor(lightGray);
        doc.setFont("helvetica", "normal");
        doc.text(`Tipo: ${this.getTransactionTypeLabel(transaction.type)}`, margin + 15, yPosition + 35);

        doc.setTextColor(statusColor);
        doc.setFont("helvetica", "bold");
        doc.text(`Status: ${this.getTransactionStatusLabel(transaction.status)}`, margin + 15, yPosition + 50);

        yPosition += 100;

        // Detalhes da Transação
        doc.setFillColor("#ffffff");
        doc.rect(margin, yPosition, contentWidth, 120, 'F');
        doc.setDrawColor("#e2e8f0");
        doc.rect(margin, yPosition, contentWidth, 120, 'S');

        doc.setFontSize(16);
        doc.setTextColor(textColor);
        doc.setFont("helvetica", "bold");
        doc.text("Detalhes da Transação", margin + 15, yPosition + 20);

        yPosition += 35;

        // Data e Hora
        doc.setFontSize(12);
        doc.setTextColor(textColor);
        doc.setFont("helvetica", "bold");
        doc.text("Data e Hora:", margin + 15, yPosition);
        doc.setFont("helvetica", "normal");
        doc.text(this.formatDate(transaction.date), margin + 80, yPosition);

        yPosition += 15;

        // Conta
        if (account) {
            doc.setFont("helvetica", "bold");
            doc.text("Conta:", margin + 15, yPosition);
            doc.setFont("helvetica", "normal");
            doc.text(account.name, margin + 80, yPosition);
            if (account.description) {
                doc.text(`(${account.description})`, margin + 80, yPosition + 10);
                yPosition += 10;
            }
            yPosition += 15;
        }

        // Categoria
        if (category) {
            doc.setFont("helvetica", "bold");
            doc.text("Categoria:", margin + 15, yPosition);
            doc.setFont("helvetica", "normal");
            doc.text(category.name, margin + 80, yPosition);
            yPosition += 15;
        }

        // Observações
        if (transaction.notes) {
            doc.setFont("helvetica", "bold");
            doc.text("Observações:", margin + 15, yPosition);
            doc.setFont("helvetica", "normal");

            // Quebrar texto longo
            const notesLines = doc.splitTextToSize(transaction.notes, contentWidth - 100);
            doc.text(notesLines, margin + 80, yPosition);
            yPosition += (notesLines.length * 5) + 10;
        }

        yPosition += 20;

        // Footer
        doc.setFillColor(backgroundColor);
        doc.rect(margin, pageHeight - 40, contentWidth, 40, 'F');
        doc.setDrawColor("#e2e8f0");
        doc.rect(margin, pageHeight - 40, contentWidth, 40, 'S');

        doc.setFontSize(10);
        doc.setTextColor(lightGray);
        doc.setFont("helvetica", "normal");
        doc.text("Este documento foi gerado automaticamente pelo sistema Grex Finances", margin + 15, pageHeight - 20);
        doc.text(`ID da Transação: ${transaction.id}`, pageWidth - margin - 80, pageHeight - 20);

        // Salvar PDF
        const fileName = `transacao-${transaction.id}-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
    }

    async generateMultipleTransactionsPDF(transactions: Transaction[]): Promise<void> {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);

        // Header
        doc.setFontSize(20);
        doc.setTextColor("#1e293b");
        doc.setFont("helvetica", "bold");
        doc.text("Relatório de Transações", margin, margin + 15);

        doc.setFontSize(10);
        doc.setTextColor("#64748b");
        doc.setFont("helvetica", "normal");
        doc.text(`Gerado em: ${this.formatDate(new Date())}`, pageWidth - margin - 60, margin + 15);

        let yPosition = margin + 40;

        // Tabela de transações
        transactions.forEach((transaction, index) => {
            if (yPosition > pageHeight - 60) {
                doc.addPage();
                yPosition = margin + 20;
            }

            // Linha da transação
            doc.setFillColor(index % 2 === 0 ? "#ffffff" : "#f8fafc");
            doc.rect(margin, yPosition, contentWidth, 20, 'F');
            doc.setDrawColor("#e2e8f0");
            doc.rect(margin, yPosition, contentWidth, 20, 'S');

            // Data
            doc.setFontSize(10);
            doc.setTextColor("#64748b");
            doc.setFont("helvetica", "normal");
            doc.text(this.formatDate(transaction.date), margin + 10, yPosition + 12);

            // Descrição
            doc.setTextColor("#1e293b");
            doc.setFont("helvetica", "normal");
            doc.text(transaction.description, margin + 80, yPosition + 12);

            // Valor
            const amountText = this.formatCurrency(transaction.amount);
            doc.setTextColor(this.getTransactionTypeColor(transaction.type));
            doc.setFont("helvetica", "bold");
            doc.text(amountText, pageWidth - margin - doc.getTextWidth(amountText) - 10, yPosition + 12);

            yPosition += 25;
        });

        // Salvar PDF
        const fileName = `relatorio-transacoes-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
    }
}

export const pdfService = new PDFService();
