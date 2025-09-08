"use client";

import React from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { ClientOnly } from "../../../components/layout/ClientOnly";
import styles from "./Privacy.module.css";
import { Shield, FileText, Calendar, User, Lock, Eye, Database, Mail, Phone } from "lucide-react";

export default function Privacy() {
    return (
        <DashboardLayout>
            <ClientOnly>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.titleSection}>
                            <Shield className={styles.titleIcon} />
                            <h1 className={styles.title}>Política de Privacidade</h1>
                        </div>
                        <p className={styles.lastUpdated}>
                            <Calendar className={styles.calendarIcon} />
                            Última atualização: 15 de dezembro de 2024
                        </p>
                    </div>

                    <div className={styles.content}>
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <FileText className={styles.sectionIcon} />
                                1. Introdução
                            </h2>
                            <p className={styles.paragraph}>
                                A Grex Finances (&quot;nós&quot;, &quot;nosso&quot; ou &quot;empresa&quot;) está comprometida em proteger a privacidade e segurança
                                das informações pessoais de nossos usuários. Esta Política de Privacidade descreve como coletamos,
                                usamos, armazenamos e protegemos suas informações quando você utiliza nossos serviços.
                            </p>
                            <p className={styles.paragraph}>
                                Ao utilizar nossos serviços, você concorda com as práticas descritas nesta política.
                                Recomendamos que leia atentamente este documento.
                            </p>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <User className={styles.sectionIcon} />
                                2. Informações que Coletamos
                            </h2>

                            <h3 className={styles.subsectionTitle}>2.1 Informações Pessoais</h3>
                            <ul className={styles.list}>
                                <li>Nome completo e dados de identificação</li>
                                <li>Endereço de e-mail e número de telefone</li>
                                <li>Documentos de identificação (CPF, CNPJ)</li>
                                <li>Endereço residencial e comercial</li>
                                <li>Data de nascimento</li>
                            </ul>

                            <h3 className={styles.subsectionTitle}>2.2 Informações Financeiras</h3>
                            <ul className={styles.list}>
                                <li>Dados de contas bancárias e cartões de crédito</li>
                                <li>Histórico de transações financeiras</li>
                                <li>Informações sobre investimentos e patrimônio</li>
                                <li>Dados de seguros e previdência</li>
                            </ul>

                            <h3 className={styles.subsectionTitle}>2.3 Informações Técnicas</h3>
                            <ul className={styles.list}>
                                <li>Endereço IP e localização geográfica</li>
                                <li>Informações do dispositivo e navegador</li>
                                <li>Dados de uso da aplicação</li>
                                <li>Cookies e tecnologias similares</li>
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <Eye className={styles.sectionIcon} />
                                3. Como Utilizamos suas Informações
                            </h2>

                            <div className={styles.usageGrid}>
                                <div className={styles.usageCard}>
                                    <h4 className={styles.usageTitle}>Prestação de Serviços</h4>
                                    <p className={styles.usageDescription}>
                                        Processar transações, gerenciar contas e fornecer funcionalidades da plataforma.
                                    </p>
                                </div>

                                <div className={styles.usageCard}>
                                    <h4 className={styles.usageTitle}>Comunicação</h4>
                                    <p className={styles.usageDescription}>
                                        Enviar notificações, atualizações e suporte ao cliente.
                                    </p>
                                </div>

                                <div className={styles.usageCard}>
                                    <h4 className={styles.usageTitle}>Segurança</h4>
                                    <p className={styles.usageDescription}>
                                        Detectar fraudes, prevenir atividades suspeitas e proteger sua conta.
                                    </p>
                                </div>

                                <div className={styles.usageCard}>
                                    <h4 className={styles.usageTitle}>Melhorias</h4>
                                    <p className={styles.usageDescription}>
                                        Analisar uso para melhorar nossos serviços e desenvolver novos recursos.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <Database className={styles.sectionIcon} />
                                4. Compartilhamento de Informações
                            </h2>

                            <p className={styles.paragraph}>
                                Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros,
                                exceto nas seguintes situações:
                            </p>

                            <ul className={styles.list}>
                                <li><strong>Prestadores de serviços:</strong> Empresas que nos auxiliam na operação da plataforma</li>
                                <li><strong>Instituições financeiras:</strong> Para processar transações e operações bancárias</li>
                                <li><strong>Autoridades legais:</strong> Quando exigido por lei ou ordem judicial</li>
                                <li><strong>Proteção de direitos:</strong> Para proteger nossos direitos, propriedade ou segurança</li>
                                <li><strong>Consentimento:</strong> Quando você autorizar explicitamente o compartilhamento</li>
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <Lock className={styles.sectionIcon} />
                                5. Segurança dos Dados
                            </h2>

                            <p className={styles.paragraph}>
                                Implementamos medidas de segurança robustas para proteger suas informações:
                            </p>

                            <div className={styles.securityGrid}>
                                <div className={styles.securityItem}>
                                    <div className={styles.securityIcon}>🔐</div>
                                    <h4 className={styles.securityTitle}>Criptografia</h4>
                                    <p className={styles.securityDescription}>
                                        Todos os dados são criptografados em trânsito e em repouso
                                    </p>
                                </div>

                                <div className={styles.securityItem}>
                                    <div className={styles.securityIcon}>🛡️</div>
                                    <h4 className={styles.securityTitle}>Acesso Restrito</h4>
                                    <p className={styles.securityDescription}>
                                        Apenas funcionários autorizados têm acesso aos dados
                                    </p>
                                </div>

                                <div className={styles.securityItem}>
                                    <div className={styles.securityIcon}>🔍</div>
                                    <h4 className={styles.securityTitle}>Monitoramento</h4>
                                    <p className={styles.securityDescription}>
                                        Monitoramento contínuo de atividades suspeitas
                                    </p>
                                </div>

                                <div className={styles.securityItem}>
                                    <div className={styles.securityIcon}>🔄</div>
                                    <h4 className={styles.securityTitle}>Backup Seguro</h4>
                                    <p className={styles.securityDescription}>
                                        Backups regulares e seguros de todos os dados
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <Calendar className={styles.sectionIcon} />
                                6. Retenção de Dados
                            </h2>

                            <p className={styles.paragraph}>
                                Mantemos suas informações pessoais apenas pelo tempo necessário para:
                            </p>

                            <ul className={styles.list}>
                                <li>Fornecer nossos serviços</li>
                                <li>Cumprir obrigações legais</li>
                                <li>Resolver disputas</li>
                                <li>Fazer cumprir nossos acordos</li>
                            </ul>

                            <p className={styles.paragraph}>
                                Dados financeiros são mantidos por 5 anos após o encerramento da conta,
                                conforme exigido pela legislação brasileira.
                            </p>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <User className={styles.sectionIcon} />
                                7. Seus Direitos
                            </h2>

                            <p className={styles.paragraph}>
                                Você tem os seguintes direitos sobre suas informações pessoais:
                            </p>

                            <div className={styles.rightsGrid}>
                                <div className={styles.rightItem}>
                                    <h4 className={styles.rightTitle}>Acesso</h4>
                                    <p className={styles.rightDescription}>
                                        Solicitar uma cópia dos dados que temos sobre você
                                    </p>
                                </div>

                                <div className={styles.rightItem}>
                                    <h4 className={styles.rightTitle}>Correção</h4>
                                    <p className={styles.rightDescription}>
                                        Corrigir informações incorretas ou desatualizadas
                                    </p>
                                </div>

                                <div className={styles.rightItem}>
                                    <h4 className={styles.rightTitle}>Exclusão</h4>
                                    <p className={styles.rightDescription}>
                                        Solicitar a exclusão de seus dados pessoais
                                    </p>
                                </div>

                                <div className={styles.rightItem}>
                                    <h4 className={styles.rightTitle}>Portabilidade</h4>
                                    <p className={styles.rightDescription}>
                                        Transferir seus dados para outro serviço
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <Mail className={styles.sectionIcon} />
                                8. Contato
                            </h2>

                            <p className={styles.paragraph}>
                                Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato conosco:
                            </p>

                            <div className={styles.contactInfo}>
                                <div className={styles.contactItem}>
                                    <Mail className={styles.contactIcon} />
                                    <div>
                                        <strong>E-mail:</strong> privacidade@grexfinances.com
                                    </div>
                                </div>

                                <div className={styles.contactItem}>
                                    <Phone className={styles.contactIcon} />
                                    <div>
                                        <strong>Telefone:</strong> (11) 3000-0000
                                    </div>
                                </div>

                                <div className={styles.contactItem}>
                                    <FileText className={styles.contactIcon} />
                                    <div>
                                        <strong>Endereço:</strong> Rua das Finanças, 123 - São Paulo/SP
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <FileText className={styles.sectionIcon} />
                                9. Alterações na Política
                            </h2>

                            <p className={styles.paragraph}>
                                Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas
                                através de e-mail ou notificação na plataforma. Recomendamos revisar esta política regularmente.
                            </p>
                        </section>

                        <div className={styles.footer}>
                            <p className={styles.footerText}>
                                Esta Política de Privacidade está em conformidade com a Lei Geral de Proteção de Dados (LGPD)
                                e outras regulamentações aplicáveis.
                            </p>
                        </div>
                    </div>
                </div>
            </ClientOnly>
        </DashboardLayout>
    );
}
