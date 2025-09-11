"use client";

import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { ClientOnly } from "../../../components/layout/ClientOnly";
import {
    Plus,
    Search,
    Filter,
    MessageSquare,
    Clock,
    CheckCircle,
    AlertCircle,
    XCircle,
    Eye,
    Reply,
    Calendar,
    User,
    Tag,
    ChevronDown,
    ChevronUp,
    HelpCircle,
    MessageCircle,
    Phone,
    Mail,
    BookOpen,
    ChevronRight,
    ExternalLink,
    ThumbsUp,
    ThumbsDown,
    CreditCard,
    FileText
} from "lucide-react";
import styles from "./Support.module.css";

interface Ticket {
    id: string;
    title: string;
    description: string;
    status: "open" | "in_progress" | "resolved" | "closed";
    priority: "low" | "medium" | "high" | "urgent";
    category: string;
    createdAt: string;
    updatedAt: string;
    assignedTo?: string;
    messages: TicketMessage[];
}

interface TicketMessage {
    id: string;
    content: string;
    sender: "user" | "support";
    timestamp: string;
    attachments?: string[];
}

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
    helpful: number;
    notHelpful: number;
    tags: string[];
}

interface FAQCategory {
    id: string;
    name: string;
    icon: any;
    description: string;
    count: number;
}

const SupportPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<"faq" | "tickets" | "create">("faq");
    const [ticketSubTab, setTicketSubTab] = useState<"open" | "closed">("open");
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [priorityFilter, setPriorityFilter] = useState<string>("all");
    const [showFilters, setShowFilters] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [faqSearchTerm, setFaqSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

    // Dados das categorias de FAQ
    const [faqCategories] = useState<FAQCategory[]>([
        {
            id: "getting-started",
            name: "Primeiros Passos",
            icon: BookOpen,
            description: "Como começar a usar o sistema",
            count: 8
        },
        {
            id: "accounts",
            name: "Contas e Carteiras",
            icon: CreditCard,
            description: "Gerenciamento de contas bancárias",
            count: 12
        },
        {
            id: "transactions",
            name: "Lançamentos",
            icon: MessageSquare,
            description: "Como registrar receitas e despesas",
            count: 15
        },
        {
            id: "reports",
            name: "Relatórios",
            icon: FileText,
            description: "Geração e visualização de relatórios",
            count: 10
        },
        {
            id: "sync",
            name: "Sincronização",
            icon: Clock,
            description: "Problemas de sincronização de dados",
            count: 6
        },
        {
            id: "billing",
            name: "Cobrança e Planos",
            icon: Tag,
            description: "Planos, pagamentos e cobrança",
            count: 7
        }
    ]);

    // Dados das perguntas frequentes
    const [faqItems] = useState<FAQItem[]>([
        {
            id: "1",
            question: "Como criar minha primeira conta bancária?",
            answer: "Para criar sua primeira conta bancária, vá em 'Contas e Carteiras' no menu lateral, clique em 'Adicionar Conta' e preencha os dados da sua conta. Você pode adicionar contas correntes, poupanças, cartões de crédito e carteiras digitais.",
            category: "getting-started",
            helpful: 45,
            notHelpful: 2,
            tags: ["conta", "bancária", "primeiros passos"]
        },
        {
            id: "2",
            question: "Como registrar uma receita?",
            answer: "Para registrar uma receita, vá em 'Lançamentos' e clique em 'Nova Receita'. Preencha o valor, descrição, categoria e data. Você pode também anexar comprovantes e definir se a receita é recorrente.",
            category: "transactions",
            helpful: 38,
            notHelpful: 1,
            tags: ["receita", "lançamento", "dinheiro"]
        },
        {
            id: "3",
            question: "Como gerar um relatório de fluxo de caixa?",
            answer: "Para gerar um relatório de fluxo de caixa, vá em 'Relatórios' > 'Fluxo de Caixa'. Selecione o período desejado e clique em 'Gerar Relatório'. Você pode exportar em PDF ou Excel.",
            category: "reports",
            helpful: 52,
            notHelpful: 3,
            tags: ["relatório", "fluxo", "caixa"]
        },
        {
            id: "4",
            question: "Meus dados não estão sincronizando entre dispositivos",
            answer: "Verifique se você está logado com a mesma conta em todos os dispositivos. Se o problema persistir, tente fazer logout e login novamente. Certifique-se de que tem uma conexão estável com a internet.",
            category: "sync",
            helpful: 29,
            notHelpful: 5,
            tags: ["sincronização", "dispositivos", "dados"]
        },
        {
            id: "5",
            question: "Como alterar meu plano de assinatura?",
            answer: "Para alterar seu plano, vá em 'Configurações' > 'Meu plano' e clique em 'Fazer upgrade' ou 'Alterar plano'. Você pode visualizar os planos disponíveis e fazer a alteração a qualquer momento.",
            category: "billing",
            helpful: 33,
            notHelpful: 2,
            tags: ["plano", "assinatura", "cobrança"]
        },
        {
            id: "6",
            question: "Como adicionar um cartão de crédito?",
            answer: "Vá em 'Cartões de Crédito' no menu lateral e clique em 'Adicionar Cartão'. Preencha os dados do cartão incluindo número, nome do portador, validade e CVV. O sistema validará os dados automaticamente.",
            category: "accounts",
            helpful: 41,
            notHelpful: 1,
            tags: ["cartão", "crédito", "conta"]
        },
        {
            id: "7",
            question: "Como configurar categorias personalizadas?",
            answer: "Vá em 'Configurações' > 'Categorias' para gerenciar suas categorias. Você pode criar, editar e excluir categorias de receitas e despesas. As categorias ajudam na organização e geração de relatórios.",
            category: "getting-started",
            helpful: 27,
            notHelpful: 1,
            tags: ["categorias", "personalizadas", "configuração"]
        },
        {
            id: "8",
            question: "Como fazer backup dos meus dados?",
            answer: "O sistema faz backup automático dos seus dados na nuvem. Para backup manual, vá em 'Configurações' > 'Backup' e clique em 'Fazer Backup'. Você pode também exportar seus dados em Excel.",
            category: "sync",
            helpful: 35,
            notHelpful: 2,
            tags: ["backup", "dados", "exportar"]
        }
    ]);

    // Mock data - em produção viria de uma API
    const [tickets, setTickets] = useState<Ticket[]>([
        {
            id: "TKT-001",
            title: "Problema com sincronização de dados",
            description: "Os dados não estão sincronizando corretamente entre dispositivos",
            status: "in_progress",
            priority: "high",
            category: "Sincronização",
            createdAt: "2024-01-15T10:30:00Z",
            updatedAt: "2024-01-15T14:20:00Z",
            assignedTo: "Suporte Técnico",
            messages: [
                {
                    id: "1",
                    content: "Olá! Estou enfrentando problemas com a sincronização dos meus dados. Alguns lançamentos não aparecem no meu celular.",
                    sender: "user",
                    timestamp: "2024-01-15T10:30:00Z"
                },
                {
                    id: "2",
                    content: "Olá! Obrigado por entrar em contato. Vou verificar o problema de sincronização para você. Pode me informar qual dispositivo está apresentando o problema?",
                    sender: "support",
                    timestamp: "2024-01-15T11:15:00Z"
                }
            ]
        },
        {
            id: "TKT-002",
            title: "Dúvida sobre relatórios",
            description: "Como gerar relatório de fluxo de caixa",
            status: "resolved",
            priority: "medium",
            category: "Relatórios",
            createdAt: "2024-01-14T09:15:00Z",
            updatedAt: "2024-01-14T16:45:00Z",
            assignedTo: "Suporte Comercial",
            messages: [
                {
                    id: "3",
                    content: "Preciso de ajuda para gerar um relatório de fluxo de caixa. Não consigo encontrar essa opção.",
                    sender: "user",
                    timestamp: "2024-01-14T09:15:00Z"
                },
                {
                    id: "4",
                    content: "Para gerar o relatório de fluxo de caixa, vá em Relatórios > Fluxo de Caixa. Lá você pode selecionar o período desejado e exportar em PDF ou Excel.",
                    sender: "support",
                    timestamp: "2024-01-14T10:30:00Z"
                },
                {
                    id: "5",
                    content: "Perfeito! Consegui gerar o relatório. Obrigado pela ajuda!",
                    sender: "user",
                    timestamp: "2024-01-14T16:45:00Z"
                }
            ]
        },
        {
            id: "TKT-003",
            title: "Erro ao fazer backup",
            description: "Sistema apresenta erro ao tentar fazer backup dos dados",
            status: "open",
            priority: "urgent",
            category: "Backup",
            createdAt: "2024-01-16T08:20:00Z",
            updatedAt: "2024-01-16T08:20:00Z",
            messages: [
                {
                    id: "6",
                    content: "Estou tentando fazer backup dos meus dados mas o sistema apresenta erro. É muito importante que eu consiga fazer esse backup.",
                    sender: "user",
                    timestamp: "2024-01-16T08:20:00Z"
                }
            ]
        }
    ]);

    const [newTicket, setNewTicket] = useState({
        title: "",
        description: "",
        category: "",
        priority: "medium" as const
    });

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "open":
                return <AlertCircle size={16} className={styles.statusOpen} />;
            case "in_progress":
                return <Clock size={16} className={styles.statusInProgress} />;
            case "resolved":
                return <CheckCircle size={16} className={styles.statusResolved} />;
            case "closed":
                return <XCircle size={16} className={styles.statusClosed} />;
            default:
                return <AlertCircle size={16} />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "open":
                return "Aberto";
            case "in_progress":
                return "Em Andamento";
            case "resolved":
                return "Resolvido";
            case "closed":
                return "Fechado";
            default:
                return status;
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "low":
                return "#10b981";
            case "medium":
                return "#f59e0b";
            case "high":
                return "#ef4444";
            case "urgent":
                return "#dc2626";
            default:
                return "#6b7280";
        }
    };

    const getPriorityText = (priority: string) => {
        switch (priority) {
            case "low":
                return "Baixa";
            case "medium":
                return "Média";
            case "high":
                return "Alta";
            case "urgent":
                return "Urgente";
            default:
                return priority;
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
        const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;

        // Filtrar por sub-tab (abertos vs fechados)
        const isOpenTicket = ticket.status === "open" || ticket.status === "in_progress";
        const matchesSubTab = ticketSubTab === "open" ? isOpenTicket : !isOpenTicket;

        return matchesSearch && matchesStatus && matchesPriority && matchesSubTab;
    });

    const filteredFAQItems = faqItems.filter(item => {
        const matchesSearch = item.question.toLowerCase().includes(faqSearchTerm.toLowerCase()) ||
            item.answer.toLowerCase().includes(faqSearchTerm.toLowerCase()) ||
            item.tags.some(tag => tag.toLowerCase().includes(faqSearchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    const handleFAQFeedback = (faqId: string, type: 'helpful' | 'notHelpful') => {
        // Em produção, isso seria enviado para a API
        console.log(`FAQ ${faqId} - ${type}`);
    };

    const handleCreateTicket = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTicket.title || !newTicket.description || !newTicket.category) return;

        const ticket: Ticket = {
            id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
            title: newTicket.title,
            description: newTicket.description,
            status: "open",
            priority: newTicket.priority,
            category: newTicket.category,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [{
                id: "1",
                content: newTicket.description,
                sender: "user",
                timestamp: new Date().toISOString()
            }]
        };

        setTickets([ticket, ...tickets]);
        setNewTicket({ title: "", description: "", category: "", priority: "medium" });
        setActiveTab("tickets");
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedTicket) return;

        const message: TicketMessage = {
            id: String(selectedTicket.messages.length + 1),
            content: newMessage,
            sender: "user",
            timestamp: new Date().toISOString()
        };

        const updatedTickets = tickets.map(ticket =>
            ticket.id === selectedTicket.id
                ? { ...ticket, messages: [...ticket.messages, message], updatedAt: new Date().toISOString() }
                : ticket
        );

        setTickets(updatedTickets);
        setSelectedTicket({ ...selectedTicket, messages: [...selectedTicket.messages, message] });
        setNewMessage("");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (selectedTicket) {
        return (
            <div className={styles.ticketDetailContainer}>
                <div className={styles.ticketHeader}>
                    <button
                        onClick={() => setSelectedTicket(null)}
                        className={styles.backButton}
                    >
                        ← Voltar
                    </button>
                    <div className={styles.ticketInfo}>
                        <h1 className={styles.ticketTitle}>{selectedTicket.title}</h1>
                        <div className={styles.ticketMeta}>
                            <span className={styles.ticketId}>#{selectedTicket.id}</span>
                            <div className={styles.statusBadge}>
                                {getStatusIcon(selectedTicket.status)}
                                {getStatusText(selectedTicket.status)}
                            </div>
                            <div
                                className={styles.priorityBadge}
                                style={{ backgroundColor: getPriorityColor(selectedTicket.priority) }}
                            >
                                {getPriorityText(selectedTicket.priority)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.ticketContent}>
                    <div className={styles.messagesContainer}>
                        {selectedTicket.messages.map((message) => (
                            <div
                                key={message.id}
                                className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.supportMessage}`}
                            >
                                <div className={styles.messageHeader}>
                                    <span className={styles.messageSender}>
                                        {message.sender === 'user' ? 'Você' : 'Suporte'}
                                    </span>
                                    <span className={styles.messageTime}>
                                        {formatDate(message.timestamp)}
                                    </span>
                                </div>
                                <div className={styles.messageContent}>
                                    {message.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.messageInput}>
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Digite sua mensagem..."
                            className={styles.messageTextarea}
                            rows={3}
                        />
                        <button
                            onClick={handleSendMessage}
                            className={styles.sendButton}
                            disabled={!newMessage.trim()}
                        >
                            <Reply size={16} />
                            Enviar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <DashboardLayout>
            <ClientOnly>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div>
                            <h1 className={styles.title}>Central de Ajuda</h1>
                            <p className={styles.subtitle}>Encontre respostas rápidas ou abra um ticket de suporte</p>
                        </div>
                        <div className={styles.headerActions}>
                            <button
                                onClick={() => setActiveTab("create")}
                                className={styles.createButton}
                            >
                                <Plus size={20} />
                                Novo Ticket
                            </button>
                        </div>
                    </div>

                    {/* Tabs de navegação */}
                    <div className={styles.tabsContainer}>
                        <button
                            onClick={() => setActiveTab("faq")}
                            className={`${styles.tab} ${activeTab === "faq" ? styles.activeTab : ""}`}
                        >
                            <HelpCircle size={16} />
                            Perguntas Frequentes
                        </button>
                        <button
                            onClick={() => setActiveTab("tickets")}
                            className={`${styles.tab} ${activeTab === "tickets" ? styles.activeTab : ""}`}
                        >
                            <MessageSquare size={16} />
                            Meus Tickets
                        </button>
                    </div>

                    {/* Seção de FAQ */}
                    {activeTab === "faq" && (
                        <>
                            {/* Busca e filtros para FAQ */}
                            <div className={styles.faqSearchContainer}>
                                <div className={styles.searchContainer}>
                                    <Search size={20} className={styles.searchIcon} />
                                    <input
                                        type="text"
                                        placeholder="Buscar nas perguntas frequentes..."
                                        value={faqSearchTerm}
                                        onChange={(e) => setFaqSearchTerm(e.target.value)}
                                        className={styles.searchInput}
                                    />
                                </div>

                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className={styles.categorySelect}
                                >
                                    <option value="all">Todas as categorias</option>
                                    {faqCategories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name} ({category.count})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Categorias de FAQ */}
                            <div className={styles.categoriesGrid}>
                                {faqCategories.map(category => (
                                    <div
                                        key={category.id}
                                        className={`${styles.categoryCard} ${selectedCategory === category.id ? styles.selectedCategory : ""}`}
                                        onClick={() => setSelectedCategory(selectedCategory === category.id ? "all" : category.id)}
                                    >
                                        <category.icon size={24} className={styles.categoryIcon} />
                                        <h3 className={styles.categoryName}>{category.name}</h3>
                                        <p className={styles.categoryDescription}>{category.description}</p>
                                        <span className={styles.categoryCount}>{category.count} perguntas</span>
                                    </div>
                                ))}
                            </div>

                            {/* Lista de perguntas frequentes */}
                            <div className={styles.faqList}>
                                {filteredFAQItems.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <HelpCircle size={48} className={styles.emptyIcon} />
                                        <h3>Nenhuma pergunta encontrada</h3>
                                        <p>Não há perguntas que correspondam aos filtros selecionados.</p>
                                    </div>
                                ) : (
                                    filteredFAQItems.map((item) => (
                                        <div key={item.id} className={styles.faqItem}>
                                            <div
                                                className={styles.faqQuestion}
                                                onClick={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
                                            >
                                                <h4 className={styles.faqQuestionText}>{item.question}</h4>
                                                <ChevronRight
                                                    size={20}
                                                    className={`${styles.faqChevron} ${expandedFAQ === item.id ? styles.expanded : ""}`}
                                                />
                                            </div>

                                            {expandedFAQ === item.id && (
                                                <div className={styles.faqAnswer}>
                                                    <p className={styles.faqAnswerText}>{item.answer}</p>

                                                    <div className={styles.faqFeedback}>
                                                        <p className={styles.faqFeedbackText}>Esta resposta foi útil?</p>
                                                        <div className={styles.faqFeedbackButtons}>
                                                            <button
                                                                onClick={() => handleFAQFeedback(item.id, 'helpful')}
                                                                className={styles.feedbackButton}
                                                            >
                                                                <ThumbsUp size={16} />
                                                                Sim ({item.helpful})
                                                            </button>
                                                            <button
                                                                onClick={() => handleFAQFeedback(item.id, 'notHelpful')}
                                                                className={styles.feedbackButton}
                                                            >
                                                                <ThumbsDown size={16} />
                                                                Não ({item.notHelpful})
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Seção de contato quando FAQ não resolve */}
                            <div className={styles.contactSection}>
                                <div className={styles.contactCard}>
                                    <h3 className={styles.contactTitle}>Não encontrou o que procurava?</h3>
                                    <p className={styles.contactDescription}>
                                        Nossa equipe de suporte está pronta para ajudar você com qualquer dúvida ou problema.
                                    </p>

                                    <div className={styles.contactOptions}>
                                        <button
                                            onClick={() => setActiveTab("create")}
                                            className={styles.contactButton}
                                        >
                                            <MessageCircle size={20} />
                                            Abrir Ticket de Suporte
                                        </button>

                                        <button className={styles.contactButton}>
                                            <Phone size={20} />
                                            Ligar para Suporte
                                        </button>

                                        <button className={styles.contactButton}>
                                            <Mail size={20} />
                                            Enviar E-mail
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "tickets" && (
                        <>
                            {/* Sub-abas para tickets */}
                            <div className={styles.ticketSubTabs}>
                                <button
                                    onClick={() => setTicketSubTab("open")}
                                    className={`${styles.ticketSubTab} ${ticketSubTab === "open" ? styles.activeTicketSubTab : ""}`}
                                >
                                    <AlertCircle size={16} />
                                    Tickets Abertos
                                    <span className={styles.ticketCount}>
                                        {tickets.filter(t => t.status === "open" || t.status === "in_progress").length}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setTicketSubTab("closed")}
                                    className={`${styles.ticketSubTab} ${ticketSubTab === "closed" ? styles.activeTicketSubTab : ""}`}
                                >
                                    <CheckCircle size={16} />
                                    Finalizados
                                    <span className={styles.ticketCount}>
                                        {tickets.filter(t => t.status === "resolved" || t.status === "closed").length}
                                    </span>
                                </button>
                            </div>

                            <div className={styles.filtersContainer}>
                                <div className={styles.searchContainer}>
                                    <Search size={20} className={styles.searchIcon} />
                                    <input
                                        type="text"
                                        placeholder="Buscar tickets..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className={styles.searchInput}
                                    />
                                </div>

                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={styles.filterToggle}
                                >
                                    <Filter size={16} />
                                    Filtros
                                    {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                            </div>

                            {showFilters && (
                                <div className={styles.filtersPanel}>
                                    <div className={styles.filterGroup}>
                                        <label>Status:</label>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className={styles.filterSelect}
                                        >
                                            <option value="all">Todos</option>
                                            <option value="open">Aberto</option>
                                            <option value="in_progress">Em Andamento</option>
                                            <option value="resolved">Resolvido</option>
                                            <option value="closed">Fechado</option>
                                        </select>
                                    </div>

                                    <div className={styles.filterGroup}>
                                        <label>Prioridade:</label>
                                        <select
                                            value={priorityFilter}
                                            onChange={(e) => setPriorityFilter(e.target.value)}
                                            className={styles.filterSelect}
                                        >
                                            <option value="all">Todas</option>
                                            <option value="low">Baixa</option>
                                            <option value="medium">Média</option>
                                            <option value="high">Alta</option>
                                            <option value="urgent">Urgente</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className={styles.ticketsList}>
                                {filteredTickets.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <MessageSquare size={48} className={styles.emptyIcon} />
                                        <h3>
                                            {ticketSubTab === "open"
                                                ? "Nenhum ticket aberto encontrado"
                                                : "Nenhum ticket finalizado encontrado"
                                            }
                                        </h3>
                                        <p>
                                            {ticketSubTab === "open"
                                                ? "Você não possui tickets em andamento no momento."
                                                : "Você não possui tickets finalizados no momento."
                                            }
                                        </p>
                                    </div>
                                ) : (
                                    filteredTickets.map((ticket) => (
                                        <div
                                            key={ticket.id}
                                            className={styles.ticketCard}
                                            onClick={() => setSelectedTicket(ticket)}
                                        >
                                            <div className={styles.ticketCardHeader}>
                                                <h3 className={styles.ticketCardTitle}>{ticket.title}</h3>
                                                <div className={styles.ticketCardMeta}>
                                                    <span className={styles.ticketCardId}>#{ticket.id}</span>
                                                    <div className={styles.statusBadge}>
                                                        {getStatusIcon(ticket.status)}
                                                        {getStatusText(ticket.status)}
                                                    </div>
                                                </div>
                                            </div>

                                            <p className={styles.ticketCardDescription}>{ticket.description}</p>

                                            <div className={styles.ticketCardFooter}>
                                                <div className={styles.ticketCardInfo}>
                                                    <span className={styles.ticketCardCategory}>
                                                        <Tag size={14} />
                                                        {ticket.category}
                                                    </span>
                                                    <span
                                                        className={styles.ticketCardPriority}
                                                        style={{ color: getPriorityColor(ticket.priority) }}
                                                    >
                                                        {getPriorityText(ticket.priority)}
                                                    </span>
                                                </div>
                                                <div className={styles.ticketCardDate}>
                                                    <Calendar size={14} />
                                                    {formatDate(ticket.updatedAt)}
                                                </div>
                                            </div>

                                            <button className={styles.viewButton}>
                                                <Eye size={16} />
                                                Ver detalhes
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </>
                    )}

                    {activeTab === "create" && (
                        <div className={styles.createTicketContainer}>
                            <div className={styles.createTicketHeader}>
                                <h2>Criar Novo Ticket</h2>
                                <button
                                    onClick={() => setActiveTab("tickets")}
                                    className={styles.cancelButton}
                                >
                                    Cancelar
                                </button>
                            </div>

                            <form onSubmit={handleCreateTicket} className={styles.createTicketForm}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="title">Título do Ticket *</label>
                                    <input
                                        id="title"
                                        type="text"
                                        value={newTicket.title}
                                        onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                                        placeholder="Descreva brevemente o problema"
                                        className={styles.formInput}
                                        required
                                    />
                                </div>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="category">Categoria *</label>
                                        <select
                                            id="category"
                                            value={newTicket.category}
                                            onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                                            className={styles.formSelect}
                                            required
                                        >
                                            <option value="">Selecione uma categoria</option>
                                            <option value="Sincronização">Sincronização</option>
                                            <option value="Relatórios">Relatórios</option>
                                            <option value="Backup">Backup</option>
                                            <option value="Pagamentos">Pagamentos</option>
                                            <option value="Interface">Interface</option>
                                            <option value="Outros">Outros</option>
                                        </select>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="priority">Prioridade</label>
                                        <select
                                            id="priority"
                                            value={newTicket.priority}
                                            onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                                            className={styles.formSelect}
                                        >
                                            <option value="low">Baixa</option>
                                            <option value="medium">Média</option>
                                            <option value="high">Alta</option>
                                            <option value="urgent">Urgente</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="description">Descrição Detalhada *</label>
                                    <textarea
                                        id="description"
                                        value={newTicket.description}
                                        onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                                        placeholder="Descreva o problema em detalhes. Inclua passos para reproduzir, mensagens de erro, etc."
                                        className={styles.formTextarea}
                                        rows={6}
                                        required
                                    />
                                </div>

                                <div className={styles.formActions}>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab("tickets")}
                                        className={styles.cancelFormButton}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className={styles.submitButton}
                                        disabled={!newTicket.title || !newTicket.description || !newTicket.category}
                                    >
                                        <Plus size={16} />
                                        Criar Ticket
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </ClientOnly>
        </DashboardLayout>
    );
};

export default SupportPage;
