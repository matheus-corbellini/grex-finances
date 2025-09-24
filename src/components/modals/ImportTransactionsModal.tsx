"use client";

import React, { useState, useRef } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Upload, FileText, CheckCircle, AlertCircle, Download, X } from "lucide-react";
import { Account } from "../../../shared/types/account.types";
import transactionsService from "../../services/api/transactions.service";
import styles from "./ImportTransactionsModal.module.css";

interface ImportTransactionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImportComplete: (result: { imported: number; errors: any[] }) => void;
    accounts: Account[];
}

interface ImportResult {
    imported: number;
    errors: any[];
}

export default function ImportTransactionsModal({
    isOpen,
    onClose,
    onImportComplete,
    accounts
}: ImportTransactionsModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedAccount, setSelectedAccount] = useState<string>("");
    const [isImporting, setIsImporting] = useState(false);
    const [importResult, setImportResult] = useState<ImportResult | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const acceptedFormats = ['.csv', '.xlsx', '.xls'];
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    const handleFileSelect = (file: File) => {
        // Validar tipo de arquivo
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!acceptedFormats.includes(fileExtension)) {
            alert('Formato de arquivo não suportado. Use CSV, XLSX ou XLS.');
            return;
        }

        // Validar tamanho do arquivo
        if (file.size > maxFileSize) {
            alert('Arquivo muito grande. Tamanho máximo: 10MB.');
            return;
        }

        setSelectedFile(file);
        setImportResult(null);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleImport = async () => {
        if (!selectedFile || !selectedAccount) {
            alert('Selecione um arquivo e uma conta para importar.');
            return;
        }

        setIsImporting(true);
        setImportResult(null);

        try {
            const result = await transactionsService.importTransactions(selectedFile, selectedAccount);
            setImportResult(result);
            onImportComplete(result);
        } catch (error: any) {
            console.error('Erro ao importar transações:', error);
            setImportResult({
                imported: 0,
                errors: [{ message: error.message || 'Erro ao importar arquivo' }]
            });
        } finally {
            setIsImporting(false);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setSelectedAccount("");
        setImportResult(null);
        setIsImporting(false);
        onClose();
    };

    const downloadTemplate = () => {
        // Criar template CSV
        const csvContent = [
            'Data,Descrição,Valor,Tipo,Categoria,Observações',
            '2024-01-15,Salário,+5000.00,income,Salário,Salário mensal',
            '2024-01-16,Supermercado,-150.50,expense,Alimentação,Compras do mês',
            '2024-01-17,Transferência,-500.00,transfer,Transferência,Transferência para poupança'
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'template_transacoes.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="large">
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Importar Transações</h2>
                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
                        type="button"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    {/* Seção de seleção de arquivo */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>1. Selecionar Arquivo</h3>
                        <div
                            className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleFileInputChange}
                                className={styles.fileInput}
                            />

                            {selectedFile ? (
                                <div className={styles.fileSelected}>
                                    <FileText size={24} className={styles.fileIcon} />
                                    <div className={styles.fileInfo}>
                                        <p className={styles.fileName}>{selectedFile.name}</p>
                                        <p className={styles.fileSize}>
                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                    <button
                                        className={styles.removeFile}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedFile(null);
                                        }}
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.dropZoneContent}>
                                    <Upload size={32} className={styles.uploadIcon} />
                                    <p className={styles.dropZoneText}>
                                        Clique aqui ou arraste um arquivo
                                    </p>
                                    <p className={styles.dropZoneSubtext}>
                                        Formatos suportados: CSV, XLSX, XLS (máx. 10MB)
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Seção de seleção de conta */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>2. Selecionar Conta</h3>
                        <select
                            value={selectedAccount}
                            onChange={(e) => setSelectedAccount(e.target.value)}
                            className={styles.accountSelect}
                        >
                            <option value="">Selecione uma conta</option>
                            {accounts.map(account => (
                                <option key={account.id} value={account.id}>
                                    {account.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Seção de template */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>3. Template de Exemplo</h3>
                        <div className={styles.templateSection}>
                            <p className={styles.templateText}>
                                Baixe nosso template para ver o formato correto dos dados:
                            </p>
                            <Button
                                variant="secondary"
                                onClick={downloadTemplate}
                                className={styles.templateButton}
                            >
                                <Download size={16} />
                                Baixar Template CSV
                            </Button>
                        </div>
                    </div>

                    {/* Resultado da importação */}
                    {importResult && (
                        <div className={styles.section}>
                            <h3 className={styles.sectionTitle}>Resultado da Importação</h3>
                            <div className={styles.resultContainer}>
                                <div className={styles.resultItem}>
                                    <CheckCircle size={20} className={styles.successIcon} />
                                    <span className={styles.resultText}>
                                        {importResult.imported} transações importadas com sucesso
                                    </span>
                                </div>

                                {importResult.errors.length > 0 && (
                                    <div className={styles.errorContainer}>
                                        <AlertCircle size={20} className={styles.errorIcon} />
                                        <div className={styles.errorContent}>
                                            <p className={styles.errorTitle}>
                                                {importResult.errors.length} erro(s) encontrado(s):
                                            </p>
                                            <ul className={styles.errorList}>
                                                {importResult.errors.map((error, index) => (
                                                    <li key={index} className={styles.errorItem}>
                                                        {error.message || error}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.modalActions}>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isImporting}
                    >
                        {importResult ? 'Fechar' : 'Cancelar'}
                    </Button>
                    {!importResult && (
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleImport}
                            disabled={!selectedFile || !selectedAccount || isImporting}
                            loading={isImporting}
                        >
                            {isImporting ? 'Importando...' : 'Importar Transações'}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}
