"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import styles from "./EditCardForm.module.css";

export interface EditCardFormData {
    cardNumber: string;
    cardholderName: string;
    expiryDate: string;
    bankName: string;
    cardType: "visa" | "mastercard" | "amex" | "elo";
    limit: string;
}

interface EditCardFormProps {
    cardData: EditCardFormData;
    onSubmit: (data: EditCardFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const CardTypeIcons = {
    visa: (
        <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
            <rect width="24" height="16" rx="2" fill="#1A1F71" />
            <text x="12" y="11" textAnchor="middle" fill="white" fontSize="5" fontWeight="bold" fontFamily="Arial, sans-serif">VISA</text>
        </svg>
    ),
    mastercard: (
        <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
            <rect width="24" height="16" rx="2" fill="white" />
            <circle cx="9" cy="8" r="3.5" fill="#EB001B" />
            <circle cx="15" cy="8" r="3.5" fill="#F79E1B" />
            <path d="M12 4.5c1.2 0 2.2 0.6 2.8 1.5h-5.6c0.6-0.9 1.6-1.5 2.8-1.5z" fill="#EB001B" />
            <path d="M12 11.5c-1.2 0-2.2-0.6-2.8-1.5h5.6c-0.6 0.9-1.6 1.5-2.8 1.5z" fill="#EB001B" />
        </svg>
    ),
    amex: (
        <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
            <rect width="24" height="16" rx="2" fill="#006FCF" />
            <text x="12" y="10" textAnchor="middle" fill="white" fontSize="4" fontWeight="bold" fontFamily="Arial, sans-serif">AMEX</text>
        </svg>
    ),
    elo: (
        <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
            <rect width="24" height="16" rx="2" fill="#FF6B35" />
            <text x="12" y="10" textAnchor="middle" fill="white" fontSize="4" fontWeight="bold" fontFamily="Arial, sans-serif">ELO</text>
        </svg>
    )
};

const CARD_TYPES = [
    { value: "visa", label: "Visa", icon: CardTypeIcons.visa },
    { value: "mastercard", label: "Mastercard", icon: CardTypeIcons.mastercard },
    { value: "amex", label: "American Express", icon: CardTypeIcons.amex },
    { value: "elo", label: "Elo", icon: CardTypeIcons.elo }
];

const BANKS = [
    "Banco do Brasil",
    "Itaú",
    "Santander",
    "Bradesco",
    "Caixa Econômica Federal",
    "Banco Inter",
    "Nubank",
    "C6 Bank",
    "BTG Pactual",
    "Sicoob"
];

export const EditCardForm: React.FC<EditCardFormProps> = ({
    cardData,
    onSubmit,
    onCancel,
    isLoading = false
}) => {
    const [formData, setFormData] = useState<EditCardFormData>(cardData);
    const [errors, setErrors] = useState<Partial<EditCardFormData>>({});

    useEffect(() => {
        setFormData(cardData);
    }, [cardData]);

    const formatCardNumber = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        return numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const formatExpiryDate = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        if (numbers.length >= 2) {
            return numbers.substring(0, 2) + '/' + numbers.substring(2, 4);
        }
        return numbers;
    };

    const formatCurrency = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        const amount = parseInt(numbers) / 100;
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    };

    const parseCurrency = (value: string) => {
        const numbers = value.replace(/\D/g, '');
        return numbers;
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<EditCardFormData> = {};

        if (!formData.cardNumber || formData.cardNumber.replace(/\D/g, '').length < 16) {
            newErrors.cardNumber = "Número do cartão deve ter 16 dígitos";
        }

        if (!formData.cardholderName || formData.cardholderName.trim().length < 3) {
            newErrors.cardholderName = "Nome do portador deve ter pelo menos 3 caracteres";
        }

        if (!formData.expiryDate || formData.expiryDate.length < 5) {
            newErrors.expiryDate = "Data de validade é obrigatória";
        }

        if (!formData.bankName) {
            newErrors.bankName = "Banco é obrigatório";
        }

        if (!formData.cardType) {
            newErrors.cardType = "Tipo do cartão é obrigatório";
        }

        if (!formData.limit || parseCurrency(formData.limit) === "0") {
            newErrors.limit = "Limite deve ser maior que zero";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(formData);
        } catch (error) {
            console.error("Erro ao editar cartão:", error);
        }
    };

    const handleInputChange = (field: keyof EditCardFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCardNumber(e.target.value);
        handleInputChange("cardNumber", formatted);
    };

    const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatExpiryDate(e.target.value);
        handleInputChange("expiryDate", formatted);
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCurrency(e.target.value);
        handleInputChange("limit", formatted);
    };

    return (
        <div className={styles.editCardForm}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                    {/* Número do Cartão */}
                    <div className={styles.formGroup}>
                        <label htmlFor="cardNumber" className={styles.label}>
                            Número do Cartão *
                        </label>
                        <input
                            type="text"
                            id="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className={`${styles.input} ${errors.cardNumber ? styles.inputError : ''}`}
                            disabled={isLoading}
                        />
                        {errors.cardNumber && (
                            <span className={styles.errorMessage}>{errors.cardNumber}</span>
                        )}
                    </div>

                    {/* Nome do Portador */}
                    <div className={styles.formGroup}>
                        <label htmlFor="cardholderName" className={styles.label}>
                            Nome do Portador *
                        </label>
                        <input
                            type="text"
                            id="cardholderName"
                            value={formData.cardholderName}
                            onChange={(e) => handleInputChange("cardholderName", e.target.value.toUpperCase())}
                            placeholder="NOME COMPLETO"
                            className={`${styles.input} ${errors.cardholderName ? styles.inputError : ''}`}
                            disabled={isLoading}
                        />
                        {errors.cardholderName && (
                            <span className={styles.errorMessage}>{errors.cardholderName}</span>
                        )}
                    </div>

                    {/* Data de Validade */}
                    <div className={styles.formGroup}>
                        <label htmlFor="expiryDate" className={styles.label}>
                            Data de Validade *
                        </label>
                        <input
                            type="text"
                            id="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleExpiryChange}
                            placeholder="MM/AA"
                            maxLength={5}
                            className={`${styles.input} ${errors.expiryDate ? styles.inputError : ''}`}
                            disabled={isLoading}
                        />
                        {errors.expiryDate && (
                            <span className={styles.errorMessage}>{errors.expiryDate}</span>
                        )}
                    </div>

                    {/* Banco */}
                    <div className={styles.formGroup}>
                        <label htmlFor="bankName" className={styles.label}>
                            Banco *
                        </label>
                        <select
                            id="bankName"
                            value={formData.bankName}
                            onChange={(e) => handleInputChange("bankName", e.target.value)}
                            className={`${styles.select} ${errors.bankName ? styles.inputError : ''}`}
                            disabled={isLoading}
                        >
                            <option value="">Selecione o banco</option>
                            {BANKS.map((bank) => (
                                <option key={bank} value={bank}>
                                    {bank}
                                </option>
                            ))}
                        </select>
                        {errors.bankName && (
                            <span className={styles.errorMessage}>{errors.bankName}</span>
                        )}
                    </div>

                    {/* Tipo do Cartão */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Tipo do Cartão *</label>
                        <div className={styles.cardTypeGrid}>
                            {CARD_TYPES.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    className={`${styles.cardTypeButton} ${formData.cardType === type.value ? styles.cardTypeButtonSelected : ''
                                        }`}
                                    onClick={() => handleInputChange("cardType", type.value as any)}
                                    disabled={isLoading}
                                >
                                    <div className={styles.cardTypeIcon}>{type.icon}</div>
                                    <span className={styles.cardTypeLabel}>{type.label}</span>
                                </button>
                            ))}
                        </div>
                        {errors.cardType && (
                            <span className={styles.errorMessage}>{errors.cardType}</span>
                        )}
                    </div>

                    {/* Limite */}
                    <div className={styles.formGroup}>
                        <label htmlFor="limit" className={styles.label}>
                            Limite do Cartão *
                        </label>
                        <input
                            type="text"
                            id="limit"
                            value={formData.limit}
                            onChange={handleLimitChange}
                            placeholder="R$ 0,00"
                            className={`${styles.input} ${errors.limit ? styles.inputError : ''}`}
                            disabled={isLoading}
                        />
                        {errors.limit && (
                            <span className={styles.errorMessage}>{errors.limit}</span>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                    <button
                        type="button"
                        onClick={onCancel}
                        className={styles.cancelButton}
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isLoading}
                    >
                        {isLoading ? "Salvando..." : "Salvar Alterações"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCardForm;
