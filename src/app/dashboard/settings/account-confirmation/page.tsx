"use client";

import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../../../../components/layout";
import { useToastNotifications } from "../../../../hooks/useToastNotifications";
import {
    Shield,
    CheckCircle,
    AlertTriangle,
    Mail,
    Phone,
    User,
    Clock,
    RefreshCw,
    Eye,
    EyeOff,
    Key,
    Lock
} from "lucide-react";
import styles from "./AccountConfirmation.module.css";

interface VerificationMethod {
    id: string;
    type: "email" | "phone" | "password";
    label: string;
    description: string;
    verified: boolean;
    value: string;
    icon: React.ReactNode;
}

export default function AccountConfirmationPage() {
    const toast = useToastNotifications();
    const [verificationMethods, setVerificationMethods] = useState<VerificationMethod[]>([
        {
            id: "email",
            type: "email",
            label: "Email Principal",
            description: "Email usado para login e notificações importantes",
            verified: true,
            value: "usuario@igreja.com",
            icon: <Mail size={20} />
        },
        {
            id: "phone",
            type: "phone",
            label: "Telefone",
            description: "Número para autenticação de dois fatores",
            verified: false,
            value: "+55 (11) 99999-9999",
            icon: <Phone size={20} />
        },
        {
            id: "password",
            type: "password",
            label: "Senha",
            description: "Senha forte para proteger sua conta",
            verified: true,
            value: "••••••••",
            icon: <Key size={20} />
        }
    ]);

    const [isVerifying, setIsVerifying] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState({
        current: "",
        new: "",
        confirm: ""
    });

    const handleVerifyMethod = async (methodId: string) => {
        setIsVerifying(methodId);

        try {
            // Simular processo de verificação
            await new Promise(resolve => setTimeout(resolve, 2000));

            setVerificationMethods(prev =>
                prev.map(method =>
                    method.id === methodId
                        ? { ...method, verified: true }
                        : method
                )
            );

            toast.showSuccess("Verificação realizada com sucesso!");
        } catch (error) {
            toast.showApiError("verificar método");
        } finally {
            setIsVerifying(null);
        }
    };

    const handleResendCode = async (methodId: string) => {
        try {
            // Simular reenvio de código
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.showSuccess("Código reenviado com sucesso!");
        } catch (error) {
            toast.showApiError("reenviar código");
        }
    };

    const handleChangePassword = async () => {
        if (newPassword.new !== newPassword.confirm) {
            toast.showError("As senhas não coincidem");
            return;
        }

        if (newPassword.new.length < 8) {
            toast.showError("A senha deve ter pelo menos 8 caracteres");
            return;
        }

        try {
            // Simular alteração de senha
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.showSuccess("Senha alterada com sucesso!");
            setNewPassword({ current: "", new: "", confirm: "" });
        } catch (error) {
            toast.showApiError("alterar senha");
        }
    };

    const getVerificationStatus = () => {
        const verifiedCount = verificationMethods.filter(m => m.verified).length;
        const totalCount = verificationMethods.length;
        return { verifiedCount, totalCount, percentage: (verifiedCount / totalCount) * 100 };
    };

    const status = getVerificationStatus();

    return (
        <DashboardLayout>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.titleSection}>
                            <div className={styles.iconWrapper}>
                                <Shield size={24} />
                            </div>
                            <div>
                                <h1 className={styles.title}>Confirmação de Conta</h1>
                                <p className={styles.subtitle}>
                                    Verifique e confirme os métodos de autenticação da sua conta
                                </p>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className={styles.statusBadge}>
                            <div className={styles.statusInfo}>
                                <span className={styles.statusText}>
                                    {status.verifiedCount}/{status.totalCount} verificados
                                </span>
                                <div className={styles.progressBar}>
                                    <div
                                        className={styles.progressFill}
                                        style={{ width: `${status.percentage}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security Level */}
                <div className={styles.securityLevel}>
                    <div className={styles.securityInfo}>
                        <h3 className={styles.securityTitle}>Nível de Segurança</h3>
                        <div className={styles.securityBadges}>
                            {status.percentage >= 100 && (
                                <span className={`${styles.badge} ${styles.excellent}`}>
                                    <CheckCircle size={16} />
                                    Excelente
                                </span>
                            )}
                            {status.percentage >= 66 && status.percentage < 100 && (
                                <span className={`${styles.badge} ${styles.good}`}>
                                    <Shield size={16} />
                                    Bom
                                </span>
                            )}
                            {status.percentage < 66 && (
                                <span className={`${styles.badge} ${styles.warning}`}>
                                    <AlertTriangle size={16} />
                                    Precisa melhorar
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Verification Methods */}
                <div className={styles.methodsSection}>
                    <h2 className={styles.sectionTitle}>Métodos de Verificação</h2>

                    <div className={styles.methodsGrid}>
                        {verificationMethods.map((method) => (
                            <div key={method.id} className={styles.methodCard}>
                                <div className={styles.methodHeader}>
                                    <div className={styles.methodIcon}>
                                        {method.icon}
                                    </div>
                                    <div className={styles.methodInfo}>
                                        <h3 className={styles.methodTitle}>{method.label}</h3>
                                        <p className={styles.methodDescription}>{method.description}</p>
                                    </div>
                                    <div className={styles.methodStatus}>
                                        {method.verified ? (
                                            <span className={styles.verifiedBadge}>
                                                <CheckCircle size={16} />
                                                Verificado
                                            </span>
                                        ) : (
                                            <span className={styles.unverifiedBadge}>
                                                <AlertTriangle size={16} />
                                                Não verificado
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.methodValue}>
                                    <span className={styles.valueText}>{method.value}</span>
                                </div>

                                <div className={styles.methodActions}>
                                    {method.verified ? (
                                        <button
                                            className={styles.verifiedButton}
                                            disabled
                                        >
                                            <CheckCircle size={16} />
                                            Verificado
                                        </button>
                                    ) : (
                                        <div className={styles.actionButtons}>
                                            <button
                                                className={styles.verifyButton}
                                                onClick={() => handleVerifyMethod(method.id)}
                                                disabled={isVerifying === method.id}
                                            >
                                                {isVerifying === method.id ? (
                                                    <>
                                                        <RefreshCw size={16} className="animate-spin" />
                                                        Verificando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Shield size={16} />
                                                        Verificar
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                className={styles.resendButton}
                                                onClick={() => handleResendCode(method.id)}
                                            >
                                                <Mail size={16} />
                                                Reenviar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Password Change Section */}
                <div className={styles.passwordSection}>
                    <h2 className={styles.sectionTitle}>Alterar Senha</h2>

                    <div className={styles.passwordForm}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Senha Atual</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={styles.input}
                                    value={newPassword.current}
                                    onChange={(e) => setNewPassword(prev => ({ ...prev, current: e.target.value }))}
                                    placeholder="Digite sua senha atual"
                                />
                                <button
                                    type="button"
                                    className={styles.toggleButton}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Nova Senha</label>
                            <input
                                type="password"
                                className={styles.input}
                                value={newPassword.new}
                                onChange={(e) => setNewPassword(prev => ({ ...prev, new: e.target.value }))}
                                placeholder="Digite sua nova senha"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Confirmar Nova Senha</label>
                            <input
                                type="password"
                                className={styles.input}
                                value={newPassword.confirm}
                                onChange={(e) => setNewPassword(prev => ({ ...prev, confirm: e.target.value }))}
                                placeholder="Confirme sua nova senha"
                            />
                        </div>

                        <button
                            className={styles.changePasswordButton}
                            onClick={handleChangePassword}
                        >
                            <Lock size={16} />
                            Alterar Senha
                        </button>
                    </div>
                </div>

                {/* Security Tips */}
                <div className={styles.tipsSection}>
                    <h2 className={styles.sectionTitle}>Dicas de Segurança</h2>

                    <div className={styles.tipsGrid}>
                        <div className={styles.tipCard}>
                            <div className={styles.tipIcon}>
                                <Shield size={20} />
                            </div>
                            <div className={styles.tipContent}>
                                <h3 className={styles.tipTitle}>Senha Forte</h3>
                                <p className={styles.tipDescription}>
                                    Use uma senha com pelo menos 8 caracteres, incluindo números e símbolos.
                                </p>
                            </div>
                        </div>

                        <div className={styles.tipCard}>
                            <div className={styles.tipIcon}>
                                <Mail size={20} />
                            </div>
                            <div className={styles.tipContent}>
                                <h3 className={styles.tipTitle}>Email Verificado</h3>
                                <p className={styles.tipDescription}>
                                    Mantenha seu email atualizado para receber notificações de segurança.
                                </p>
                            </div>
                        </div>

                        <div className={styles.tipCard}>
                            <div className={styles.tipIcon}>
                                <Phone size={20} />
                            </div>
                            <div className={styles.tipContent}>
                                <h3 className={styles.tipTitle}>Autenticação de Dois Fatores</h3>
                                <p className={styles.tipDescription}>
                                    Ative a verificação por telefone para maior segurança.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout >
    );
}
