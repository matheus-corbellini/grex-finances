"use client";

import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import ViewContactModal from "../../../components/modals/ViewContactModal";
import EditContactModal from "../../../components/modals/EditContactModal";
import styles from "./Contacts.module.css";
import { Search, Plus, ChevronDown } from "lucide-react";

interface Contact {
  id: number;
  name: string;
  type: "Fornecedor" | "Cliente" | "Funcionário" | "Parceiro";
  email: string;
  phone: string;
  status: "Ativo" | "Inativo";
  statusType: "success" | "warning" | "danger";
}

const contactsData: Contact[] = [
  {
    id: 1,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 2,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 3,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 4,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 5,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 6,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 7,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 8,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 9,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 10,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 11,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 12,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 13,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 14,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 15,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 16,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 17,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 18,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 19,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 20,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 21,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 22,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  },
  {
    id: 23,
    name: "Alexandre Cerbo",
    type: "Fornecedor",
    email: "alexandre@cerbo.cc",
    phone: "+55(54)99681-797",
    status: "Ativo",
    statusType: "success"
  }
];

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>(contactsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const toggleRowSelection = (contactId: number) => {
    setSelectedRows(prev =>
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredContacts.map(contact => contact.id));
    }
    setSelectAll(!selectAll);
  };

  const isRowSelected = (contactId: number) => selectedRows.includes(contactId);

  const toggleDropdown = (contactId: number) => {
    setOpenDropdown(openDropdown === contactId ? null : contactId);
  };

  const handleViewOption = (option: string, contactId: number) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;

    setSelectedContact(contact);
    setOpenDropdown(null);

    switch (option) {
      case 'Visualizar':
        setViewModalOpen(true);
        break;
      case 'Editar':
        setEditModalOpen(true);
        break;
      case 'Excluir':
        if (confirm(`Tem certeza que deseja excluir o contato ${contact.name}?`)) {
          setContacts(prev => prev.filter(c => c.id !== contactId));
        }
        break;
      case 'Duplicar':
        const duplicatedContact = {
          ...contact,
          id: Math.max(...contacts.map(c => c.id)) + 1,
          name: `${contact.name} (Cópia)`
        };
        setContacts(prev => [...prev, duplicatedContact]);
        break;
    }
  };

  const handleSaveContact = (updatedContact: Contact) => {
    setContacts(prev =>
      prev.map(contact =>
        contact.id === updatedContact.id ? updatedContact : contact
      )
    );
  };

  const handleCloseModals = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setSelectedContact(null);
  };

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <DashboardLayout>
      <div className={styles.contactsContainer}>
        {/* Controls Bar */}
        <div className={styles.controlsBar}>
          <div className={styles.leftControls}>
            <div className={styles.searchInput}>
              <Search size={20} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Localizar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>
          <div className={styles.rightControls}>
            <span className={styles.contactsCount}>{contacts.length} Contatos</span>
            <button className={styles.addButton}>
              <Plus size={20} />
              Adicionar
            </button>
          </div>
        </div>

        {/* Contacts Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeaderRow}>
                <th className={styles.tableHeader}>Nome</th>
                <th className={styles.tableHeader}>Tipo</th>
                <th className={styles.tableHeader}>E-mail</th>
                <th className={styles.tableHeader}>Telefone</th>
                <th className={styles.tableHeader}>Situação</th>
                <th className={styles.tableHeader}></th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className={`${styles.tableRow} ${isRowSelected(contact.id) ? styles.rowSelected : ''}`}
                >
                  <td className={styles.tableCell}>
                    <span className={styles.contactName}>{contact.name}</span>
                  </td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.typeTag} ${styles.fornecedor}`}>
                      {contact.type}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <span className={styles.email}>{contact.email}</span>
                  </td>
                  <td className={styles.tableCell}>
                    <span className={styles.phone}>{contact.phone}</span>
                  </td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.statusTag} ${styles.ativo}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.dropdownContainer}>
                      <button
                        className={styles.expandButton}
                        onClick={() => toggleDropdown(contact.id)}
                      >
                        <ChevronDown size={16} />
                      </button>
                      {openDropdown === contact.id && (
                        <div className={styles.dropdown}>
                          <button
                            className={styles.dropdownItem}
                            onClick={() => handleViewOption('Visualizar', contact.id)}
                          >
                            Visualizar
                          </button>
                          <button
                            className={styles.dropdownItem}
                            onClick={() => handleViewOption('Editar', contact.id)}
                          >
                            Editar
                          </button>
                          <button
                            className={styles.dropdownItem}
                            onClick={() => handleViewOption('Excluir', contact.id)}
                          >
                            Excluir
                          </button>
                          <button
                            className={styles.dropdownItem}
                            onClick={() => handleViewOption('Duplicar', contact.id)}
                          >
                            Duplicar
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modais */}
      <ViewContactModal
        isOpen={viewModalOpen}
        onClose={handleCloseModals}
        contact={selectedContact}
      />

      <EditContactModal
        isOpen={editModalOpen}
        onClose={handleCloseModals}
        contact={selectedContact}
        onSave={handleSaveContact}
      />
    </DashboardLayout>
  );
}