"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Download, FileText, FileSpreadsheet, FileImage, Calendar, Filter } from "lucide-react";
import { Account } from "../../../shared/types/account.types";
import transactionsService from "../../services/api/transactions.service";
import styles from "./ExportTransactionsModal.module.css";

interface ExportTransactionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    accounts: Account[];
}

interface ExportOptions {
    format: 'csv' | 'pdf' | 'excel';
    template: 'simple' | 'detailed' | 'bank_statement' | 'tax_report';
    startDate?: string;
    endDate?: string;
    accountId?: string;
    includeSummary: boolean;
    includeCharts: boolean;
    filename?: string;
}

export default function ExportTransactionsModal({
    isOpen,
    onClose,
    accounts
}: ExportTransactionsModalProps) {
    const [exportOptions, setExportOptions] = useState<ExportOptions>({
        format: 'csv',
        template: 'simple',
        includeSummary: true,
        includeCharts: false
    });
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);

        try {
            const filters: any = {};

            if (exportOptions.startDate) {
                filters.startDate = exportOptions.startDate;
            }
            if (exportOptions.endDate) {
                filters.endDate = exportOptions.endDate;
            }
            if (exportOptions.accountId) {
                filters.accountId = exportOptions.accountId;
            }

            const options = {
                format: exportOptions.format,
                template: exportOptions.template,
                includeSummary: exportOptions.includeSummary,
                includeCharts: exportOptions.includeCharts,
                filename: exportOptions.filename
            };

            switch (exportOptions.format) {
                case 'csv':
                    await transactionsService.exportTransactionsCsv(filters, options);
                    break;
                case 'pdf':
                    await transactionsService.exportTransactionsPdf(filters, options);
                    break;
                case 'excel':
                    await transactionsService.exportTransactionsExcel(filters, options);
                    break;
            }

            onClose();
        } catch (error) {
            console.error('Erro ao exportar transações:', error);
            alert('Erro ao exportar transações. Tente novamente.');
        } finally {
            setIsExporting(false);
        }
    };

    const handleClose = () => {
        setExportOptions({
            format: 'csv',
            template: 'simple',
            includeSummary: true,
            includeCharts: false
        });
        setIsExporting(false);
        onClose();
    };

    const formatOptions = [
        { value: 'csv', label: 'CSV', icon: FileText, description: 'Arquivo de texto separado por vírgulas' },
        { value: 'pdf', label: 'PDF', icon: FileImage, description: 'Documento PDF formatado' },
        { value: 'excel', label: 'Excel', icon: FileSpreadsheet, description: 'Planilha Excel (.xlsx)' }
    ];

    const templateOptions = [
        { value: 'simple', label: 'Simples', description: 'Lista básica de transações' },
        { value: 'detailed', label: 'Detalhado', description: 'Informações completas com categorias' },
        { value: 'bank_statement', label: 'Extrato Bancário', description: 'Formato de extrato bancário' },
        { value: 'tax_report', label: 'Relatório Fiscal', description: 'Para declaração de impostos' }
    ];

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="large" title="Exportar Transações">
            <div className={styles.modalContent}>

                <div className={styles.modalBody}>
                    {/* Formato de exportação */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <Download size={20} />
                            Formato de Exportação
                        </h3>
                        <div className={styles.formatGrid}>
                            {formatOptions.map((format) => {
                                const IconComponent = format.icon;
                                return (
                                    <div
                                        key={format.value}
                                        className={`${styles.formatOption} ${exportOptions.format === format.value ? styles.selected : ''
                                            }`}
                                        onClick={() => setExportOptions(prev => ({ ...prev, format: format.value as any }))}
                                    >
                                        <IconComponent size={24} className={styles.formatIcon} />
                                        <div className={styles.formatInfo}>
                                            <h4 className={styles.formatLabel}>{format.label}</h4>
                                            <p className={styles.formatDescription}>{format.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Template */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <FileText size={20} />
                            Template
                        </h3>
                        <div className={styles.templateGrid}>
                            {templateOptions.map((template) => (
                                <div
                                    key={template.value}
                                    className={`${styles.templateOption} ${exportOptions.template === template.value ? styles.selected : ''
                                        }`}
                                    onClick={() => setExportOptions(prev => ({ ...prev, template: template.value as any }))}
                                >
                                    <h4 className={styles.templateLabel}>{template.label}</h4>
                                    <p className={styles.templateDescription}>{template.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <Filter size={20} />
                            Filtros
                        </h3>
                        <div className={styles.filtersGrid}>
                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Período</label>
                                <div className={styles.dateRange}>
                                    <input
                                        type="date"
                                        value={exportOptions.startDate || ''}
                                        onChange={(e) => setExportOptions(prev => ({ ...prev, startDate: e.target.value }))}
                                        className={styles.dateInput}
                                        placeholder="Data inicial"
                                    />
                                    <span className={styles.dateSeparator}>até</span>
                                    <input
                                        type="date"
                                        value={exportOptions.endDate || ''}
                                        onChange={(e) => setExportOptions(prev => ({ ...prev, endDate: e.target.value }))}
                                        className={styles.dateInput}
                                        placeholder="Data final"
                                    />
                                </div>
                            </div>

                            <div className={styles.filterGroup}>
                                <label className={styles.filterLabel}>Conta</label>
                                <select
                                    value={exportOptions.accountId || ''}
                                    onChange={(e) => setExportOptions(prev => ({ ...prev, accountId: e.target.value || undefined }))}
                                    className={styles.accountSelect}
                                >
                                    <option value="">Todas as contas</option>
                                    {accounts.map(account => (
                                        <option key={account.id} value={account.id}>
                                            {account.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Opções adicionais */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Opções Adicionais</h3>
                        <div className={styles.optionsGrid}>
                            <label className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={exportOptions.includeSummary}
                                    onChange={(e) => setExportOptions(prev => ({ ...prev, includeSummary: e.target.checked }))}
                                    className={styles.checkbox}
                                />
                                <span className={styles.checkboxText}>Incluir resumo financeiro</span>
                            </label>

                            {exportOptions.format === 'pdf' && (
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={exportOptions.includeCharts}
                                        onChange={(e) => setExportOptions(prev => ({ ...prev, includeCharts: e.target.checked }))}
                                        className={styles.checkbox}
                                    />
                                    <span className={styles.checkboxText}>Incluir gráficos</span>
                                </label>
                            )}

                            <div className={styles.filenameGroup}>
                                <label className={styles.filterLabel}>Nome do arquivo (opcional)</label>
                                <input
                                    type="text"
                                    value={exportOptions.filename || ''}
                                    onChange={(e) => setExportOptions(prev => ({ ...prev, filename: e.target.value || undefined }))}
                                    className={styles.filenameInput}
                                    placeholder="Deixe vazio para nome automático"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.modalActions}>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isExporting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleExport}
                        disabled={isExporting}
                        loading={isExporting}
                    >
                        {isExporting ? 'Exportando...' : 'Exportar'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
