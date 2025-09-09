import React from 'react';
import Modal from '../ui/Modal';
import styles from '../ui/Modal.module.css';

interface Contact {
  id: number;
  name: string;
  type: "Fornecedor" | "Cliente" | "Funcionário" | "Parceiro";
  email: string;
  phone: string;
  status: "Ativo" | "Inativo";
  statusType: "success" | "warning" | "danger";
}

interface ViewContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
}

export default function ViewContactModal({ isOpen, onClose, contact }: ViewContactModalProps) {
  if (!contact) return null;

  const getTypeClass = (type: string) => {
    switch (type) {
      case 'Fornecedor':
        return styles.typeFornecedor;
      case 'Cliente':
        return styles.typeCliente;
      case 'Funcionário':
        return styles.typeFuncionario;
      case 'Parceiro':
        return styles.typeParceiro;
      default:
        return '';
    }
  };

  const getStatusClass = (status: string) => {
    return status === 'Ativo' ? styles.statusActive : styles.statusInactive;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Visualizar Contato"
      size="medium"
    >
      <div className={styles.viewContent}>
        <div className={styles.viewField}>
          <span className={styles.viewLabel}>Nome</span>
          <span className={styles.viewValue}>{contact.name}</span>
        </div>

        <div className={styles.viewField}>
          <span className={styles.viewLabel}>Tipo</span>
          <span className={`${styles.typeTag} ${getTypeClass(contact.type)}`}>
            {contact.type.toUpperCase()}
          </span>
        </div>

        <div className={styles.viewField}>
          <span className={styles.viewLabel}>E-mail</span>
          <span className={styles.viewValue}>{contact.email}</span>
        </div>

        <div className={styles.viewField}>
          <span className={styles.viewLabel}>Telefone</span>
          <span className={styles.viewValue}>{contact.phone}</span>
        </div>

        <div className={styles.viewField}>
          <span className={styles.viewLabel}>Situação</span>
          <span className={`${styles.statusTag} ${getStatusClass(contact.status)}`}>
            {contact.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${styles.secondaryButton}`}
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </Modal>
  );
}
