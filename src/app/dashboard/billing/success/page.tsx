"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "../../../../components/layout";
import {
    CheckCircle,
    ArrowRight,
    CreditCard,
    Calendar,
    Mail,
    Download
} from "lucide-react";
import styles from "./Success.module.css";

export default function SuccessPage() {
    const router = useRouter();

    const handleGoToDashboard = () => {
        router.push('/dashboard');
    };

    const handleViewBilling = () => {
        router.push('/dashboard/billing/invoices');
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.successCard}>
                    <div className={styles.successIcon}>
                        <CheckCircle className={styles.checkIcon} />
                    </div>

                    <h1>Pagamento realizado com sucesso!</h1>
                    <p>
                        Sua assinatura foi ativada e você já pode aproveitar todos os recursos do seu novo plano.
                    </p>

                    <div className={styles.nextSteps}>
                        <h2>Próximos passos:</h2>
                        <div className={styles.stepsList}>
                            <div className={styles.step}>
                                <Mail className={styles.stepIcon} />
                                <div>
                                    <h3>Confirmação por e-mail</h3>
                                    <p>Você receberá um e-mail de confirmação com os detalhes da sua assinatura</p>
                                </div>
                            </div>

                            <div className={styles.step}>
                                <Download className={styles.stepIcon} />
                                <div>
                                    <h3>Fatura disponível</h3>
                                    <p>Sua fatura já está disponível na área de cobrança</p>
                                </div>
                            </div>

                            <div className={styles.step}>
                                <Calendar className={styles.stepIcon} />
                                <div>
                                    <h3>Próxima cobrança</h3>
                                    <p>A próxima cobrança será processada automaticamente</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button
                            className={styles.primaryButton}
                            onClick={handleGoToDashboard}
                        >
                            Ir para o Dashboard
                            <ArrowRight className={styles.buttonIcon} />
                        </button>

                        <button
                            className={styles.secondaryButton}
                            onClick={handleViewBilling}
                        >
                            <CreditCard className={styles.buttonIcon} />
                            Ver cobranças
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
