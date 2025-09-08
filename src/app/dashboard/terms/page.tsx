"use client";

import React from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { ClientOnly } from "../../../components/layout/ClientOnly";
import styles from "./Terms.module.css";
import {
    FileText,
    Calendar,
    User,
    Shield,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Mail,
    Phone,
    Scale,
    Gavel,
    BookOpen
} from "lucide-react";

export default function Terms() {
    return (
        <DashboardLayout>
            <ClientOnly>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.titleSection}>
                            <FileText className={styles.titleIcon} />
                            <h1 className={styles.title}>Termos de Uso</h1>
                        </div>
                        <p className={styles.lastUpdated}>
                            <Calendar className={styles.calendarIcon} />
                            Última atualização: 15 de dezembro de 2024
                        </p>
                    </div>

                    <div className={styles.content}>
                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <BookOpen className={styles.sectionIcon} />
                                1. Aceitação dos Termos
                            </h2>
                            <p className={styles.paragraph}>
                                Bem-vindo ao Grex Finances! Estes Termos de Uso (&quot;Termos&quot;) regem o uso da nossa plataforma
                                de gestão financeira. Ao acessar ou utilizar nossos serviços, você concorda em cumprir
                                e estar vinculado a estes Termos.
                            </p>
                            <div className={styles.highlightBox}>
                                <AlertTriangle className={styles.highlightIcon} />
                                <p className={styles.highlightText}>
                                    <strong>Importante:</strong> Se você não concordar com estes Termos, não deve utilizar nossos serviços.
                                </p>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <User className={styles.sectionIcon} />
                                2. Definições
                            </h2>

                            <div className={styles.definitionsGrid}>
                                <div className={styles.definitionCard}>
                                    <h4 className={styles.definitionTerm}>&quot;Plataforma&quot;</h4>
                                    <p className={styles.definitionText}>
                                        Refere-se ao sistema Grex Finances, incluindo website, aplicativo móvel e todos os serviços relacionados.
                                    </p>
                                </div>

                                <div className={styles.definitionCard}>
                                    <h4 className={styles.definitionTerm}>&quot;Usuário&quot;</h4>
                                    <p className={styles.definitionText}>
                                        Qualquer pessoa física ou jurídica que acessa ou utiliza a Plataforma.
                                    </p>
                                </div>

                                <div className={styles.definitionCard}>
                                    <h4 className={styles.definitionTerm}>&quot;Serviços&quot;</h4>
                                    <p className={styles.definitionText}>
                                        Todas as funcionalidades oferecidas pela Plataforma para gestão financeira.
                                    </p>
                                </div>

                                <div className={styles.definitionCard}>
                                    <h4 className={styles.definitionTerm}>&quot;Dados&quot;</h4>
                                    <p className={styles.definitionText}>
                                        Informações fornecidas pelo Usuário ou coletadas pela Plataforma.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <CheckCircle className={styles.sectionIcon} />
                                3. Elegibilidade e Cadastro
                            </h2>

                            <h3 className={styles.subsectionTitle}>3.1 Requisitos de Elegibilidade</h3>
                            <ul className={styles.list}>
                                <li>Ter pelo menos 18 anos de idade</li>
                                <li>Ser pessoa física ou jurídica legalmente constituída</li>
                                <li>Fornecer informações verdadeiras e atualizadas</li>
                                <li>Ter capacidade legal para celebrar contratos</li>
                            </ul>

                            <h3 className={styles.subsectionTitle}>3.2 Processo de Cadastro</h3>
                            <div className={styles.stepsContainer}>
                                <div className={styles.step}>
                                    <div className={styles.stepNumber}>1</div>
                                    <div className={styles.stepContent}>
                                        <h4 className={styles.stepTitle}>Preenchimento do Formulário</h4>
                                        <p className={styles.stepDescription}>
                                            Complete todos os campos obrigatórios com informações precisas
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.step}>
                                    <div className={styles.stepNumber}>2</div>
                                    <div className={styles.stepContent}>
                                        <h4 className={styles.stepTitle}>Verificação de Identidade</h4>
                                        <p className={styles.stepDescription}>
                                            Envie documentos necessários para validação
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.step}>
                                    <div className={styles.stepNumber}>3</div>
                                    <div className={styles.stepContent}>
                                        <h4 className={styles.stepTitle}>Ativação da Conta</h4>
                                        <p className={styles.stepDescription}>
                                            Aguarde aprovação e ative sua conta via e-mail
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <Shield className={styles.sectionIcon} />
                                4. Uso da Plataforma
                            </h2>

                            <h3 className={styles.subsectionTitle}>4.1 Uso Permitido</h3>
                            <div className={styles.permittedUses}>
                                <div className={styles.useItem}>
                                    <CheckCircle className={styles.useIcon} />
                                    <span>Gestão de finanças pessoais ou empresariais</span>
                                </div>
                                <div className={styles.useItem}>
                                    <CheckCircle className={styles.useIcon} />
                                    <span>Controle de receitas e despesas</span>
                                </div>
                                <div className={styles.useItem}>
                                    <CheckCircle className={styles.useIcon} />
                                    <span>Relatórios e análises financeiras</span>
                                </div>
                                <div className={styles.useItem}>
                                    <CheckCircle className={styles.useIcon} />
                                    <span>Integração com instituições financeiras</span>
                                </div>
                            </div>

                            <h3 className={styles.subsectionTitle}>4.2 Uso Proibido</h3>
                            <div className={styles.prohibitedUses}>
                                <div className={styles.useItem}>
                                    <XCircle className={styles.useIcon} />
                                    <span>Atividades ilegais ou fraudulentas</span>
                                </div>
                                <div className={styles.useItem}>
                                    <XCircle className={styles.useIcon} />
                                    <span>Violar direitos de propriedade intelectual</span>
                                </div>
                                <div className={styles.useItem}>
                                    <XCircle className={styles.useIcon} />
                                    <span>Interferir no funcionamento da Plataforma</span>
                                </div>
                                <div className={styles.useItem}>
                                    <XCircle className={styles.useIcon} />
                                    <span>Compartilhar credenciais de acesso</span>
                                </div>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <Scale className={styles.sectionIcon} />
                                5. Responsabilidades
                            </h2>

                            <div className={styles.responsibilitiesGrid}>
                                <div className={styles.responsibilityCard}>
                                    <h4 className={styles.responsibilityTitle}>Do Usuário</h4>
                                    <ul className={styles.responsibilityList}>
                                        <li>Manter informações atualizadas</li>
                                        <li>Proteger credenciais de acesso</li>
                                        <li>Usar a Plataforma conforme estes Termos</li>
                                        <li>Notificar sobre uso não autorizado</li>
                                        <li>Respeitar direitos de terceiros</li>
                                    </ul>
                                </div>

                                <div className={styles.responsibilityCard}>
                                    <h4 className={styles.responsibilityTitle}>Da Grex Finances</h4>
                                    <ul className={styles.responsibilityList}>
                                        <li>Fornecer serviços conforme descrito</li>
                                        <li>Proteger dados do usuário</li>
                                        <li>Manter disponibilidade da Plataforma</li>
                                        <li>Fornecer suporte técnico</li>
                                        <li>Respeitar privacidade do usuário</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <Gavel className={styles.sectionIcon} />
                                6. Limitações de Responsabilidade
                            </h2>

                            <div className={styles.limitationBox}>
                                <AlertTriangle className={styles.limitationIcon} />
                                <div className={styles.limitationContent}>
                                    <h4 className={styles.limitationTitle}>Isenção de Garantias</h4>
                                    <p className={styles.limitationText}>
                                        A Plataforma é fornecida &quot;como está&quot;, sem garantias de qualquer tipo.
                                        Não garantimos que os serviços estarão sempre disponíveis ou livres de erros.
                                    </p>
                                </div>
                            </div>

                            <div className={styles.limitationBox}>
                                <AlertTriangle className={styles.limitationIcon} />
                                <div className={styles.limitationContent}>
                                    <h4 className={styles.limitationTitle}>Limitação de Danos</h4>
                                    <p className={styles.limitationText}>
                                        Nossa responsabilidade é limitada ao valor pago pelos serviços nos últimos 12 meses,
                                        excluindo danos indiretos, consequenciais ou lucros cessantes.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <FileText className={styles.sectionIcon} />
                                7. Propriedade Intelectual
                            </h2>

                            <p className={styles.paragraph}>
                                Todos os direitos de propriedade intelectual relacionados à Plataforma, incluindo
                                software, design, textos, imagens e marcas, são de propriedade exclusiva da Grex Finances.
                            </p>

                            <div className={styles.ipGrid}>
                                <div className={styles.ipItem}>
                                    <h4 className={styles.ipTitle}>Software</h4>
                                    <p className={styles.ipDescription}>
                                        Código fonte, algoritmos e funcionalidades são protegidos por direitos autorais.
                                    </p>
                                </div>

                                <div className={styles.ipItem}>
                                    <h4 className={styles.ipTitle}>Design</h4>
                                    <p className={styles.ipDescription}>
                                        Interface, layout e elementos visuais são marcas registradas.
                                    </p>
                                </div>

                                <div className={styles.ipItem}>
                                    <h4 className={styles.ipTitle}>Conteúdo</h4>
                                    <p className={styles.ipDescription}>
                                        Textos, imagens e materiais são protegidos por direitos autorais.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <AlertTriangle className={styles.sectionIcon} />
                                8. Suspensão e Encerramento
                            </h2>

                            <h3 className={styles.subsectionTitle}>8.1 Suspensão Temporária</h3>
                            <p className={styles.paragraph}>
                                Podemos suspender temporariamente sua conta em caso de:
                            </p>
                            <ul className={styles.list}>
                                <li>Suspeita de atividade fraudulenta</li>
                                <li>Violação destes Termos</li>
                                <li>Manutenção programada</li>
                                <li>Problemas técnicos</li>
                            </ul>

                            <h3 className={styles.subsectionTitle}>8.2 Encerramento da Conta</h3>
                            <p className={styles.paragraph}>
                                Podemos encerrar sua conta permanentemente em caso de:
                            </p>
                            <ul className={styles.list}>
                                <li>Uso indevido da Plataforma</li>
                                <li>Fornecimento de informações falsas</li>
                                <li>Atividades ilegais</li>
                                <li>Violência repetida dos Termos</li>
                            </ul>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <Scale className={styles.sectionIcon} />
                                9. Lei Aplicável e Foro
                            </h2>

                            <div className={styles.jurisdictionBox}>
                                <p className={styles.paragraph}>
                                    Estes Termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida
                                    no foro da comarca de São Paulo/SP, renunciando a qualquer outro, por mais privilegiado que seja.
                                </p>
                            </div>
                        </section>

                        <section className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                <Mail className={styles.sectionIcon} />
                                10. Contato
                            </h2>

                            <p className={styles.paragraph}>
                                Para questões relacionadas a estes Termos de Uso, entre em contato conosco:
                            </p>

                            <div className={styles.contactInfo}>
                                <div className={styles.contactItem}>
                                    <Mail className={styles.contactIcon} />
                                    <div>
                                        <strong>E-mail:</strong> juridico@grexfinances.com
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

                        <div className={styles.footer}>
                            <p className={styles.footerText}>
                                Estes Termos de Uso entram em vigor a partir da data de sua publicação e podem ser
                                atualizados a qualquer momento. Recomendamos revisar periodicamente.
                            </p>
                        </div>
                    </div>
                </div>
            </ClientOnly>
        </DashboardLayout>
    );
}
