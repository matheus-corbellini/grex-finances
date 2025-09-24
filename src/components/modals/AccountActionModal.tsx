"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Account } from "../../services/api/accounts.service";
import { X, RefreshCw, CheckCircle, AlertTriangle, TrendingUp, Calculator, Eye, Settings } from "lucide-react";
import styles from "./AccountActionModal.module.css";

interface AccountActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (action: string, data: any) => Promise<void>;
    account: Account | null;
    action: string;
}

const actionConfig = {
    conciliar: {
        title: "Conciliar Conta",
        icon: CheckCircle,
        description: "Compare o saldo da conta com o extrato bancário",
        fields: [
            { name: "saldoExtrato", label: "Saldo do Extrato", type: "number", required: true },
            { name: "dataExtrato", label: "Data do Extrato", type: "date", required: true },
            { name: "observacoes", label: "Observações", type: "textarea", required: false }
        ]
    },
    regularizar: {
        title: "Regularizar Conta",
        icon: RefreshCw,
        description: "Ajuste o saldo da conta para corrigir discrepâncias",
        fields: [
            { name: "novoSaldo", label: "Novo Saldo", type: "number", required: true },
            {
                name: "motivo", label: "Motivo da Regularização", type: "select", required: true, options: [
                    "Erro de lançamento",
                    "Taxa não contabilizada",
                    "Juros não aplicados",
                    "Transferência não processada",
                    "Outro"
                ]
            },
            { name: "observacoes", label: "Observações", type: "textarea", required: false }
        ]
    },
    revisar: {
        title: "Revisar Conta",
        icon: Eye,
        description: "Revise os lançamentos e movimentações da conta",
        fields: [
            { name: "periodoInicio", label: "Período Início", type: "date", required: true },
            { name: "periodoFim", label: "Período Fim", type: "date", required: true },
            {
                name: "tipoRevisao", label: "Tipo de Revisão", type: "select", required: true, options: [
                    "Revisão completa",
                    "Revisão de receitas",
                    "Revisão de despesas",
                    "Revisão de transferências"
                ]
            },
            { name: "observacoes", label: "Observações", type: "textarea", required: false }
        ]
    },
    ajustar: {
        title: "Ajustar Conta",
        icon: Settings,
        description: "Faça ajustes específicos na conta",
        fields: [
            {
                name: "tipoAjuste", label: "Tipo de Ajuste", type: "select", required: true, options: [
                    "Ajuste de saldo",
                    "Ajuste de categoria",
                    "Ajuste de data",
                    "Ajuste de valor",
                    "Outro"
                ]
            },
            { name: "valorAjuste", label: "Valor do Ajuste", type: "number", required: true },
            { name: "motivo", label: "Motivo do Ajuste", type: "textarea", required: true }
        ]
    },
    analisar: {
        title: "Analisar Conta",
        icon: TrendingUp,
        description: "Gere relatório de análise da conta",
        fields: [
            { name: "periodoInicio", label: "Período Início", type: "date", required: true },
            { name: "periodoFim", label: "Período Fim", type: "date", required: true },
            {
                name: "tipoAnalise", label: "Tipo de Análise", type: "select", required: true, options: [
                    "Análise de fluxo de caixa",
                    "Análise de receitas",
                    "Análise de despesas",
                    "Análise de tendências",
                    "Análise completa"
                ]
            },
            { name: "incluirGraficos", label: "Incluir Gráficos", type: "checkbox", required: false }
        ]
    },
    fechar: {
        title: "Fechar Conta",
        icon: AlertTriangle,
        description: "Encerre esta conta permanentemente",
        fields: [
            { name: "dataFechamento", label: "Data de Fechamento", type: "date", required: true },
            {
                name: "motivo", label: "Motivo do Fechamento", type: "select", required: true, options: [
                    "Conta não utilizada",
                    "Migração para outro banco",
                    "Fechamento por solicitação",
                    "Outro"
                ]
            },
            {
                name: "transferirSaldo", label: "Transferir Saldo", type: "select", required: true, options: [
                    "Sim, transferir para outra conta",
                    "Não, manter saldo zerado"
                ]
            },
            { name: "contaDestino", label: "Conta de Destino", type: "select", required: false },
            { name: "observacoes", label: "Observações", type: "textarea", required: false }
        ]
    }
};

export default function AccountActionModal({
    isOpen,
    onClose,
    onSubmit,
    account,
    action
}: AccountActionModalProps) {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const config = actionConfig[action as keyof typeof actionConfig];
    const IconComponent = config?.icon || CheckCircle;

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Limpar erro do campo quando usuário começar a digitar
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        config.fields.forEach(field => {
            if (field.required && !formData[field.name]) {
                newErrors[field.name] = `${field.label} é obrigatório`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await onSubmit(action, formData);
            onClose();
        } catch (error: any) {
            console.error(`Erro ao executar ação ${action}:`, error);
            setErrors({ submit: error.message || `Erro ao executar ação ${action}` });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({});
        setErrors({});
        onClose();
    };

    if (!account || !config) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="large">
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <div className={styles.headerContent}>
                        <div className={styles.headerIcon}>
                            <IconComponent size={24} />
                        </div>
                        <div>
                            <h2 className={styles.modalTitle}>{config.title}</h2>
                            <p className={styles.modalSubtitle}>{account.name}</p>
                        </div>
                    </div>
                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
                        type="button"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.description}>
                        <p>{config.description}</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.formGrid}>
                            {config.fields.map(field => (
                                <div key={field.name} className={styles.formGroup}>
                                    <label className={styles.label}>
                                        {field.label}
                                        {field.required && <span className={styles.required}>*</span>}
                                    </label>

                                    {field.type === 'select' ? (
                                        <Select
                                            value={formData[field.name] || ''}
                                            onChange={(value) => handleInputChange(field.name, value)}
                                            error={errors[field.name]}
                                            className={styles.input}
                                        >
                                            <option value="">Selecione uma opção</option>
                                            {field.options?.map(option => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </Select>
                                    ) : field.type === 'textarea' ? (
                                        <textarea
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                                            placeholder={`Digite ${field.label.toLowerCase()}`}
                                            className={styles.textarea}
                                            rows={3}
                                        />
                                    ) : field.type === 'checkbox' ? (
                                        <div className={styles.checkboxContainer}>
                                            <input
                                                type="checkbox"
                                                checked={formData[field.name] || false}
                                                onChange={(e) => handleInputChange(field.name, e.target.checked)}
                                                className={styles.checkbox}
                                            />
                                            <label className={styles.checkboxLabel}>
                                                {field.label}
                                            </label>
                                        </div>
                                    ) : (
                                        <Input
                                            type={field.type}
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                                            placeholder={`Digite ${field.label.toLowerCase()}`}
                                            error={errors[field.name]}
                                            className={styles.input}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {errors.submit && (
                            <div className={styles.errorMessage}>
                                {errors.submit}
                            </div>
                        )}

                        <div className={styles.modalActions}>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting}
                                loading={isSubmitting}
                            >
                                {isSubmitting ? "Processando..." : `Executar ${config.title}`}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}
