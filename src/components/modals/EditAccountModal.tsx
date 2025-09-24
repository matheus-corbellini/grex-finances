"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Account } from "../../services/api/accounts.service";
import { X, Building2, CreditCard, PiggyBank, Wallet, TrendingUp } from "lucide-react";
import styles from "./EditAccountModal.module.css";

interface EditAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (accountData: any) => Promise<void>;
    account: Account | null;
}

const accountTypes = [
    { value: 'checking', label: 'Conta Corrente', icon: Building2 },
    { value: 'savings', label: 'Poupança', icon: PiggyBank },
    { value: 'credit_card', label: 'Cartão de Crédito', icon: CreditCard },
    { value: 'cash', label: 'Dinheiro', icon: Wallet },
    { value: 'investment', label: 'Investimento', icon: TrendingUp }
];

const bankOptions = [
    'Banco do Brasil',
    'Caixa Econômica Federal',
    'Itaú',
    'Bradesco',
    'Santander',
    'Nubank',
    'Inter',
    'C6 Bank',
    'BTG Pactual',
    'XP Investimentos',
    'Outro'
];

export default function EditAccountModal({
    isOpen,
    onClose,
    onSubmit,
    account
}: EditAccountModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        type: "checking",
        bankName: "",
        accountNumber: "",
        agency: "",
        balance: "",
        description: "",
        color: "#3b82f6",
        icon: "bank-bb"
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Preencher formulário quando conta mudar
    useEffect(() => {
        if (account) {
            setFormData({
                name: account.name || "",
                type: account.type?.category || "checking",
                bankName: account.bankName || "",
                accountNumber: account.accountNumber || "",
                agency: account.agency || "",
                balance: account.balance?.toString() || "0",
                description: account.description || "",
                color: account.color || "#3b82f6",
                icon: account.icon || "bank-bb"
            });
        }
    }, [account]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Limpar erro do campo quando usuário começar a digitar
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Nome da conta é obrigatório";
        }

        if (!formData.type) {
            newErrors.type = "Tipo de conta é obrigatório";
        }

        if (formData.balance && isNaN(parseFloat(formData.balance))) {
            newErrors.balance = "Saldo deve ser um número válido";
        }

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
            const accountData = {
                ...formData,
                balance: parseFloat(formData.balance) || 0,
                id: account?.id
            };

            await onSubmit(accountData);
            onClose();
        } catch (error: any) {
            console.error("Erro ao editar conta:", error);
            setErrors({ submit: error.message || "Erro ao editar conta" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: "",
            type: "checking",
            bankName: "",
            accountNumber: "",
            agency: "",
            balance: "",
            description: "",
            color: "#3b82f6",
            icon: "bank-bb"
        });
        setErrors({});
        onClose();
    };

    const selectedAccountType = accountTypes.find(type => type.value === formData.type);

    if (!account) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="large">
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Editar Conta</h2>
                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
                        type="button"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGrid}>
                        {/* Nome da Conta */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <Building2 size={16} />
                                Nome da Conta *
                            </label>
                            <Input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Ex: Conta Principal"
                                error={errors.name}
                                className={styles.input}
                            />
                        </div>

                        {/* Tipo de Conta */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Tipo de Conta *</label>
                            <Select
                                value={formData.type}
                                onChange={(value) => handleInputChange("type", value)}
                                error={errors.type}
                                className={styles.select}
                            >
                                {accountTypes.map(type => {
                                    const IconComponent = type.icon;
                                    return (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    );
                                })}
                            </Select>
                        </div>

                        {/* Banco */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Banco</label>
                            <Select
                                value={formData.bankName}
                                onChange={(value) => handleInputChange("bankName", value)}
                                className={styles.select}
                            >
                                <option value="">Selecione um banco</option>
                                {bankOptions.map(bank => (
                                    <option key={bank} value={bank}>
                                        {bank}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* Agência */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Agência</label>
                            <Input
                                type="text"
                                value={formData.agency}
                                onChange={(e) => handleInputChange("agency", e.target.value)}
                                placeholder="Ex: 1234"
                                className={styles.input}
                            />
                        </div>

                        {/* Número da Conta */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Número da Conta</label>
                            <Input
                                type="text"
                                value={formData.accountNumber}
                                onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                                placeholder="Ex: 12345-6"
                                className={styles.input}
                            />
                        </div>

                        {/* Saldo Atual */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Saldo Atual</label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.balance}
                                onChange={(e) => handleInputChange("balance", e.target.value)}
                                placeholder="0,00"
                                error={errors.balance}
                                className={styles.input}
                            />
                        </div>

                        {/* Cor */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Cor</label>
                            <div className={styles.colorInputContainer}>
                                <input
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => handleInputChange("color", e.target.value)}
                                    className={styles.colorInput}
                                />
                                <span className={styles.colorValue}>{formData.color}</span>
                            </div>
                        </div>

                        {/* Ícone */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Ícone</label>
                            <Select
                                value={formData.icon}
                                onChange={(value) => handleInputChange("icon", value)}
                                className={styles.select}
                            >
                                <option value="bank-bb">Banco do Brasil</option>
                                <option value="bank-caixa">Caixa</option>
                                <option value="bank-itau">Itaú</option>
                                <option value="bank-bradesco">Bradesco</option>
                                <option value="bank-santander">Santander</option>
                                <option value="bank-nubank">Nubank</option>
                                <option value="bank-inter">Inter</option>
                                <option value="credit-card">Cartão de Crédito</option>
                                <option value="piggy-bank">Cofrinho</option>
                                <option value="wallet">Carteira</option>
                                <option value="trending-up">Investimento</option>
                            </Select>
                        </div>

                        {/* Descrição */}
                        <div className={styles.formGroupFull}>
                            <label className={styles.label}>Descrição</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                                placeholder="Descrição adicional da conta (opcional)"
                                className={styles.textarea}
                                rows={3}
                            />
                        </div>
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
                            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
