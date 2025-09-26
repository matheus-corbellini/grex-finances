"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Download, Upload, FileText, FileSpreadsheet, FileImage } from "lucide-react";
import ImportTransactionsModal from "../modals/ImportTransactionsModal";
import ExportTransactionsModal from "../modals/ExportTransactionsModal";
import { Account } from "../../../shared/types/account.types";

interface TransactionsImportExportExampleProps {
    accounts: Account[];
}

export default function TransactionsImportExportExample({ accounts }: TransactionsImportExportExampleProps) {
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    const handleImportComplete = (result: any) => {
        console.log('Importação concluída:', result);
        // Aqui você pode atualizar a lista de transações, mostrar notificações, etc.
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Importar e Exportar Transações</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Importação */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <Upload className="text-blue-600" size={24} />
                        <h4 className="text-lg font-medium text-gray-900">Importar Transações</h4>
                    </div>

                    <p className="text-gray-600 mb-4">
                        Importe transações de arquivos CSV ou Excel para suas contas.
                    </p>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText size={16} />
                            <span>Suporte a CSV</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileSpreadsheet size={16} />
                            <span>Suporte a Excel (.xlsx, .xls)</span>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        onClick={() => setIsImportModalOpen(true)}
                        className="w-full"
                    >
                        <Upload size={16} />
                        Importar Transações
                    </Button>
                </div>

                {/* Exportação */}
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3 mb-4">
                        <Download className="text-green-600" size={24} />
                        <h4 className="text-lg font-medium text-gray-900">Exportar Transações</h4>
                    </div>

                    <p className="text-gray-600 mb-4">
                        Exporte suas transações em diferentes formatos e templates.
                    </p>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText size={16} />
                            <span>CSV para análise</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileSpreadsheet size={16} />
                            <span>Excel com resumos</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileImage size={16} />
                            <span>PDF formatado</span>
                        </div>
                    </div>

                    <Button
                        variant="secondary"
                        onClick={() => setIsExportModalOpen(true)}
                        className="w-full"
                    >
                        <Download size={16} />
                        Exportar Transações
                    </Button>
                </div>
            </div>

            {/* Modais */}
            <ImportTransactionsModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImportComplete={handleImportComplete}
                accounts={accounts}
            />

            <ExportTransactionsModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                accounts={accounts}
            />
        </div>
    );
}
