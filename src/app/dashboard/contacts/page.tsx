"use client";

import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import styles from "./Contacts.module.css";
import { Search, Filter, Plus, ChevronRight, User, Mail, Phone, CheckCircle, ChevronUp, ChevronDown, Eye, Edit, Trash2, ChevronDown as ChevronDownIcon } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "Fornecedor" | "Cliente" | "Funcionário" | "Parceiro";
  status: "Ativo" | "Inativo";
  company?: string;
  position?: string;
  observations?: string;
  isExpanded?: boolean;
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao.silva@empresa.com",
    phone: "(11) 99999-9999",
    type: "Cliente",
    status: "Ativo",
    company: "Tech Solutions",
    position: "CEO",
    observations: "Cliente importante, sempre pontual nos pagamentos",
    isExpanded: true
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria.santos@fornecedor.com",
    phone: "(11) 88888-8888",
    type: "Fornecedor",
    status: "Ativo",
    company: "Supply Corp",
    position: "Gerente",
    observations: "Fornecedor confiável para materiais de escritório"
  },
  {
    id: "3",
    name: "Pedro Costa",
    email: "pedro.costa@empresa.com",
    phone: "(11) 77777-7777",
    type: "Funcionário",
    status: "Ativo",
    company: "Nossa Empresa",
    position: "Desenvolvedor",
    observations: "Funcionário dedicado e proativo"
  },
  {
    id: "4",
    name: "Ana Oliveira",
    email: "ana.oliveira@parceiro.com",
    phone: "(11) 66666-6666",
    type: "Parceiro",
    status: "Ativo",
    company: "Partner Solutions",
    position: "Diretora",
    observations: "Parceira estratégica para expansão de negócios"
  }
];

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>(mockContacts);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newContact, setNewContact] = useState({
    type: "Física",
    cpf: "",
    email: "",
    phone: "",
    isDizimista: false
  });

  const toggleExpanded = (contactId: string) => {
    setContacts(prev =>
      prev.map(contact =>
        contact.id === contactId
          ? { ...contact, isExpanded: !contact.isExpanded }
          : { ...contact, isExpanded: false }
      )
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  const handleSaveContact = () => {
    // Aqui você implementaria a lógica para salvar o contato
    console.log("Salvando contato:", newContact);
    setShowModal(false);
    setNewContact({
      type: "Física",
      cpf: "",
      email: "",
      phone: "",
      isDizimista: false
    });
  };

  return (
    <DashboardLayout>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Contatos</h1>
            <button
              className={styles.addButton}
              onClick={() => setShowModal(true)}
            >
              <Plus size={20} />
              Novo Contato
            </button>
          </div>
          <span className={styles.subtitle}>{contacts.length} Contatos</span>
        </div>

        {/* Search and Filter Bar */}
        <div className={styles.searchBar}>
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
          <button className={styles.filterButton}>
            <Filter size={20} />
            Filtrar
          </button>
        </div>

        {/* Contacts Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tableHeader}>
                <th>Nome</th>
                <th>
                  <div className={styles.sortableHeader}>
                    Tipo
                    <div className={styles.sortIcons}>
                      <ChevronUp size={12} />
                      <ChevronDown size={12} />
                    </div>
                  </div>
                </th>
                <th>
                  <div className={styles.sortableHeader}>
                    E-mail
                    <div className={styles.sortIcons}>
                      <ChevronUp size={12} />
                      <ChevronDown size={12} />
                    </div>
                  </div>
                </th>
                <th>Telefone</th>
                <th>
                  <div className={styles.sortableHeader}>
                    Situação
                    <div className={styles.sortIcons}>
                      <ChevronUp size={12} />
                      <ChevronDown size={12} />
                    </div>
                  </div>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((contact) => (
                <React.Fragment key={contact.id}>
                  <tr
                    className={`${styles.tableRow} ${contact.isExpanded ? styles.expandedRow : ''}`}
                    onClick={() => toggleExpanded(contact.id)}
                  >
                    <td className={styles.nameCell}>
                      <div className={styles.nameContainer}>
                        <div className={styles.avatar}>
                          {getInitials(contact.name)}
                        </div>
                        <div className={styles.nameInfo}>
                          <span className={styles.name}>{contact.name}</span>
                          <span className={`${styles.typeTag} ${styles[contact.type.toLowerCase()]}`}>
                            {contact.type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.typeTag} ${styles[contact.type.toLowerCase()]}`}>
                        {contact.type}
                      </span>
                    </td>
                    <td className={styles.emailCell}>{contact.email}</td>
                    <td className={styles.phoneCell}>{contact.phone}</td>
                    <td>
                      <span className={`${styles.statusTag} ${styles[contact.status.toLowerCase()]}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td>
                      <button className={styles.expandButton}>
                        {contact.isExpanded ? <ChevronUp size={16} /> : <ChevronDownIcon size={16} />}
                      </button>
                    </td>
                  </tr>
                  {contact.isExpanded && (
                    <tr className={styles.expandedDetailsRow}>
                      <td colSpan={6} className={styles.expandedCell}>
                        <div className={styles.expandedContent}>
                          <div className={styles.contactInfo}>
                            <h3 className={styles.sectionTitle}>Informações de Contato</h3>
                            <div className={styles.infoCards}>
                              <div className={styles.infoCard}>
                                <span className={styles.infoLabel}>E-MAIL:</span>
                                <span className={styles.infoValue}>{contact.email}</span>
                              </div>
                              <div className={styles.infoCard}>
                                <span className={styles.infoLabel}>TELEFONE:</span>
                                <span className={styles.infoValue}>{contact.phone}</span>
                              </div>
                              <div className={styles.infoCard}>
                                <span className={styles.infoLabel}>EMPRESA:</span>
                                <span className={styles.infoValue}>{contact.company || 'N/A'}</span>
                              </div>
                              <div className={styles.infoCard}>
                                <span className={styles.infoLabel}>CARGO:</span>
                                <span className={styles.infoValue}>{contact.position || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                          <div className={styles.observations}>
                            <h3 className={styles.sectionTitle}>Observações</h3>
                            <div className={styles.observationsContent}>
                              {contact.observations || 'Nenhuma observação cadastrada.'}
                            </div>
                          </div>
                          <div className={styles.actionButtons}>
                            <button className={styles.actionButton}>
                              <Eye size={16} />
                              Ver Detalhes
                            </button>
                            <button className={styles.actionButton}>
                              <Edit size={16} />
                              Editar
                            </button>
                            <button className={styles.actionButton}>
                              <Trash2 size={16} />
                              Excluir
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h2 className={styles.modalTitle}>Nova pessoa</h2>

              <div className={styles.formGroup}>
                <label className={styles.label}>Tipo da pessoa</label>
                <select
                  className={styles.select}
                  value={newContact.type}
                  onChange={(e) => setNewContact({ ...newContact, type: e.target.value })}
                >
                  <option value="Física">Física</option>
                  <option value="Jurídica">Jurídica</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>CPF</label>
                <input
                  type="text"
                  placeholder="00.000.000-00"
                  className={styles.input}
                  value={newContact.cpf}
                  onChange={(e) => setNewContact({ ...newContact, cpf: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>E-mail</label>
                <input
                  type="email"
                  placeholder="E-mail"
                  className={styles.input}
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Telefone</label>
                <input
                  type="tel"
                  placeholder="Telefone"
                  className={styles.input}
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                />
              </div>

              <div className={styles.toggleGroup}>
                <label className={styles.toggleLabel}>Dizimista</label>
                <div
                  className={`${styles.toggle} ${newContact.isDizimista ? styles.toggleActive : ''}`}
                  onClick={() => setNewContact({ ...newContact, isDizimista: !newContact.isDizimista })}
                >
                  <div className={styles.toggleSlider}></div>
                </div>
              </div>

              <button
                className={styles.saveButton}
                onClick={handleSaveContact}
              >
                Salvar
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}