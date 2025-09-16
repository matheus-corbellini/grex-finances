"use client";

import React from "react";
import { Button } from "../../../components/ui/Button";
import { useToastNotifications } from "../../../hooks/useToastNotifications";
import styles from "./ToastDemo.module.css";

export default function ToastDemoPage() {
    const toast = useToastNotifications();

    const handleSuccessToast = () => {
        toast.showSuccess("Operação realizada com sucesso!");
    };

    const handleErrorToast = () => {
        toast.showError("Ocorreu um erro inesperado!");
    };

    const handleWarningToast = () => {
        toast.showWarning("Atenção: Esta ação não pode ser desfeita!");
    };

    const handleInfoToast = () => {
        toast.showInfo("Informação importante para o usuário!");
    };

    const handleLoadingToast = () => {
        const loadingId = toast.showLoading("Processando dados...");

        // Simulate async operation
        setTimeout(() => {
            toast.dismissToast(loadingId);
            toast.showSuccess("Processamento concluído!");
        }, 3000);
    };

    const handleCustomToast = () => {
        toast.showCustom({
            title: "Notificação Personalizada",
            message: "Esta é uma notificação com configurações customizadas!",
            type: "info",
            duration: 0, // No auto-dismiss
            action: {
                label: "Ação Personalizada",
                onClick: () => {
                    toast.showSuccess("Ação personalizada executada!");
                }
            }
        });
    };

    const handleApiSuccess = () => {
        toast.showApiSuccess("salvar dados");
    };

    const handleApiError = () => {
        toast.showApiError("conectar ao servidor", "Verifique sua conexão com a internet");
    };

    const handleFormValidation = () => {
        toast.showFormValidation("Nome");
    };

    const handleSaveSuccess = () => {
        toast.showSaveSuccess();
    };

    const handleDeleteConfirm = () => {
        toast.showDeleteConfirm("o item selecionado", () => {
            toast.showSuccess("Item excluído com sucesso!");
        });
    };

    const handleBackupProgress = () => {
        const loadingId = toast.showBackupProgress("Criando backup completo...");

        setTimeout(() => {
            toast.dismissToast(loadingId);
            toast.showBackupComplete("15.2 MB");
        }, 4000);
    };

    const handleUploadProgress = () => {
        const loadingId = toast.showUploadProgress("documento.pdf");

        setTimeout(() => {
            toast.dismissToast(loadingId);
            toast.showUploadComplete("documento.pdf");
        }, 3000);
    };

    const handleMultipleToasts = () => {
        toast.showInfo("Primeira notificação");
        setTimeout(() => toast.showWarning("Segunda notificação"), 500);
        setTimeout(() => toast.showSuccess("Terceira notificação"), 1000);
        setTimeout(() => toast.showError("Quarta notificação"), 1500);
    };

    const handleClearAll = () => {
        toast.dismissAll();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Demonstração de Notificações Toast</h1>
                <p>Teste diferentes tipos de notificações pop-out</p>
            </div>

            <div className={styles.sections}>
                <div className={styles.section}>
                    <h2>Tipos Básicos</h2>
                    <div className={styles.buttonGrid}>
                        <Button variant="primary" onClick={handleSuccessToast}>
                            Sucesso
                        </Button>
                        <Button variant="destructive" onClick={handleErrorToast}>
                            Erro
                        </Button>
                        <Button variant="secondary" onClick={handleWarningToast}>
                            Aviso
                        </Button>
                        <Button variant="ghost" onClick={handleInfoToast}>
                            Informação
                        </Button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>Estados Especiais</h2>
                    <div className={styles.buttonGrid}>
                        <Button variant="primary" onClick={handleLoadingToast}>
                            Loading
                        </Button>
                        <Button variant="secondary" onClick={handleCustomToast}>
                            Personalizada
                        </Button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>Cenários Comuns</h2>
                    <div className={styles.buttonGrid}>
                        <Button variant="primary" onClick={handleApiSuccess}>
                            API Sucesso
                        </Button>
                        <Button variant="destructive" onClick={handleApiError}>
                            API Erro
                        </Button>
                        <Button variant="secondary" onClick={handleFormValidation}>
                            Validação
                        </Button>
                        <Button variant="ghost" onClick={handleSaveSuccess}>
                            Salvar
                        </Button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>Confirmações</h2>
                    <div className={styles.buttonGrid}>
                        <Button variant="destructive" onClick={handleDeleteConfirm}>
                            Confirmar Exclusão
                        </Button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>Operações com Progresso</h2>
                    <div className={styles.buttonGrid}>
                        <Button variant="primary" onClick={handleBackupProgress}>
                            Backup
                        </Button>
                        <Button variant="secondary" onClick={handleUploadProgress}>
                            Upload
                        </Button>
                    </div>
                </div>

                <div className={styles.section}>
                    <h2>Múltiplas Notificações</h2>
                    <div className={styles.buttonGrid}>
                        <Button variant="primary" onClick={handleMultipleToasts}>
                            Múltiplas
                        </Button>
                        <Button variant="ghost" onClick={handleClearAll}>
                            Limpar Todas
                        </Button>
                    </div>
                </div>
            </div>

            <div className={styles.info}>
                <h3>Como usar:</h3>
                <ul>
                    <li>Clique nos botões para testar diferentes tipos de notificação</li>
                    <li>As notificações aparecem no canto superior direito</li>
                    <li>Elas desaparecem automaticamente após alguns segundos</li>
                    <li>Você pode fechar manualmente clicando no X</li>
                    <li>Notificações de loading não desaparecem automaticamente</li>
                </ul>
            </div>
        </div>
    );
}
