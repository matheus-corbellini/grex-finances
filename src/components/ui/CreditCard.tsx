"use client";

import React from "react";
import styles from "./CreditCard.module.css";

interface CreditCardProps {
    cardNumber: string;
    cardholderName: string;
    expiryDate: string;
    bankName: string;
    cardType: "visa" | "mastercard" | "amex" | "elo";
    limit: string;
    used: string;
    available: string;
    isActive?: boolean;
    onClick?: () => void;
}

export const CreditCard: React.FC<CreditCardProps> = ({
    cardNumber,
    cardholderName,
    expiryDate,
    bankName,
    cardType,
    limit,
    used,
    available,
    isActive = true,
    onClick
}) => {
    const formatCardNumber = (number: string) => {
        return number.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const getCardTypeIcon = () => {
        switch (cardType) {
            case "visa":
                return (
                    <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                        <rect width="40" height="24" rx="3" fill="#1A1F71" />
                        <path d="M17 8h6v8h-6V8z" fill="white" />
                        <path d="M14 9h2v6h-2V9z" fill="white" />
                        <path d="M24 9h2v6h-2V9z" fill="white" />
                        <text x="20" y="18" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">VISA</text>
                    </svg>
                );
            case "mastercard":
                return (
                    <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                        <rect width="40" height="24" rx="3" fill="#EB001B" />
                        <circle cx="15" cy="12" r="6" fill="#F79E1B" />
                        <circle cx="25" cy="12" r="6" fill="#FF5F00" />
                        <path d="M20 6c2.5 0 4.7 1.3 6 3.2h-12c1.3-1.9 3.5-3.2 6-3.2z" fill="#EB001B" />
                        <path d="M20 18c-2.5 0-4.7-1.3-6-3.2h12c-1.3 1.9-3.5 3.2-6 3.2z" fill="#EB001B" />
                    </svg>
                );
            case "amex":
                return (
                    <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                        <rect width="40" height="24" rx="3" fill="#006FCF" />
                        <text x="20" y="16" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold">AMEX</text>
                        <circle cx="10" cy="12" r="1.5" fill="white" />
                        <circle cx="30" cy="12" r="1.5" fill="white" />
                    </svg>
                );
            case "elo":
                return (
                    <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                        <rect width="40" height="24" rx="3" fill="#FF6B35" />
                        <text x="20" y="16" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">ELO</text>
                        <circle cx="13" cy="12" r="1.5" fill="white" />
                        <circle cx="27" cy="12" r="1.5" fill="white" />
                    </svg>
                );
            default:
                return "💳";
        }
    };

    const getCardTypeColor = () => {
        switch (cardType) {
            case "visa":
                return styles.visa;
            case "mastercard":
                return styles.mastercard;
            case "amex":
                return styles.amex;
            case "elo":
                return styles.elo;
            default:
                return styles.default;
        }
    };

    const getBankLogo = () => {
        switch (bankName.toLowerCase()) {
            case "banco do brasil":
                return (
                    <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                        <rect width="60" height="20" rx="2" fill="white" />
                        <text x="30" y="14" textAnchor="middle" fill="#1A1F71" fontSize="8" fontWeight="bold">BB</text>
                    </svg>
                );
            case "itau":
                return (
                    <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                        <rect width="60" height="20" rx="2" fill="white" />
                        <text x="30" y="14" textAnchor="middle" fill="#FF6900" fontSize="8" fontWeight="bold">ITAU</text>
                    </svg>
                );
            case "santander":
                return (
                    <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                        <rect width="60" height="20" rx="2" fill="white" />
                        <text x="30" y="14" textAnchor="middle" fill="#EC0000" fontSize="7" fontWeight="bold">SANTANDER</text>
                    </svg>
                );
            case "bradesco":
                return (
                    <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                        <rect width="60" height="20" rx="2" fill="white" />
                        <text x="30" y="14" textAnchor="middle" fill="#CC092F" fontSize="7" fontWeight="bold">BRADESCO</text>
                    </svg>
                );
            default:
                return (
                    <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
                        <rect width="60" height="20" rx="2" fill="white" />
                        <text x="30" y="14" textAnchor="middle" fill="#666" fontSize="7" fontWeight="bold">{bankName.toUpperCase()}</text>
                    </svg>
                );
        }
    };

    const getChipIcon = () => {
        return (
            <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                <rect width="24" height="18" rx="2" fill="#D4AF37" />
                <rect x="2" y="2" width="20" height="14" rx="1" fill="#B8860B" />
                <rect x="4" y="4" width="16" height="10" rx="0.5" fill="#D4AF37" />
                <rect x="6" y="6" width="12" height="6" rx="0.5" fill="#B8860B" />
                <rect x="8" y="8" width="8" height="2" fill="#D4AF37" />
                <rect x="8" y="11" width="8" height="1" fill="#D4AF37" />
            </svg>
        );
    };

    const usagePercentage = React.useMemo(() => {
        try {
            const usedValue = parseFloat(used.replace(/[^\d,]/g, '').replace(',', '.'));
            const limitValue = parseFloat(limit.replace(/[^\d,]/g, '').replace(',', '.'));

            if (isNaN(usedValue) || isNaN(limitValue) || limitValue === 0) {
                return 0;
            }

            return (usedValue / limitValue) * 100;
        } catch (error) {
            console.warn('Error calculating usage percentage:', error);
            return 0;
        }
    }, [used, limit]);

    return (
        <div
            className={`${styles.creditCard} ${getCardTypeColor()} ${!isActive ? styles.inactive : ''}`}
            onClick={onClick}
        >
            <div className={styles.cardHeader}>
                <div className={styles.bankInfo}>
                    <div className={styles.bankLogo}>{getBankLogo()}</div>
                    <div className={styles.chipContainer}>{getChipIcon()}</div>
                </div>
                <div className={styles.cardType}>
                    {getCardTypeIcon()}
                </div>
            </div>

            <div className={styles.cardBody}>
                <div className={styles.cardNumber}>
                    {formatCardNumber(cardNumber)}
                </div>
                <div className={styles.cardDetails}>
                    <div className={styles.cardholderName}>
                        {cardholderName}
                    </div>
                    <div className={styles.expiryDate}>
                        {expiryDate}
                    </div>
                </div>
            </div>

            <div className={styles.cardFooter}>
                <div className={styles.limitInfo}>
                    <div className={styles.limitLabel}>Limite</div>
                    <div className={styles.limitValue}>{limit}</div>
                </div>
                <div className={styles.usageInfo}>
                    <div className={styles.usageBar}>
                        <div
                            className={styles.usageProgress}
                            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                        />
                    </div>
                    <div className={styles.usageText}>
                        <span className={styles.usedAmount}>Usado: {used}</span>
                        <span className={styles.availableAmount}>Disponível: {available}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditCard;
