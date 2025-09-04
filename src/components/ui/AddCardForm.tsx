"use client";

import React, { useState } from "react";
import { CreditCard, Calendar, Building2, User, DollarSign } from "lucide-react";
import styles from "./AddCardForm.module.css";

// Ícones SVG para cada tipo de cartão
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

interface AddCardFormProps {
    onSubmit: (cardData: CardFormData) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export interface CardFormData {
    cardNumber: string;
    cardholderName: string;
    expiryDate: string;
    bankName: string;
    cardType: "visa" | "mastercard" | "amex" | "elo";
    limit: string;
}

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
    "Sicoob",
    "Sicredi",
    "Outro"
];

export const AddCardForm: React.FC<AddCardFormProps> = ({
    onSubmit,
    onCancel,
    isLoading = false
}) => {
    const [formData, setFormData] = useState<CardFormData>({
        cardNumber: "",
        cardholderName: "",
        expiryDate: "",
        bankName: "",
        cardType: "visa",
        limit: ""
    });

    const [errors, setErrors] = useState<Partial<CardFormData>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<CardFormData> = {};

        // Validar número do cartão
        if (!formData.cardNumber) {
            newErrors.cardNumber = "Número do cartão é obrigatório";
        } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ""))) {
            newErrors.cardNumber = "Número do cartão deve ter 16 dígitos";
        }

        // Validar nome do portador
        if (!formData.cardholderName.trim()) {
            newErrors.cardholderName = "Nome do portador é obrigatório";
        } else if (formData.cardholderName.trim().length < 3) {
            newErrors.cardholderName = "Nome deve ter pelo menos 3 caracteres";
        }

        // Validar data de validade
        if (!formData.expiryDate) {
            newErrors.expiryDate = "Data de validade é obrigatória";
        } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
            newErrors.expiryDate = "Formato deve ser MM/AA";
        } else {
            const [month, year] = formData.expiryDate.split("/");
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;

            if (parseInt(month) < 1 || parseInt(month) > 12) {
                newErrors.expiryDate = "Mês inválido";
            } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
                newErrors.expiryDate = "Cartão expirado";
            }
        }

        // Validar banco
        if (!formData.bankName) {
            newErrors.bankName = "Banco é obrigatório";
        }

        // Validar limite
        if (!formData.limit) {
            newErrors.limit = "Limite é obrigatório";
        } else {
            const limitValue = parseFloat(formData.limit.replace(/[^\d,]/g, "").replace(",", "."));
            if (isNaN(limitValue) || limitValue <= 0) {
                newErrors.limit = "Limite deve ser um valor válido";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleInputChange = (field: keyof CardFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Limpar erro do campo quando usuário começar a digitar
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const formatCardNumber = (value: string) => {
        const numbers = value.replace(/\D/g, "");
        return numbers.replace(/(\d{4})(?=\d)/g, "$1 ");
    };

    const formatExpiryDate = (value: string) => {
        const numbers = value.replace(/\D/g, "");
        if (numbers.length >= 2) {
            return numbers.substring(0, 2) + "/" + numbers.substring(2, 4);
        }
        return numbers;
    };

    const formatCurrency = (value: string) => {
        const numbers = value.replace(/\D/g, "");
        const number = parseInt(numbers) / 100;
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(number);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGrid}>
                {/* Número do Cartão */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        <CreditCard size={16} />
                        Número do Cartão
                    </label>
                    <input
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        className={`${styles.input} ${errors.cardNumber ? styles.error : ""}`}
                    />
                    {errors.cardNumber && (
                        <span className={styles.errorMessage}>{errors.cardNumber}</span>
                    )}
                </div>

                {/* Nome do Portador */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        <User size={16} />
                        Nome do Portador
                    </label>
                    <input
                        type="text"
                        value={formData.cardholderName}
                        onChange={(e) => handleInputChange("cardholderName", e.target.value.toUpperCase())}
                        placeholder="MARIA LÚCIA SILVA"
                        className={`${styles.input} ${errors.cardholderName ? styles.error : ""}`}
                    />
                    {errors.cardholderName && (
                        <span className={styles.errorMessage}>{errors.cardholderName}</span>
                    )}
                </div>

                {/* Data de Validade */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        <Calendar size={16} />
                        Data de Validade
                    </label>
                    <input
                        type="text"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))}
                        placeholder="MM/AA"
                        maxLength={5}
                        className={`${styles.input} ${errors.expiryDate ? styles.error : ""}`}
                    />
                    {errors.expiryDate && (
                        <span className={styles.errorMessage}>{errors.expiryDate}</span>
                    )}
                </div>

                {/* Banco */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        <Building2 size={16} />
                        Banco
                    </label>
                    <select
                        value={formData.bankName}
                        onChange={(e) => handleInputChange("bankName", e.target.value)}
                        className={`${styles.select} ${errors.bankName ? styles.error : ""}`}
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
                    <label className={styles.label}>
                        <CreditCard size={16} />
                        Tipo do Cartão
                    </label>
                    <div className={styles.cardTypeGrid}>
                        {CARD_TYPES.map((type) => (
                            <button
                                key={type.value}
                                type="button"
                                onClick={() => handleInputChange("cardType", type.value)}
                                className={`${styles.cardTypeButton} ${formData.cardType === type.value ? styles.selected : ""
                                    }`}
                            >
                                <div className={styles.cardTypeIcon}>{type.icon}</div>
                                <span className={styles.cardTypeLabel}>{type.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Limite */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        <DollarSign size={16} />
                        Limite do Cartão
                    </label>
                    <input
                        type="text"
                        value={formData.limit}
                        onChange={(e) => handleInputChange("limit", formatCurrency(e.target.value))}
                        placeholder="R$ 0,00"
                        className={`${styles.input} ${errors.limit ? styles.error : ""}`}
                    />
                    {errors.limit && (
                        <span className={styles.errorMessage}>{errors.limit}</span>
                    )}
                </div>
            </div>

            {/* Botões */}
            <div className={styles.buttonGroup}>
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
                    {isLoading ? "Adicionando..." : "Adicionar Cartão"}
                </button>
            </div>
        </form>
    );
};

export default AddCardForm;
