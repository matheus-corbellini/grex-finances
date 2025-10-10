import React, { useState, useEffect } from 'react';
import { X, Plus, Calendar, DollarSign, Tag, CreditCard } from 'lucide-react';
import { Button } from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import CurrencyInput from '../ui/CurrencyInput';
import styles from './AddTransactionModal.module.css';
import { TransactionType, TransactionStatus } from '../../../shared/types/transaction.types';

interface Account {
    id: string;
    name: string;
    type?: {
        name?: string;
        category?: string;
    };
    balance: number;
}

interface Category {
    id: string;
    name: string;
    type: 'income' | 'expense' | 'both';
    color: string;
    icon: string;
}

interface TransactionFormData {
    description: string;
    amount: number;
    type: TransactionType;
    categoryId: string;
    accountId: string;
    date: string;
    status: TransactionStatus;
    notes?: string;
}

interface AddTransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: TransactionFormData) => Promise<void>;
    accounts: Account[];
    categories: Category[];
}

export default function AddTransactionModal({
    isOpen,
    onClose,
    onSubmit,
    accounts,
    categories
}: AddTransactionModalProps) {
    const [formData, setFormData] = useState<TransactionFormData>({
        description: '',
        amount: 0,
        type: TransactionType.EXPENSE,
        categoryId: '',
        accountId: '',
        date: new Date().toISOString().split('T')[0],
        status: TransactionStatus.COMPLETED,
        notes: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    // Filtrar categorias baseado no tipo de transação
    const filteredCategories = categories.filter(cat => {
        // Converter o tipo da categoria para o formato do enum se necessário
        const categoryType = cat.type === 'income' ? TransactionType.INCOME :
            cat.type === 'expense' ? TransactionType.EXPENSE :
                cat.type;

        return categoryType === formData.type || cat.type === 'both';
    });

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.description.trim()) {
            newErrors.description = 'Descrição é obrigatória';
        }

        if (formData.amount === 0) {
            newErrors.amount = 'Valor deve ser diferente de zero';
        } else if (isNaN(formData.amount)) {
            newErrors.amount = 'Valor deve ser um número válido';
        }

        if (!formData.categoryId) {
            newErrors.categoryId = 'Categoria é obrigatória';
        }

        if (!formData.accountId) {
            newErrors.accountId = 'Conta é obrigatória';
        }

        if (!formData.date) {
            newErrors.date = 'Data é obrigatória';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        console.log('📝 Dados do formulário antes de enviar:', formData);
        console.log('📝 Tipo do valor:', typeof formData.amount);
        console.log('📝 Valor é NaN?', isNaN(formData.amount));
        console.log('📝 Valor é válido?', formData.amount > 0);

        // Validar se o valor é válido antes de enviar
        if (isNaN(formData.amount) || formData.amount <= 0) {
            setErrors({ amount: 'Valor deve ser um número válido maior que zero' });
            return;
        }

        setIsLoading(true);
        try {
            await onSubmit(formData);
            // Reset form after successful submission
            setFormData({
                description: '',
                amount: 0,
                type: TransactionType.EXPENSE,
                categoryId: '',
                accountId: '',
                date: new Date().toISOString().split('T')[0],
                status: TransactionStatus.COMPLETED,
                notes: ''
            });
            onClose();
        } catch (error: any) {
            console.error('❌ Erro ao adicionar transação:', error);
            setErrors({ general: error.message || 'Erro ao adicionar transação' });
        } finally {
            setIsLoading(false);
        }
    };


    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>
                        <Plus size={20} />
                        Nova Transação
                    </h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className={styles.content}>
                    {errors.general && (
                        <div className={styles.errorMessage}>
                            {errors.general}
                        </div>
                    )}

                    <div className={styles.formGrid}>
                        {/* Tipo de Transação */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Tipo de Transação</label>
                            <div className={styles.typeButtons}>
                                <button
                                    type="button"
                                    className={`${styles.typeButton} ${formData.type === TransactionType.EXPENSE ? styles.active : ''}`}
                                    onClick={() => handleInputChange('type', TransactionType.EXPENSE)}
                                >
                                    <CreditCard size={16} />
                                    Despesa
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.typeButton} ${formData.type === TransactionType.INCOME ? styles.active : ''}`}
                                    onClick={() => handleInputChange('type', TransactionType.INCOME)}
                                >
                                    <DollarSign size={16} />
                                    Receita
                                </button>
                            </div>
                        </div>

                        {/* Descrição */}
                        <div className={styles.formGroup}>
                            <Input
                                id="description"
                                name="description"
                                label="Descrição"
                                placeholder="Ex: Compra no supermercado"
                                value={formData.description}
                                onChange={(value) => handleInputChange('description', value)}
                                error={errors.description}
                                required
                            />
                        </div>

                        {/* Valor */}
                        <div className={styles.formGroup}>
                            <CurrencyInput
                                id="amount"
                                name="amount"
                                label="Valor"
                                placeholder="0,00"
                                value={formData.amount}
                                onChange={(value) => {
                                    setFormData(prev => ({ ...prev, amount: value }));
                                    if (errors.amount) {
                                        setErrors(prev => ({ ...prev, amount: '' }));
                                    }
                                }}
                                error={errors.amount}
                                required
                            />
                        </div>

                        {/* Categoria */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Categoria *</label>
                            <Select
                                value={formData.categoryId}
                                onChange={(value) => handleInputChange('categoryId', value)}
                                error={errors.categoryId}
                                placeholder="Selecione uma categoria"
                            >
                                {filteredCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* Conta */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Conta *</label>
                            <Select
                                value={formData.accountId}
                                onChange={(value) => handleInputChange('accountId', value)}
                                error={errors.accountId}
                                placeholder="Selecione uma conta"
                            >
                                {accounts.map(account => (
                                    <option key={account.id} value={account.id}>
                                        {account.name} ({account.type?.name || account.type?.category || 'Conta'})
                                    </option>
                                ))}
                            </Select>
                        </div>

                        {/* Data */}
                        <div className={styles.formGroup}>
                            <Input
                                id="date"
                                name="date"
                                label="Data"
                                type="date"
                                value={formData.date}
                                onChange={(value) => handleInputChange('date', value)}
                                error={errors.date}
                                required
                            />
                        </div>

                        {/* Status */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Status</label>
                            <Select
                                value={formData.status}
                                onChange={(value) => handleInputChange('status', value)}
                                placeholder="Selecione o status"
                            >
                                <option value={TransactionStatus.COMPLETED}>Concluída</option>
                                <option value={TransactionStatus.PENDING}>Pendente</option>
                            </Select>
                        </div>

                        {/* Observações */}
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Observações (opcional)</label>
                            <textarea
                                className={styles.textarea}
                                placeholder="Observações adicionais..."
                                value={formData.notes || ''}
                                onChange={(e) => handleInputChange('notes', e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Adicionando...' : 'Adicionar Transação'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
