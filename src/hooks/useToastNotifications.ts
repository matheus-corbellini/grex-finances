"use client";

import { useToast as useToastContext } from "../context/ToastContext";
import { ToastProps } from "../components/ui/Toast";

export interface ToastNotificationOptions extends Partial<ToastProps> {
    action?: {
        label: string;
        onClick: () => void;
    };
}

export const useToastNotifications = () => {
    const toast = useToastContext();

    const showSuccess = (message: string, options?: ToastNotificationOptions) => {
        return toast.success(message, {
            duration: 4000,
            ...options,
        });
    };

    const showError = (message: string, options?: ToastNotificationOptions) => {
        return toast.error(message, {
            duration: 6000,
            ...options,
        });
    };

    const showWarning = (message: string, options?: ToastNotificationOptions) => {
        return toast.warning(message, {
            duration: 5000,
            ...options,
        });
    };

    const showInfo = (message: string, options?: ToastNotificationOptions) => {
        return toast.info(message, {
            duration: 4000,
            ...options,
        });
    };

    const showLoading = (message: string, options?: ToastNotificationOptions) => {
        return toast.loading(message, {
            duration: 0,
            ...options,
        });
    };

    const showCustom = (toastData: Omit<ToastProps, "id">) => {
        return toast.addToast(toastData);
    };

    const dismissToast = (id: string) => {
        toast.removeToast(id);
    };

    const dismissAll = () => {
        toast.clearAllToasts();
    };

    // Convenience methods for common scenarios
    const showApiSuccess = (action: string) => {
        return showSuccess(`${action} realizado com sucesso!`);
    };

    const showApiError = (action: string, error?: string) => {
        return showError(
            `Erro ao ${action.toLowerCase()}. ${error || "Tente novamente."}`,
            {
                action: {
                    label: "Tentar novamente",
                    onClick: () => {
                        // This would typically trigger a retry mechanism
                        console.log("Retry action triggered");
                    },
                },
            }
        );
    };

    const showFormValidation = (field: string) => {
        return showWarning(`Por favor, preencha o campo ${field}`);
    };

    const showSaveSuccess = () => {
        return showSuccess("Configurações salvas com sucesso!");
    };

    const showDeleteConfirm = (item: string, onConfirm: () => void) => {
        return showWarning(`Tem certeza que deseja excluir ${item}?`, {
            action: {
                label: "Excluir",
                onClick: onConfirm,
            },
        });
    };

    const showBackupProgress = (message: string) => {
        return showLoading(message);
    };

    const showBackupComplete = (size: string) => {
        return showSuccess(`Backup concluído! Tamanho: ${size}`);
    };

    const showUploadProgress = (filename: string) => {
        return showLoading(`Enviando ${filename}...`);
    };

    const showUploadComplete = (filename: string) => {
        return showSuccess(`${filename} enviado com sucesso!`);
    };

    return {
        // Basic methods
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showLoading,
        showCustom,
        dismissToast,
        dismissAll,

        // Convenience methods
        showApiSuccess,
        showApiError,
        showFormValidation,
        showSaveSuccess,
        showDeleteConfirm,
        showBackupProgress,
        showBackupComplete,
        showUploadProgress,
        showUploadComplete,

        // Direct access to toast context
        toast,
    };
};
