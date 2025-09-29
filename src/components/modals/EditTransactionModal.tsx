"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Transaction } from "../../../shared/types/transaction.types";
import { Account } from "../../../shared/types/account.types";
import { X, Calendar as CalendarIcon, DollarSign, Tag, FileText } from "lucide-react";
import styles from "./EditTransactionModal.module.css";

interface EditTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (transactionData: any) => Promise<void>;
    transaction: Transaction | null;
    accounts: Account[];
    categories: any[];
}

export default function EditTransactionModal({
    isOpen,
    onClose,
    onSubmit,
    transaction,
    accounts,
    categories
}: EditTransactionModalProps) {
    const [formData, setFormData] = useState({
        description: "",
        amount: "",
        type: "expense",
        categoryId: "",
        accountId: "",
        date: "",
        status: "pending",
        notes: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Preencher formulário quando transação mudar
    useEffect(() => {
        if (transaction) {
            setFormData({
                description: transaction.description || "",
                amount: Math.abs(transaction.amount).toString(),
                type: transaction.type || "expense",
                categoryId: transaction.categoryId || "",
                accountId: transaction.accountId || "",
                date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : "",
                status: transaction.status || "pending",
                notes: transaction.notes || ""
            });
        }
    }, [transaction]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Limpar erro do campo quando usuário começar a digitar
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.description.trim()) {
            newErrors.description = "Descrição é obrigatória";
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            newErrors.amount = "Valor deve ser maior que zero";
        }

        if (!formData.categoryId) {
            newErrors.categoryId = "Categoria é obrigatória";
        }

        if (!formData.accountId) {
            newErrors.accountId = "Conta é obrigatória";
        }

        if (!formData.date) {
            newErrors.date = "Data é obrigatória";
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
            const transactionData = {
                ...formData,
                amount: parseFloat(formData.amount) * (formData.type === "income" ? 1 : -1),
                id: transaction?.id
            };

            await onSubmit(transactionData);
            onClose();
        } catch (error: any) {
            console.error("Erro ao editar transação:", error);
            setErrors({ submit: error.message || "Erro ao editar transação" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            description: "",
            amount: "",
            type: "expense",
            categoryId: "",
            accountId: "",
            date: "",
            status: "pending",
            notes: ""
        });
        setErrors({});
        onClose();
    };

    if (!transaction) return null;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="large" title="Editar Transação">
            <div className={styles.modalContent}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGrid}>
                        {/* Descrição */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <FileText size={16} />
                                Descrição *
                            </label>
                            <Input
                                type="text"
                                value={formData.description}
                                onChange={(value) => handleInputChange("description", value)}
                                placeholder="Digite a descrição da transação"
                                error={errors.description}
                                className={styles.input}
                            />
                        </div>

                        {/* Valor */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <DollarSign size={16} />
                                Valor *
                            </label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.amount}
                                onChange={(value) => handleInputChange("amount", value)}
                                placeholder="0,00"
                                error={errors.amount}
                                className={styles.input}
                            />
                        </div>

                        {/* Tipo */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Tipo *</label>
                            <Select
                                value={formData.type}
                                onChange={(value) => handleInputChange("type", value)}
                                error={errors.type}
                                className={styles.select}
                            >
                                <option value="expense">Despesa</option>
                                <option value="income">Receita</option>
                                <option value="transfer">Transferência</option>
                            </Select>
                        </div>

                        {/* Categoria */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <Tag size={16} />
                                Categoria *
                            </label>
                            <Select
                                value={formData.categoryId}
                                onChange={(value) => handleInputChange("categoryId", value)}
                                error={errors.categoryId}
                                className={styles.select}
                            >
                                <option value="">Selecione uma categoria</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* Conta */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Conta *</label>
                            <Select
                                value={formData.accountId}
                                onChange={(value) => handleInputChange("accountId", value)}
                                error={errors.accountId}
                                className={styles.select}
                            >
                                <option value="">Selecione uma conta</option>
                                {accounts.map(account => (
                                    <option key={account.id} value={account.id}>
                                        {account.name}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* Data */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>
                                <CalendarIcon size={16} />
                                Data *
                            </label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(value) => handleInputChange("date", value)}
                                error={errors.date}
                                className={styles.input}
                            />
                        </div>

                        {/* Status */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Status</label>
                            <Select
                                value={formData.status}
                                onChange={(value) => handleInputChange("status", value)}
                                className={styles.select}
                            >
                                <option value="pending">Pendente</option>
                                <option value="completed">Concluída</option>
                                <option value="cancelled">Cancelada</option>
                                <option value="failed">Falhada</option>
                            </Select>
                        </div>

                        {/* Observações */}
                        <div className={styles.formGroupFull}>
                            <label className={styles.label}>Observações</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => handleInputChange("notes", e.target.value)}
                                placeholder="Observações adicionais (opcional)"
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
