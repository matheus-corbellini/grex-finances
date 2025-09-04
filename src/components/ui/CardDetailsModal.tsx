"use client";

import React from "react";
import { Modal } from "./Modal";
import { Edit, Lock, Unlock, Trash2, X, FileText } from "lucide-react";
import styles from "./CardDetailsModal.module.css";

interface CardDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    cardData: {
        id: number;
        cardNumber: string;
        cardholderName: string;
        expiryDate: string;
        bankName: string;
        cardType: "visa" | "mastercard" | "amex" | "elo";
        limit: string;
        used: string;
        available: string;
        isActive: boolean;
        lastTransaction: string;
        nextDueDate: string;
    };
    onAction: (action: string, cardId: number) => void;
}

export const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
    isOpen,
    onClose,
    cardData,
    onAction
}) => {
    const handleAction = (action: string) => {
        onAction(action, cardData.id);
        onClose();
    };

    const formatCardNumber = (number: string) => {
        return number.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const getCardTypeColor = () => {
        switch (cardData.cardType) {
            case "visa":
                return "#1A1F71";
            case "mastercard":
                return "#EB001B";
            case "amex":
                return "#006FCF";
            case "elo":
                return "#FF6B35";
            default:
                return "#667eea";
        }
    };

    const getCardTypeIcon = () => {
        switch (cardData.cardType) {
            case "visa":
                return (
                    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                        <rect width="32" height="20" rx="2" fill="#1A1F71" />
                        <path d="M14 6h4v8h-4V6z" fill="white" />
                        <path d="M12 7h1v6h-1V7z" fill="white" />
                        <path d="M19 7h1v6h-1V7z" fill="white" />
                        <text x="16" y="15" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">VISA</text>
                    </svg>
                );
            case "mastercard":
                return (
                    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                        <rect width="32" height="20" rx="2" fill="#EB001B" />
                        <circle cx="12" cy="10" r="5" fill="#F79E1B" />
                        <circle cx="20" cy="10" r="5" fill="#FF5F00" />
                        <path d="M16 5c2 0 3.8 1 4.8 2.5h-9.6c1-1.5 2.8-2.5 4.8-2.5z" fill="#EB001B" />
                        <path d="M16 15c-2 0-3.8-1-4.8-2.5h9.6c-1 1.5-2.8 2.5-4.8 2.5z" fill="#EB001B" />
                    </svg>
                );
            case "amex":
                return (
                    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                        <rect width="32" height="20" rx="2" fill="#006FCF" />
                        <text x="16" y="13" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">AMEX</text>
                        <circle cx="8" cy="10" r="1" fill="white" />
                        <circle cx="24" cy="10" r="1" fill="white" />
                    </svg>
                );
            case "elo":
                return (
                    <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                        <rect width="32" height="20" rx="2" fill="#FF6B35" />
                        <text x="16" y="13" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">ELO</text>
                        <circle cx="11" cy="10" r="1" fill="white" />
                        <circle cx="21" cy="10" r="1" fill="white" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const getBankLogo = () => {
        switch (cardData.bankName.toLowerCase()) {
            case "banco do brasil":
                return "BB";
            case "itau":
                return "ITAU";
            case "santander":
                return "SANTANDER";
            case "bradesco":
                return "BRADESCO";
            default:
                return cardData.bankName.toUpperCase();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detalhes do Cartão"
            size="medium"
        >
            <div className={styles.cardDetailsContainer}>
                {/* Card Preview */}
                <div
                    className={styles.cardPreview}
                    style={{ backgroundColor: getCardTypeColor() }}
                >
                    <div className={styles.cardHeader}>
                        <div className={styles.bankInfo}>
                            <div className={styles.bankLogo}>{getBankLogo()}</div>
                        </div>
                        <div className={styles.cardType}>
                            {getCardTypeIcon()}
                        </div>
                    </div>

                    <div className={styles.cardBody}>
                        <div className={styles.cardNumber}>
                            {formatCardNumber(cardData.cardNumber)}
                        </div>
                        <div className={styles.cardDetails}>
                            <div className={styles.cardholderName}>
                                {cardData.cardholderName}
                            </div>
                            <div className={styles.expiryDate}>
                                {cardData.expiryDate}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Information */}
                <div className={styles.cardInfo}>
                    <div className={styles.infoSection}>
                        <h3 className={styles.sectionTitle}>Informações do Cartão</h3>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Banco:</span>
                                <span className={styles.infoValue}>{cardData.bankName}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Tipo:</span>
                                <span className={styles.infoValue}>{cardData.cardType.toUpperCase()}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Status:</span>
                                <span className={`${styles.infoValue} ${styles.status} ${cardData.isActive ? styles.active : styles.inactive}`}>
                                    {cardData.isActive ? "Ativo" : "Bloqueado"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.infoSection}>
                        <h3 className={styles.sectionTitle}>Limites e Uso</h3>
                        <div className={styles.limitsGrid}>
                            <div className={styles.limitItem}>
                                <span className={styles.limitLabel}>Limite Total</span>
                                <span className={styles.limitValue}>{cardData.limit}</span>
                            </div>
                            <div className={styles.limitItem}>
                                <span className={styles.limitLabel}>Valor Usado</span>
                                <span className={styles.usedValue}>{cardData.used}</span>
                            </div>
                            <div className={styles.limitItem}>
                                <span className={styles.limitLabel}>Disponível</span>
                                <span className={styles.availableValue}>{cardData.available}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.infoSection}>
                        <h3 className={styles.sectionTitle}>Informações Adicionais</h3>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Última Transação:</span>
                                <span className={styles.infoValue}>{cardData.lastTransaction}</span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Próximo Vencimento:</span>
                                <span className={styles.infoValue}>{cardData.nextDueDate}</span>
                            </div>
                        </div>
                        <div className={styles.extractButtonContainer}>
                            <button
                                className={styles.extractButton}
                                onClick={() => handleAction("extract")}
                            >
                                <FileText size={16} />
                                Ver Extrato Completo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                    <button
                        className={styles.actionButton}
                        onClick={() => handleAction("edit")}
                    >
                        <Edit size={16} />
                        Editar
                    </button>
                    <button
                        className={styles.actionButton}
                        onClick={() => handleAction(cardData.isActive ? "block" : "unblock")}
                    >
                        {cardData.isActive ? <Lock size={16} /> : <Unlock size={16} />}
                        {cardData.isActive ? "Bloquear" : "Desbloquear"}
                    </button>
                    <button
                        className={`${styles.actionButton} ${styles.danger}`}
                        onClick={() => handleAction("delete")}
                    >
                        <Trash2 size={16} />
                        Excluir
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CardDetailsModal;
