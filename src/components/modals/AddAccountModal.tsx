"use client";

import React, { useState } from "react";
import { X, Building2, Wallet, CreditCard, PiggyBank } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import styles from "./AddAccountModal.module.css";

interface AddAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (accountData: AccountFormData) => Promise<void>;
}

interface AccountFormData {
    name: string;
    type: 'bank' | 'wallet' | 'credit_card' | 'savings';
    bankName?: string;
    accountNumber?: string;
    agency?: string;
    initialBalance: number;
    description?: string;
}

const accountTypes = [
    { value: 'bank', label: 'Conta Bancária', icon: Building2 },
    { value: 'wallet', label: 'Carteira Digital', icon: Wallet },
    { value: 'credit_card', label: 'Cartão de Crédito', icon: CreditCard },
    { value: 'savings', label: 'Poupança', icon: PiggyBank },
];

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const [formData, setFormData] = useState<AccountFormData>({
        name: '',
        type: 'bank',
        bankName: '',
        accountNumber: '',
        agency: '',
        initialBalance: 0,
        description: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: string) => {
        console.log(`🔄 Atualizando campo ${field}:`, value);

        if (field === 'initialBalance') {
            const numericValue = parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
            setFormData(prev => ({ ...prev, [field]: numericValue }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }

        console.log(`✅ Campo ${field} atualizado. Novo formData:`, formData);
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório';
        }

        if (formData.type === 'bank') {
            if (!formData.bankName?.trim()) {
                newErrors.bankName = 'Nome do banco é obrigatório';
            }
            if (!formData.accountNumber?.trim()) {
                newErrors.accountNumber = 'Número da conta é obrigatório';
            }
            if (!formData.agency?.trim()) {
                newErrors.agency = 'Agência é obrigatória';
            }
        }

        if (formData.initialBalance < 0) {
            newErrors.initialBalance = 'Saldo inicial deve ser maior ou igual a zero';
        } else if (isNaN(formData.initialBalance)) {
            newErrors.initialBalance = 'Saldo inicial deve ser um número válido';
        }

        console.log("🔍 Erros encontrados na validação:", newErrors);
        console.log("🔍 Quantidade de erros:", Object.keys(newErrors).length);

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        console.log("🔍 Iniciando validação do formulário...");
        console.log("📋 Dados do formulário:", formData);

        if (!validateForm()) {
            console.log("❌ Validação falhou, erros:", errors);
            return;
        }

        console.log("✅ Validação passou, enviando dados...");
        setIsLoading(true);
        try {
            await onSubmit(formData);
            // Reset form after successful submission
            setFormData({
                name: '',
                type: 'bank',
                bankName: '',
                accountNumber: '',
                agency: '',
                initialBalance: 0,
                description: '',
            });
            onClose();
        } catch (error: any) {
            console.error("❌ Erro no modal:", error);
            setErrors({ general: error.message || 'Erro ao adicionar conta' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            type: 'bank',
            bankName: '',
            accountNumber: '',
            agency: '',
            initialBalance: 0,
            description: '',
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                {/* Header */}
                <div className={styles.header}>
                    <h2 className={styles.title}>Adicionar Conta/Carteira</h2>
                    <button
                        onClick={handleClose}
                        className={styles.closeButton}
                        disabled={isLoading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <div className={styles.content}>
                    {/* Error Message */}
                    {errors.general && (
                        <div className={styles.errorMessage}>
                            {errors.general}
                        </div>
                    )}

                    {/* Account Type Selection */}
                    <div className={styles.section}>
                        <label className={styles.label}>Tipo de Conta</label>
                        <div className={styles.typeGrid}>
                            {accountTypes.map((type) => {
                                const IconComponent = type.icon;
                                return (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => handleInputChange('type', type.value)}
                                        className={`${styles.typeButton} ${formData.type === type.value ? styles.typeButtonActive : ''
                                            }`}
                                    >
                                        <IconComponent size={20} />
                                        <span>{type.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Account Name */}
                    <Input
                        id="name"
                        name="name"
                        label="Nome da Conta"
                        placeholder="Ex: Conta Corrente Principal"
                        value={formData.name}
                        onChange={(value) => handleInputChange('name', value)}
                        error={errors.name}
                        required
                    />

                    {/* Bank-specific fields */}
                    {formData.type === 'bank' && (
                        <>
                            <Input
                                id="bankName"
                                name="bankName"
                                label="Nome do Banco"
                                placeholder="Ex: Banco do Brasil"
                                value={formData.bankName || ''}
                                onChange={(value) => handleInputChange('bankName', value)}
                                error={errors.bankName}
                                required
                            />
                            <div className={styles.row}>
                                <Input
                                    id="agency"
                                    name="agency"
                                    label="Agência"
                                    placeholder="Ex: 1234"
                                    value={formData.agency || ''}
                                    onChange={(value) => handleInputChange('agency', value)}
                                    error={errors.agency}
                                    required
                                />
                                <Input
                                    id="accountNumber"
                                    name="accountNumber"
                                    label="Número da Conta"
                                    placeholder="Ex: 12345-6"
                                    value={formData.accountNumber || ''}
                                    onChange={(value) => handleInputChange('accountNumber', value)}
                                    error={errors.accountNumber}
                                    required
                                />
                            </div>
                        </>
                    )}

                    {/* Initial Balance */}
                    <Input
                        id="initialBalance"
                        name="initialBalance"
                        label="Saldo Inicial"
                        placeholder="Ex: 1.000,00"
                        value={formData.initialBalance.toString()}
                        onChange={(value) => handleInputChange('initialBalance', value)}
                        error={errors.initialBalance}
                        required
                    />

                    {/* Description */}
                    <Input
                        id="description"
                        name="description"
                        label="Descrição (Opcional)"
                        placeholder="Ex: Conta para despesas pessoais"
                        value={formData.description || ''}
                        onChange={(value) => handleInputChange('description', value)}
                        error={errors.description}
                    />

                    {/* Actions */}
                    <div className={styles.actions}>
                        <Button
                            variant="secondary"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Adicionando...' : 'Adicionar Conta'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddAccountModal;
