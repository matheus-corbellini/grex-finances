import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { ReportData } from './api/reports.service';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

export interface ExportOptions {
    title: string;
    period: string;
    view: string;
    regime: string;
    generatedAt: Date;
}

export class ExportService {
    /**
     * Exporta o relatório para PDF
     */
    static async exportToPDF(
        reportData: ReportData,
        options: ExportOptions,
        chartElement?: HTMLElement
    ): Promise<void> {
        const doc = new jsPDF();

        // Configurações do documento
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);

        // Título principal
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(options.title, margin, 30);

        // Informações do relatório
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Período: ${options.period}`, margin, 45);
        doc.text(`Visão: ${options.view}`, margin, 55);
        doc.text(`Regime: ${options.regime}`, margin, 65);
        doc.text(`Gerado em: ${options.generatedAt.toLocaleString('pt-BR')}`, margin, 75);

        // Linha separadora
        doc.setLineWidth(0.5);
        doc.line(margin, 85, pageWidth - margin, 85);

        // Resumo dos dados
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Resumo Financeiro', margin, 100);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total de Receitas: R$ ${reportData.summary.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, margin, 115);
        doc.text(`Total de Despesas: R$ ${reportData.summary.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, margin, 125);
        doc.text(`Resultado Líquido: R$ ${reportData.summary.netResult.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, margin, 135);
        doc.text(`Saldo Total: R$ ${reportData.summary.totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, margin, 145);
        doc.text(`Número de Transações: ${reportData.summary.transactionCount}`, margin, 155);

        // Adicionar gráfico se disponível
        if (chartElement) {
            try {
                const canvas = await html2canvas(chartElement, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff'
                });

                const imgData = canvas.toDataURL('image/png');
                const imgWidth = contentWidth * 0.8;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                doc.addImage(imgData, 'PNG', margin + (contentWidth * 0.1), 170, imgWidth, imgHeight);
            } catch (error) {
                console.warn('Erro ao capturar gráfico:', error);
                doc.text('Gráfico não disponível', margin, 170);
            }
        }

        // Tabela de dados por período
        const tableStartY = chartElement ? 300 : 180;

        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Dados por Período', margin, tableStartY);

        // Preparar dados da tabela
        const tableData = Object.entries(reportData.periodData).map(([period, data]) => [
            period,
            `R$ ${data.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            `R$ ${data.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            `R$ ${data.net.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        ]);

        // Adicionar tabela
        autoTable(doc, {
            startY: tableStartY + 10,
            head: [['Período', 'Receitas', 'Despesas', 'Resultado']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [59, 130, 246], // Azul
                textColor: 255,
                fontStyle: 'bold'
            },
            alternateRowStyles: {
                fillColor: [249, 250, 251] // Cinza claro
            },
            margin: { left: margin, right: margin },
            styles: {
                fontSize: 10,
                cellPadding: 5
            }
        });

        // Rodapé
        const finalY = (doc as any).lastAutoTable?.finalY + 20 || tableStartY + 100;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('Relatório gerado automaticamente pelo sistema Grex Finances', margin, finalY);
        doc.text(`Página 1 de 1`, pageWidth - margin - 30, finalY);

        // Salvar o PDF
        const fileName = `relatorio-entradas-saidas-${options.generatedAt.toISOString().split('T')[0]}.pdf`;
        doc.save(fileName);
    }

    /**
     * Exporta o relatório para Excel (CSV)
     */
    static exportToCSV(reportData: ReportData, options: ExportOptions): void {
        const csvContent = [
            // Cabeçalho
            ['Relatório de Entradas e Saídas'],
            [''],
            ['Período', options.period],
            ['Visão', options.view],
            ['Regime', options.regime],
            ['Gerado em', options.generatedAt.toLocaleString('pt-BR')],
            [''],
            // Resumo
            ['Resumo Financeiro'],
            ['Total de Receitas', `R$ ${reportData.summary.totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
            ['Total de Despesas', `R$ ${reportData.summary.totalExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
            ['Resultado Líquido', `R$ ${reportData.summary.netResult.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
            ['Saldo Total', `R$ ${reportData.summary.totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`],
            ['Número de Transações', reportData.summary.transactionCount.toString()],
            [''],
            // Dados por período
            ['Dados por Período'],
            ['Período', 'Receitas', 'Despesas', 'Resultado']
        ];

        // Adicionar dados dos períodos
        Object.entries(reportData.periodData).forEach(([period, data]) => {
            csvContent.push([
                period,
                data.income.toString(),
                data.expenses.toString(),
                data.net.toString()
            ]);
        });

        // Converter para CSV
        const csvString = csvContent.map(row =>
            row.map(cell => `"${cell}"`).join(',')
        ).join('\n');

        // Criar e baixar arquivo
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `relatorio-entradas-saidas-${options.generatedAt.toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
