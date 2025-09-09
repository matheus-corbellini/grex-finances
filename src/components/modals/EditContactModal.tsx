import React, { useState, useEffect } from 'react';
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

interface EditContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    contact: Contact | null;
    onSave: (updatedContact: Contact) => void;
}

export default function EditContactModal({
    isOpen,
    onClose,
    contact,
    onSave
}: EditContactModalProps) {
    const [formData, setFormData] = useState<Contact>({
        id: 0,
        name: '',
        type: 'Fornecedor',
        email: '',
        phone: '',
        status: 'Ativo',
        statusType: 'success'
    });

    useEffect(() => {
        if (contact) {
            setFormData(contact);
        }
    }, [contact]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            statusType: name === 'status' ? (value === 'Ativo' ? 'success' : 'danger') : prev.statusType
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    const handleClose = () => {
        if (contact) {
            setFormData(contact);
        }
        onClose();
    };

    if (!contact) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Editar Contato"
            size="medium"
        >
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                        Nome
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="type" className={styles.label}>
                        Tipo
                    </label>
                    <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className={styles.select}
                        required
                    >
                        <option value="Fornecedor">Fornecedor</option>
                        <option value="Cliente">Cliente</option>
                        <option value="Funcionário">Funcionário</option>
                        <option value="Parceiro">Parceiro</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                        E-mail
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>
                        Telefone
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={styles.input}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="status" className={styles.label}>
                        Situação
                    </label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className={styles.select}
                        required
                    >
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                    </select>
                </div>

                <div className={styles.buttonGroup}>
                    <button
                        type="button"
                        className={`${styles.button} ${styles.secondaryButton}`}
                        onClick={handleClose}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className={`${styles.button} ${styles.primaryButton}`}
                    >
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </Modal>
    );
}
