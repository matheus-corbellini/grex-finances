"use client";

import React, { useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { ClientOnly } from "../../../components/layout/ClientOnly";
import styles from "./Help.module.css";
import {
    Search,
    HelpCircle,
    MessageCircle,
    FileText,
    Phone,
    Mail,
    ChevronRight,
    BookOpen,
    Video,
    Download,
    Star
} from "lucide-react";

const helpCategories = [
    {
        id: "getting-started",
        title: "Primeiros Passos",
        icon: BookOpen,
        articles: [
            "Como criar sua primeira conta",
            "Configurando sua igreja",
            "Adicionando usuários",
            "Entendendo o dashboard"
        ]
    },
    {
        id: "financial",
        title: "Gestão Financeira",
        icon: FileText,
        articles: [
            "Como registrar lançamentos",
            "Criando categorias personalizadas",
            "Configurando contas bancárias",
            "Gerando relatórios financeiros"
        ]
    },
    {
        id: "reports",
        title: "Relatórios",
        icon: FileText,
        articles: [
            "Análise de entradas e saídas",
            "Relatório de fluxo de caixa",
            "DRE Gerencial",
            "Exportando dados"
        ]
    },
    {
        id: "users",
        title: "Usuários e Permissões",
        icon: HelpCircle,
        articles: [
            "Adicionando novos usuários",
            "Configurando permissões",
            "Gerenciando acessos",
            "Resetando senhas"
        ]
    }
];

const faqItems = [
    {
        question: "Como posso adicionar uma nova transação?",
        answer: "Para adicionar uma nova transação, vá até a seção 'Lançamentos' no menu principal e clique no botão '+ Adicionar'. Preencha os campos obrigatórios e salve."
    },
    {
        question: "Posso exportar meus relatórios?",
        answer: "Sim! Todos os relatórios podem ser exportados em formato PDF ou Excel. Basta clicar no botão 'Exportar' na tela do relatório desejado."
    },
    {
        question: "Como configuro as categorias de receitas e despesas?",
        answer: "Acesse 'Configurações' > 'Categorias' para criar e gerenciar suas categorias personalizadas de receitas e despesas."
    },
    {
        question: "Posso usar o sistema em múltiplas igrejas?",
        answer: "Atualmente, cada conta está vinculada a uma igreja. Para múltiplas igrejas, você precisará de contas separadas."
    },
    {
        question: "Como faço backup dos meus dados?",
        answer: "Seus dados são automaticamente salvos na nuvem. Você também pode exportar relatórios e dados através da seção de relatórios."
    }
];

const videoTutorials = [
    {
        title: "Configuração Inicial",
        duration: "5:30",
        description: "Aprenda a configurar sua conta e igreja"
    },
    {
        title: "Primeiro Lançamento",
        duration: "3:45",
        description: "Como registrar sua primeira transação"
    },
    {
        title: "Gerando Relatórios",
        duration: "7:20",
        description: "Criando e exportando relatórios financeiros"
    },
    {
        title: "Gerenciando Usuários",
        duration: "4:15",
        description: "Adicionando e configurando usuários"
    }
];

export default function Help() {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const handleFaqToggle = (index: number) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    return (
        <DashboardLayout>
            <ClientOnly>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.title}>Central de Ajuda</h1>
                        <p className={styles.subtitle}>
                            Encontre respostas para suas dúvidas e aprenda a usar o Grex Finances
                        </p>
                    </div>

                    {/* Search Section */}
                    <div className={styles.searchSection}>
                        <div className={styles.searchContainer}>
                            <Search size={20} className={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Digite sua dúvida ou palavra-chave..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className={styles.quickActions}>
                        <h2 className={styles.sectionTitle}>Ações Rápidas</h2>
                        <div className={styles.actionsGrid}>
                            <button className={styles.actionCard}>
                                <MessageCircle size={24} />
                                <span>Chat de Suporte</span>
                            </button>
                            <button className={styles.actionCard}>
                                <Phone size={24} />
                                <span>Ligar para Suporte</span>
                            </button>
                            <button className={styles.actionCard}>
                                <Mail size={24} />
                                <span>Enviar E-mail</span>
                            </button>
                            <button className={styles.actionCard}>
                                <FileText size={24} />
                                <span>Documentação</span>
                            </button>
                        </div>
                    </div>

                    {/* Help Categories */}
                    <div className={styles.categoriesSection}>
                        <h2 className={styles.sectionTitle}>Categorias de Ajuda</h2>
                        <div className={styles.categoriesGrid}>
                            {helpCategories.map((category) => (
                                <div key={category.id} className={styles.categoryCard}>
                                    <div className={styles.categoryHeader}>
                                        <category.icon size={24} className={styles.categoryIcon} />
                                        <h3 className={styles.categoryTitle}>{category.title}</h3>
                                    </div>
                                    <ul className={styles.articlesList}>
                                        {category.articles.map((article, index) => (
                                            <li key={index} className={styles.articleItem}>
                                                <ChevronRight size={16} />
                                                <span>{article}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Video Tutorials */}
                    <div className={styles.tutorialsSection}>
                        <h2 className={styles.sectionTitle}>Tutoriais em Vídeo</h2>
                        <div className={styles.tutorialsGrid}>
                            {videoTutorials.map((tutorial, index) => (
                                <div key={index} className={styles.tutorialCard}>
                                    <div className={styles.tutorialThumbnail}>
                                        <Video size={32} />
                                        <div className={styles.playButton}>
                                            <div className={styles.playIcon}></div>
                                        </div>
                                    </div>
                                    <div className={styles.tutorialContent}>
                                        <h3 className={styles.tutorialTitle}>{tutorial.title}</h3>
                                        <p className={styles.tutorialDescription}>{tutorial.description}</p>
                                        <div className={styles.tutorialMeta}>
                                            <span className={styles.duration}>{tutorial.duration}</span>
                                            <button className={styles.watchButton}>
                                                Assistir
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className={styles.faqSection}>
                        <h2 className={styles.sectionTitle}>Perguntas Frequentes</h2>
                        <div className={styles.faqList}>
                            {faqItems.map((item, index) => (
                                <div key={index} className={styles.faqItem}>
                                    <button
                                        className={styles.faqQuestion}
                                        onClick={() => handleFaqToggle(index)}
                                    >
                                        <span>{item.question}</span>
                                        <ChevronRight
                                            size={20}
                                            className={`${styles.faqIcon} ${expandedFaq === index ? styles.expanded : ''}`}
                                        />
                                    </button>
                                    {expandedFaq === index && (
                                        <div className={styles.faqAnswer}>
                                            <p>{item.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className={styles.contactSection}>
                        <h2 className={styles.sectionTitle}>Ainda precisa de ajuda?</h2>
                        <div className={styles.contactGrid}>
                            <div className={styles.contactCard}>
                                <MessageCircle size={32} />
                                <h3>Chat Online</h3>
                                <p>Converse com nosso suporte em tempo real</p>
                                <button className={styles.contactButton}>Iniciar Chat</button>
                            </div>
                            <div className={styles.contactCard}>
                                <Phone size={32} />
                                <h3>Telefone</h3>
                                <p>(11) 9999-9999</p>
                                <button className={styles.contactButton}>Ligar</button>
                            </div>
                            <div className={styles.contactCard}>
                                <Mail size={32} />
                                <h3>E-mail</h3>
                                <p>suporte@grexfinances.com</p>
                                <button className={styles.contactButton}>Enviar E-mail</button>
                            </div>
                        </div>
                    </div>
                </div>
            </ClientOnly>
        </DashboardLayout>
    );
}
