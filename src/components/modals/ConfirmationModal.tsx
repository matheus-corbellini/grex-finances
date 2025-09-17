"use client";

import React from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import {
    AlertTriangle,
    CheckCircle,
    Info,
    XCircle,
    Trash2,
    Shield,
    Database,
    User,
    DollarSign,
    Settings,
    LogOut
} from "lucide-react";
import styles from "./ConfirmationModal.module.css";

export type ConfirmationType =
    | "delete"
    | "critical"
    | "warning"
    | "info"
    | "success"
    | "logout"
    | "backup"
    | "export"
    | "import"
    | "reset"
    | "update";

export interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    type: ConfirmationType;
    title: string;
    message: string;
    details?: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    isDestructive?: boolean;
    requiresTyping?: boolean;
    typingConfirmation?: string;
    typedValue?: string;
    onTypedValueChange?: (value: string) => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    type,
    title,
    message,
    details,
    confirmText,
    cancelText = "Cancelar",
    isLoading = false,
    isDestructive = false,
    requiresTyping = false,
    typingConfirmation,
    typedValue = "",
    onTypedValueChange
}) => {
    const getIcon = () => {
        switch (type) {
            case "delete":
                return <Trash2 size={24} />;
            case "critical":
                return <AlertTriangle size={24} />;
            case "warning":
                return <AlertTriangle size={24} />;
            case "info":
                return <Info size={24} />;
            case "success":
                return <CheckCircle size={24} />;
            case "logout":
                return <LogOut size={24} />;
            case "backup":
                return <Database size={24} />;
            case "export":
                return <Database size={24} />;
            case "import":
                return <Database size={24} />;
            case "reset":
                return <Settings size={24} />;
            case "update":
                return <CheckCircle size={24} />;
            default:
                return <AlertTriangle size={24} />;
        }
    };

    const getIconColor = () => {
        switch (type) {
            case "delete":
            case "critical":
                return "var(--color-error-600)";
            case "warning":
                return "var(--color-warning-600)";
            case "info":
                return "var(--color-primary-600)";
            case "success":
                return "var(--color-success-600)";
            case "logout":
                return "var(--color-warning-600)";
            case "backup":
            case "export":
            case "import":
                return "var(--color-primary-600)";
            case "reset":
                return "var(--color-warning-600)";
            case "update":
                return "var(--color-success-600)";
            default:
                return "var(--color-neutrals-600)";
        }
    };

    const getDefaultConfirmText = () => {
        switch (type) {
            case "delete":
                return "Excluir";
            case "critical":
                return "Confirmar";
            case "warning":
                return "Continuar";
            case "info":
                return "OK";
            case "success":
                return "Confirmar";
            case "logout":
                return "Sair";
            case "backup":
                return "Fazer Backup";
            case "export":
                return "Exportar";
            case "import":
                return "Importar";
            case "reset":
                return "Resetar";
            case "update":
                return "Atualizar";
            default:
                return "Confirmar";
        }
    };

    const getDefaultTitle = () => {
        switch (type) {
            case "delete":
                return "Confirmar Exclusão";
            case "critical":
                return "Ação Crítica";
            case "warning":
                return "Atenção";
            case "info":
                return "Informação";
            case "success":
                return "Confirmação";
            case "logout":
                return "Confirmar Logout";
            case "backup":
                return "Confirmar Backup";
            case "export":
                return "Confirmar Exportação";
            case "import":
                return "Confirmar Importação";
            case "reset":
                return "Confirmar Reset";
            case "update":
                return "Confirmar Atualização";
            default:
                return "Confirmação";
        }
    };

    const canConfirm = () => {
        if (requiresTyping) {
            return typedValue === typingConfirmation;
        }
        return true;
    };

    const handleConfirm = () => {
        if (canConfirm()) {
            onConfirm();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && canConfirm()) {
            handleConfirm();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles.modalContent}>
                {/* Header */}
                <div className={styles.header}>
                    <div
                        className={styles.iconWrapper}
                        style={{ color: getIconColor() }}
                    >
                        {getIcon()}
                    </div>
                    <div className={styles.titleSection}>
                        <h2 className={styles.title}>
                            {title || getDefaultTitle()}
                        </h2>
                    </div>
                </div>

                {/* Body */}
                <div className={styles.body}>
                    <p className={styles.message}>{message}</p>

                    {details && (
                        <div className={styles.details}>
                            <p>{details}</p>
                        </div>
                    )}

                    {requiresTyping && typingConfirmation && (
                        <div className={styles.typingSection}>
                            <label className={styles.typingLabel}>
                                Para confirmar, digite: <strong>{typingConfirmation}</strong>
                            </label>
                            <input
                                type="text"
                                value={typedValue}
                                onChange={(e) => onTypedValueChange?.(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className={styles.typingInput}
                                placeholder={typingConfirmation}
                                autoFocus
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                        className={styles.cancelButton}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={isDestructive ? "destructive" : "primary"}
                        onClick={handleConfirm}
                        disabled={!canConfirm() || isLoading}
                        isLoading={isLoading}
                        className={styles.confirmButton}
                    >
                        {confirmText || getDefaultConfirmText()}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

// Hook para facilitar o uso do modal
export const useConfirmationModal = () => {
    const [modalState, setModalState] = React.useState<{
        isOpen: boolean;
        props: Partial<ConfirmationModalProps>;
    }>({
        isOpen: false,
        props: {}
    });

    const showConfirmation = (props: Omit<ConfirmationModalProps, "isOpen" | "onClose">) => {
        setModalState({
            isOpen: true,
            props
        });
    };

    const hideConfirmation = () => {
        setModalState({
            isOpen: false,
            props: {}
        });
    };

    const ConfirmationModalComponent = () => (
        <ConfirmationModal
            isOpen={modalState.isOpen}
            onClose={hideConfirmation}
            {...modalState.props}
        />
    );

    return {
        showConfirmation,
        hideConfirmation,
        ConfirmationModalComponent
    };
};

// Componentes específicos para casos comuns
export const DeleteConfirmationModal: React.FC<Omit<ConfirmationModalProps, "type">> = (props) => (
    <ConfirmationModal {...props} type="delete" isDestructive />
);

export const LogoutConfirmationModal: React.FC<Omit<ConfirmationModalProps, "type">> = (props) => (
    <ConfirmationModal {...props} type="logout" />
);

export const CriticalActionModal: React.FC<Omit<ConfirmationModalProps, "type">> = (props) => (
    <ConfirmationModal {...props} type="critical" isDestructive />
);

export const BackupConfirmationModal: React.FC<Omit<ConfirmationModalProps, "type">> = (props) => (
    <ConfirmationModal {...props} type="backup" />
);

export const ExportConfirmationModal: React.FC<Omit<ConfirmationModalProps, "type">> = (props) => (
    <ConfirmationModal {...props} type="export" />
);

export const ImportConfirmationModal: React.FC<Omit<ConfirmationModalProps, "type">> = (props) => (
    <ConfirmationModal {...props} type="import" />
);

export const ResetConfirmationModal: React.FC<Omit<ConfirmationModalProps, "type">> = (props) => (
    <ConfirmationModal {...props} type="reset" isDestructive />
);
