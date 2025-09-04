"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import CreditCard from "../../../components/ui/CreditCard";
import { ClientOnly } from "../../../components/layout/ClientOnly";
import { Modal } from "../../../components/ui/Modal";
import { AddCardForm, CardFormData } from "../../../components/ui/AddCardForm";
import { CardDetailsModal } from "../../../components/ui/CardDetailsModal";
import { EditCardForm, EditCardFormData } from "../../../components/ui/EditCardForm";
import styles from "./Cards.module.css";
import {
  Plus,
  CreditCard as CreditCardIcon,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  MoreVertical,
  Edit,
  Trash2,
  Lock,
  Unlock
} from "lucide-react";

export default function Cards() {
  const router = useRouter();
  const [showLimits, setShowLimits] = useState(true);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isCardDetailsModalOpen, setIsCardDetailsModalOpen] = useState(false);
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false);
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [editingCardData, setEditingCardData] = useState<EditCardFormData | null>(null);

  // Dados ilustrativos dos cartões
  const creditCards = [
    {
      id: 1,
      cardNumber: "4532123456789012",
      cardholderName: "MARIA LÚCIA SILVA",
      expiryDate: "12/28",
      bankName: "Banco do Brasil",
      cardType: "visa" as const,
      limit: "R$ 15.000,00",
      used: "R$ 8.500,00",
      available: "R$ 6.500,00",
      isActive: true,
      lastTransaction: "Supermercado Extra - R$ 150,00",
      nextDueDate: "15/01/2025"
    },
    {
      id: 2,
      cardNumber: "5555123456789012",
      cardholderName: "MARIA LÚCIA SILVA",
      expiryDate: "08/27",
      bankName: "Itaú",
      cardType: "mastercard" as const,
      limit: "R$ 8.000,00",
      used: "R$ 2.300,00",
      available: "R$ 5.700,00",
      isActive: true,
      lastTransaction: "Posto Shell - R$ 85,00",
      nextDueDate: "22/01/2025"
    },
    {
      id: 3,
      cardNumber: "378212345678901",
      cardholderName: "MARIA LÚCIA SILVA",
      expiryDate: "05/26",
      bankName: "Santander",
      cardType: "amex" as const,
      limit: "R$ 25.000,00",
      used: "R$ 12.800,00",
      available: "R$ 12.200,00",
      isActive: true,
      lastTransaction: "Amazon - R$ 320,00",
      nextDueDate: "10/01/2025"
    },
    {
      id: 4,
      cardNumber: "4012123456789012",
      cardholderName: "MARIA LÚCIA SILVA",
      expiryDate: "11/29",
      bankName: "Bradesco",
      cardType: "elo" as const,
      limit: "R$ 5.000,00",
      used: "R$ 4.200,00",
      available: "R$ 800,00",
      isActive: false,
      lastTransaction: "Farmácia Pague Menos - R$ 45,00",
      nextDueDate: "18/01/2025"
    }
  ];

  const totalLimit = useMemo(() => {
    return creditCards.reduce((sum, card) => {
      try {
        const value = parseFloat(card.limit.replace(/[^\d,]/g, '').replace(',', '.'));
        return sum + (isNaN(value) ? 0 : value);
      } catch (error) {
        console.warn('Error parsing limit:', error);
        return sum;
      }
    }, 0);
  }, [creditCards]);

  const totalUsed = useMemo(() => {
    return creditCards.reduce((sum, card) => {
      try {
        const value = parseFloat(card.used.replace(/[^\d,]/g, '').replace(',', '.'));
        return sum + (isNaN(value) ? 0 : value);
      } catch (error) {
        console.warn('Error parsing used amount:', error);
        return sum;
      }
    }, 0);
  }, [creditCards]);

  const totalAvailable = totalLimit - totalUsed;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleCardClick = (cardId: number) => {
    setSelectedCard(cardId);
    setIsCardDetailsModalOpen(true);
  };

  const handleAddCard = () => {
    setIsAddCardModalOpen(true);
  };

  const handleCloseAddCardModal = () => {
    setIsAddCardModalOpen(false);
  };

  const handleCloseCardDetailsModal = () => {
    setIsCardDetailsModalOpen(false);
    setSelectedCard(null);
  };

  const handleCloseEditCardModal = () => {
    setIsEditCardModalOpen(false);
    setEditingCardData(null);
  };

  const handleSubmitNewCard = async (cardData: CardFormData) => {
    setIsAddingCard(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Aqui você faria a chamada para a API
      console.log("Novo cartão adicionado:", cardData);

      // Fechar modal após sucesso
      setIsAddCardModalOpen(false);

      // Aqui você atualizaria a lista de cartões
      // setCreditCards(prev => [...prev, newCard]);

    } catch (error) {
      console.error("Erro ao adicionar cartão:", error);
    } finally {
      setIsAddingCard(false);
    }
  };

  const handleSubmitEditCard = async (cardData: EditCardFormData) => {
    setIsEditingCard(true);

    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Aqui você faria a chamada para a API para atualizar o cartão
      console.log("Editando cartão:", cardData);

      // Simular sucesso
      alert("Cartão editado com sucesso!");

      // Fechar modal
      handleCloseEditCardModal();

    } catch (error) {
      console.error("Erro ao editar cartão:", error);
      alert("Erro ao editar cartão. Tente novamente.");
    } finally {
      setIsEditingCard(false);
    }
  };

  const handleCardAction = (action: string, cardId: number) => {
    if (action === "edit") {
      const card = creditCards.find(c => c.id === cardId);
      if (card) {
        setEditingCardData({
          cardNumber: card.cardNumber,
          cardholderName: card.cardholderName,
          expiryDate: card.expiryDate,
          bankName: card.bankName,
          cardType: card.cardType,
          limit: card.limit
        });
        setIsEditCardModalOpen(true);
        setIsCardDetailsModalOpen(false); // Fechar modal de detalhes
      }
    } else if (action === "extract") {
      // Navegar para a página de extrato do cartão
      router.push(`/dashboard/cards/${cardId}/extract`);
    } else {
      console.log(`${action} cartão ${cardId}`);
    }
  };

  return (
    <DashboardLayout>
      <ClientOnly>
        <div className={styles.cardsContainer}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <h1 className={styles.title}>Cartões de Crédito</h1>
              <p className={styles.subtitle}>Gerencie seus cartões e acompanhe os gastos</p>
            </div>
            <div className={styles.headerRight}>
              <button
                className={styles.toggleButton}
                onClick={() => setShowLimits(!showLimits)}
              >
                {showLimits ? <Eye size={20} /> : <EyeOff size={20} />}
                {showLimits ? "Ocultar" : "Mostrar"} Limites
              </button>
              <button className={styles.addButton} onClick={handleAddCard}>
                <Plus size={20} />
                Adicionar Cartão
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className={styles.summarySection}>
            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon}>
                <CreditCardIcon size={24} />
              </div>
              <div className={styles.summaryContent}>
                <div className={styles.summaryLabel}>Limite Total</div>
                <div className={styles.summaryValue}>
                  {showLimits ? formatCurrency(totalLimit) : "••••••"}
                </div>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon}>
                <TrendingUp size={24} />
              </div>
              <div className={styles.summaryContent}>
                <div className={styles.summaryLabel}>Gasto Total</div>
                <div className={styles.summaryValue}>
                  {showLimits ? formatCurrency(totalUsed) : "••••••"}
                </div>
              </div>
            </div>

            <div className={styles.summaryCard}>
              <div className={styles.summaryIcon}>
                <TrendingDown size={24} />
              </div>
              <div className={styles.summaryContent}>
                <div className={styles.summaryLabel}>Disponível</div>
                <div className={styles.summaryValue}>
                  {showLimits ? formatCurrency(totalAvailable) : "••••••"}
                </div>
              </div>
            </div>
          </div>

          {/* Credit Cards Grid */}
          <div className={styles.cardsGrid}>
            {creditCards.map((card) => (
              <div key={card.id} className={styles.cardWrapper}>
                <CreditCard
                  cardNumber={card.cardNumber}
                  cardholderName={card.cardholderName}
                  expiryDate={card.expiryDate}
                  bankName={card.bankName}
                  cardType={card.cardType}
                  limit={showLimits ? card.limit : "••••••"}
                  used={showLimits ? card.used : "••••••"}
                  available={showLimits ? card.available : "••••••"}
                  isActive={card.isActive}
                  onClick={() => handleCardClick(card.id)}
                />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {creditCards.length === 0 && (
            <div className={styles.emptyState}>
              <CreditCardIcon size={64} className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>Nenhum cartão cadastrado</h3>
              <p className={styles.emptyDescription}>
                Adicione seu primeiro cartão de crédito para começar a acompanhar seus gastos
              </p>
              <button className={styles.addButton} onClick={handleAddCard}>
                <Plus size={20} />
                Adicionar Primeiro Cartão
              </button>
            </div>
          )}
        </div>
      </ClientOnly>

      {/* Modal para Adicionar Cartão */}
      <Modal
        isOpen={isAddCardModalOpen}
        onClose={handleCloseAddCardModal}
        title="Adicionar Novo Cartão"
        size="medium"
      >
        <AddCardForm
          onSubmit={handleSubmitNewCard}
          onCancel={handleCloseAddCardModal}
          isLoading={isAddingCard}
        />
      </Modal>

      {/* Modal para Detalhes do Cartão */}
      {selectedCard && (
        <CardDetailsModal
          isOpen={isCardDetailsModalOpen}
          onClose={handleCloseCardDetailsModal}
          cardData={creditCards.find(card => card.id === selectedCard)!}
          onAction={handleCardAction}
        />
      )}

      {/* Modal para Editar Cartão */}
      {editingCardData && (
        <Modal
          isOpen={isEditCardModalOpen}
          onClose={handleCloseEditCardModal}
          title="Editar Cartão"
          size="medium"
        >
          <EditCardForm
            cardData={editingCardData}
            onSubmit={handleSubmitEditCard}
            onCancel={handleCloseEditCardModal}
            isLoading={isEditingCard}
          />
        </Modal>
      )}
    </DashboardLayout>
  );
}