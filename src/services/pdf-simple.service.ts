import { Transaction, TransactionType, TransactionStatus } from '../../shared/types/transaction.types';
import { Account } from '../../shared/types/account.types';
import { Category } from '../../shared/types/category.types';

export class PDFSimpleService {
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

  generateTransactionPDF(
    transaction: Transaction,
    account?: Account,
    category?: Category
  ): void {
    // Criar uma nova janela para impressão
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const amountText = `${transaction.type === "expense" ? "-" : transaction.type === "income" ? "+" : ""}${this.formatCurrency(transaction.amount)}`;
    const typeColor = transaction.type === "expense" ? "#dc2626" : transaction.type === "income" ? "#059669" : "#3b82f6";
    const statusColor = transaction.status === "completed" ? "#059669" : transaction.status === "pending" ? "#f59e0b" : "#6b7280";

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Comprovante de Transação</title>
          <meta charset="utf-8">
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 0;
              background: #f8fafc;
              color: #1e293b;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              min-height: 100vh;
              padding: 40px;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #3b82f6;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #1e293b;
              font-size: 28px;
              margin: 0 0 10px 0;
              font-weight: 700;
            }
            .header .date {
              color: #64748b;
              font-size: 14px;
            }
            .transaction-card {
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 30px;
              margin-bottom: 30px;
            }
            .transaction-header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              margin-bottom: 20px;
            }
            .transaction-icon {
              width: 60px;
              height: 60px;
              background: white;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            .transaction-info h2 {
              font-size: 24px;
              margin: 0 0 10px 0;
              color: #1e293b;
            }
            .transaction-meta {
              display: flex;
              gap: 20px;
              align-items: center;
            }
            .transaction-type {
              background: #e2e8f0;
              color: #475569;
              padding: 6px 16px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
            }
            .transaction-status {
              color: ${statusColor};
              font-weight: 600;
              font-size: 14px;
            }
            .transaction-amount {
              font-size: 32px;
              font-weight: 700;
              color: ${typeColor};
              text-align: right;
            }
            .details-section {
              background: white;
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 30px;
              margin-bottom: 30px;
            }
            .details-section h3 {
              color: #1e293b;
              font-size: 18px;
              margin: 0 0 20px 0;
              font-weight: 600;
            }
            .detail-row {
              display: flex;
              margin-bottom: 15px;
              align-items: flex-start;
            }
            .detail-label {
              font-weight: 600;
              color: #374151;
              min-width: 120px;
              margin-right: 20px;
            }
            .detail-value {
              color: #1e293b;
              flex: 1;
            }
            .footer {
              text-align: center;
              padding-top: 30px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: 12px;
            }
            .footer .system-info {
              margin-bottom: 10px;
            }
            .footer .transaction-id {
              font-weight: 600;
            }
            @media print {
              body { background: white; }
              .container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Comprovante de Transação</h1>
              <div class="date">Gerado em: ${this.formatDate(new Date())}</div>
            </div>

            <div class="transaction-card">
              <div class="transaction-header">
                <div style="display: flex; align-items: center; gap: 20px;">
                  <div class="transaction-icon">
                    ${transaction.type === "expense" ? "↓" : transaction.type === "income" ? "↑" : "↔"}
                  </div>
                  <div class="transaction-info">
                    <h2>${transaction.description}</h2>
                    <div class="transaction-meta">
                      <span class="transaction-type">${this.getTransactionTypeLabel(transaction.type)}</span>
                      <span class="transaction-status">${this.getTransactionStatusLabel(transaction.status)}</span>
                    </div>
                  </div>
                </div>
                <div class="transaction-amount">${amountText}</div>
              </div>
            </div>

            <div class="details-section">
              <h3>Detalhes da Transação</h3>
              
              <div class="detail-row">
                <div class="detail-label">Data e Hora:</div>
                <div class="detail-value">${this.formatDate(transaction.date)}</div>
              </div>

              ${account ? `
                <div class="detail-row">
                  <div class="detail-label">Conta:</div>
                  <div class="detail-value">${account.name}${account.description ? ` (${account.description})` : ''}</div>
                </div>
              ` : ''}

              ${category ? `
                <div class="detail-row">
                  <div class="detail-label">Categoria:</div>
                  <div class="detail-value">${category.name}</div>
                </div>
              ` : ''}

              ${transaction.notes ? `
                <div class="detail-row">
                  <div class="detail-label">Observações:</div>
                  <div class="detail-value">${transaction.notes}</div>
                </div>
              ` : ''}
            </div>

            <div class="footer">
              <div class="system-info">Este documento foi gerado automaticamente pelo sistema Grex Finances</div>
              <div class="transaction-id">ID da Transação: ${transaction.id}</div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    // Aguardar um pouco para o conteúdo carregar antes de imprimir
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }

  generateMultipleTransactionsPDF(transactions: Transaction[]): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Transações</title>
          <meta charset="utf-8">
          <style>
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 0;
              background: #f8fafc;
              color: #1e293b;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              min-height: 100vh;
              padding: 40px;
              box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              border-bottom: 3px solid #3b82f6;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #1e293b;
              font-size: 28px;
              margin: 0 0 10px 0;
              font-weight: 700;
            }
            .header .date {
              color: #64748b;
              font-size: 14px;
            }
            .summary {
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 20px;
              margin-bottom: 30px;
              text-align: center;
            }
            .summary h3 {
              margin: 0 0 10px 0;
              color: #1e293b;
            }
            .transactions-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .transactions-table th {
              background: #3b82f6;
              color: white;
              padding: 15px 10px;
              text-align: left;
              font-weight: 600;
            }
            .transactions-table td {
              padding: 12px 10px;
              border-bottom: 1px solid #e2e8f0;
            }
            .transactions-table tr:nth-child(even) {
              background: #f8fafc;
            }
            .amount {
              text-align: right;
              font-weight: 600;
            }
            .amount.income {
              color: #059669;
            }
            .amount.expense {
              color: #dc2626;
            }
            .footer {
              text-align: center;
              padding-top: 30px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: 12px;
            }
            @media print {
              body { background: white; }
              .container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Relatório de Transações</h1>
              <div class="date">Gerado em: ${this.formatDate(new Date())}</div>
            </div>

            <div class="summary">
              <h3>Resumo</h3>
              <p>Total de transações: ${transactions.length}</p>
            </div>

            <table class="transactions-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${transactions.map(transaction => `
                  <tr>
                    <td>${this.formatDate(transaction.date)}</td>
                    <td>${transaction.description}</td>
                    <td>${this.getTransactionTypeLabel(transaction.type)}</td>
                    <td class="amount ${transaction.type === 'income' ? 'income' : 'expense'}">
                      ${transaction.type === "expense" ? "-" : transaction.type === "income" ? "+" : ""}${this.formatCurrency(transaction.amount)}
                    </td>
                    <td>${this.getTransactionStatusLabel(transaction.status)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="footer">
              <div>Este documento foi gerado automaticamente pelo sistema Grex Finances</div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();

    // Aguardar um pouco para o conteúdo carregar antes de imprimir
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}

export const pdfSimpleService = new PDFSimpleService();
