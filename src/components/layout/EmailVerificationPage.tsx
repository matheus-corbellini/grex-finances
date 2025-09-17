"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import {
    Mail,
    CheckCircle,
    AlertCircle,
    RefreshCw,
    ArrowLeft,
    Clock,
    Shield
} from "lucide-react";

const SheepIcon = () => (
    <img
        src="/Group 75.png"
        alt="Sheep Icon"
        style={{
            width: "40px",
            height: "40px",
            filter: "brightness(0) invert(1)",
        }}
    />
);

export const EmailVerificationPage: React.FC = () => {
    const theme = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState("");
    const [isResending, setIsResending] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [error, setError] = useState("");
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        const emailParam = searchParams.get("email");
        if (emailParam) {
            setEmail(emailParam);
        } else {
            router.push("/register");
        }

        // Check if already verified
        const verified = searchParams.get("verified");
        if (verified === "true") {
            setIsVerified(true);
        }
    }, [searchParams, router]);

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleResendEmail = async () => {
        if (resendCooldown > 0) return;

        setIsResending(true);
        setError("");

        try {
            // TODO: Implementar chamada para API de reenvio de email
            // const response = await authService.resendVerificationEmail({ email });

            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log("Email de verificação reenviado para:", email);
            setResendCooldown(60); // 60 segundos de cooldown
        } catch (error) {
            console.error("Erro ao reenviar email:", error);
            setError("Erro ao reenviar email. Tente novamente.");
        } finally {
            setIsResending(false);
        }
    };

    const handleCheckVerification = async () => {
        try {
            // TODO: Implementar verificação do status do email
            // const response = await authService.checkEmailVerification({ email });

            // Simular verificação
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Se verificado, redirecionar para login
            router.push("/login?verified=true");
        } catch (error) {
            console.error("Erro ao verificar status:", error);
            setError("Erro ao verificar status. Tente novamente.");
        }
    };

    const handleBackToRegister = () => {
        router.push("/register");
    };

    if (isVerified) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Success Content */}
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "40px 20px",
                        position: "relative",
                        zIndex: 2,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "24px",
                            padding: "48px 40px",
                            width: "100%",
                            maxWidth: "500px",
                            textAlign: "center",
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        }}
                    >
                        {/* Success Icon */}
                        <div
                            style={{
                                width: "80px",
                                height: "80px",
                                backgroundColor: theme.colors.success[100],
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 24px",
                            }}
                        >
                            <CheckCircle
                                size={40}
                                color={theme.colors.success[600]}
                            />
                        </div>

                        {/* Success Title */}
                        <h1
                            style={{
                                fontSize: "28px",
                                fontWeight: "700",
                                color: theme.colors.neutrals[900],
                                marginBottom: "12px",
                            }}
                        >
                            Email Verificado!
                        </h1>

                        {/* Success Message */}
                        <p
                            style={{
                                fontSize: "16px",
                                color: theme.colors.neutrals[600],
                                marginBottom: "32px",
                                lineHeight: "1.5",
                            }}
                        >
                            Seu email foi verificado com sucesso. Agora você pode fazer login na sua conta.
                        </p>

                        {/* Action Button */}
                        <button
                            onClick={() => router.push("/login")}
                            style={{
                                width: "100%",
                                padding: "16px 24px",
                                background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`,
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.1)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            Ir para Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Background Pattern */}
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                    zIndex: 1,
                }}
            />

            {/* Header */}
            <div
                style={{
                    padding: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "relative",
                    zIndex: 2,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <SheepIcon />
                    <span
                        style={{
                            fontSize: "20px",
                            fontWeight: "700",
                            color: "white",
                        }}
                    >
                        Grex Finances
                    </span>
                </div>
                <button
                    onClick={handleBackToRegister}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 16px",
                        background: "rgba(255, 255, 255, 0.1)",
                        color: "white",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                    }}
                >
                    <ArrowLeft size={16} />
                    Voltar
                </button>
            </div>

            {/* Main Content */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px 20px",
                    position: "relative",
                    zIndex: 2,
                }}
            >
                <div
                    style={{
                        backgroundColor: "white",
                        borderRadius: "24px",
                        padding: "48px 40px",
                        width: "100%",
                        maxWidth: "500px",
                        textAlign: "center",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                >
                    {/* Email Icon */}
                    <div
                        style={{
                            width: "80px",
                            height: "80px",
                            backgroundColor: theme.colors.primary[100],
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 24px",
                        }}
                    >
                        <Mail
                            size={40}
                            color={theme.colors.primary[600]}
                        />
                    </div>

                    {/* Title */}
                    <h1
                        style={{
                            fontSize: "28px",
                            fontWeight: "700",
                            color: theme.colors.neutrals[900],
                            marginBottom: "12px",
                        }}
                    >
                        Verifique seu Email
                    </h1>

                    {/* Description */}
                    <p
                        style={{
                            fontSize: "16px",
                            color: theme.colors.neutrals[600],
                            marginBottom: "32px",
                            lineHeight: "1.5",
                        }}
                    >
                        Enviamos um link de verificação para:
                        <br />
                        <strong style={{ color: theme.colors.primary[600] }}>{email}</strong>
                    </p>

                    {/* Instructions */}
                    <div
                        style={{
                            backgroundColor: theme.colors.neutrals[50],
                            borderRadius: "12px",
                            padding: "20px",
                            marginBottom: "32px",
                            textAlign: "left",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: "16px",
                                fontWeight: "600",
                                color: theme.colors.neutrals[900],
                                marginBottom: "12px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <Shield size={16} />
                            Próximos passos:
                        </h3>
                        <ol
                            style={{
                                fontSize: "14px",
                                color: theme.colors.neutrals[600],
                                lineHeight: "1.6",
                                paddingLeft: "20px",
                            }}
                        >
                            <li>Verifique sua caixa de entrada</li>
                            <li>Procure por emails do Grex Finances</li>
                            <li>Clique no link de verificação</li>
                            <li>Volte aqui e clique em "Verificar"</li>
                        </ol>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div
                            style={{
                                backgroundColor: theme.colors.error[50],
                                border: `1px solid ${theme.colors.error[200]}`,
                                borderRadius: "8px",
                                padding: "12px",
                                marginBottom: "24px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <AlertCircle size={16} color={theme.colors.error[600]} />
                            <span
                                style={{
                                    fontSize: "14px",
                                    color: theme.colors.error[600],
                                }}
                            >
                                {error}
                            </span>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <button
                            onClick={handleCheckVerification}
                            style={{
                                width: "100%",
                                padding: "16px 24px",
                                background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`,
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.1)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                        >
                            <CheckCircle size={20} />
                            Verificar Email
                        </button>

                        <button
                            onClick={handleResendEmail}
                            disabled={isResending || resendCooldown > 0}
                            style={{
                                width: "100%",
                                padding: "12px 24px",
                                background: resendCooldown > 0 ? theme.colors.neutrals[200] : "white",
                                color: resendCooldown > 0 ? theme.colors.neutrals[500] : theme.colors.neutrals[700],
                                border: `1px solid ${theme.colors.neutrals[300]}`,
                                borderRadius: "12px",
                                fontSize: "14px",
                                fontWeight: "500",
                                cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
                                transition: "all 0.2s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
                            }}
                        >
                            {isResending ? (
                                <>
                                    <RefreshCw size={16} className="animate-spin" />
                                    Reenviando...
                                </>
                            ) : resendCooldown > 0 ? (
                                <>
                                    <Clock size={16} />
                                    Reenviar em {resendCooldown}s
                                </>
                            ) : (
                                <>
                                    <Mail size={16} />
                                    Reenviar Email
                                </>
                            )}
                        </button>
                    </div>

                    {/* Help Text */}
                    <p
                        style={{
                            fontSize: "12px",
                            color: theme.colors.neutrals[500],
                            marginTop: "24px",
                            lineHeight: "1.4",
                        }}
                    >
                        Não recebeu o email? Verifique sua pasta de spam ou lixo eletrônico.
                        <br />
                        Se o problema persistir, entre em contato conosco.
                    </p>
                </div>
            </div>
        </div>
    );
};
