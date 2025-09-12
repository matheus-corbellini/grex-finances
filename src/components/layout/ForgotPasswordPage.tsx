"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

const SheepIcon = () => (
    <img
        src="/Group 75.png"
        alt="Sheep Icon"
        style={{
            width: "40px",
            height: "40px",
            filter: "brightness(0) invert(1)", // Makes the image white
        }}
    />
);

export const ForgotPasswordPage: React.FC = () => {
    const theme = useTheme();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError("Por favor, insira seu e-mail");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // TODO: Implementar chamada para API de recuperação de senha
            // const response = await authService.forgotPassword({ email });

            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log("Email de recuperação enviado para:", email);
            setIsEmailSent(true);
        } catch (error) {
            console.error("Erro ao enviar email de recuperação:", error);
            setError("Erro ao enviar email. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        router.push("/login");
    };

    const handleResendEmail = () => {
        setIsEmailSent(false);
        setEmail("");
    };

    if (isEmailSent) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`,
                    padding: "20px",
                }}
            >
                {/* Icon at top */}
                <div
                    style={{
                        position: "absolute",
                        top: "40px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        opacity: 0.1,
                    }}
                >
                    <SheepIcon />
                </div>

                {/* Main Card */}
                <div
                    style={{
                        width: "100%",
                        maxWidth: "400px",
                        background: "white",
                        borderRadius: "16px",
                        padding: "40px",
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                        textAlign: "center",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: "24px",
                        }}
                    >
                        <div
                            style={{
                                width: "80px",
                                height: "80px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 8px 32px rgba(16, 185, 129, 0.3)",
                            }}
                        >
                            <CheckCircle size={40} color="white" />
                        </div>
                    </div>

                    <h1
                        style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "#1f2937",
                            margin: "0 0 8px 0",
                        }}
                    >
                        Email enviado!
                    </h1>

                    <p
                        style={{
                            fontSize: "16px",
                            color: "#6b7280",
                            margin: "0 0 32px 0",
                            lineHeight: "1.6",
                        }}
                    >
                        Enviamos um link de recuperação para{" "}
                        <strong style={{ color: "#1f2937" }}>{email}</strong>
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <button
                            onClick={handleResendEmail}
                            style={{
                                width: "100%",
                                padding: "12px 24px",
                                background: "#3b82f6",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "16px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = "#2563eb";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = "#3b82f6";
                            }}
                        >
                            Reenviar e-mail
                        </button>

                        <div
                            style={{
                                borderTop: "1px solid #e5e7eb",
                                paddingTop: "20px",
                                textAlign: "center",
                            }}
                        >
                            <button
                                onClick={handleBackToLogin}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "#3b82f6",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                    padding: "0",
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.color = "#2563eb";
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.color = "#3b82f6";
                                }}
                            >
                                Voltar ao login
                            </button>
                        </div>
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
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`,
                padding: "20px",
            }}
        >
            {/* Icon at top */}
            <div
                style={{
                    position: "absolute",
                    top: "40px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    opacity: 0.1,
                }}
            >
                <SheepIcon />
            </div>

            {/* Main Card */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "400px",
                    background: "white",
                    borderRadius: "16px",
                    padding: "40px",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <h1
                        style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "#1f2937",
                            margin: "0 0 8px 0",
                        }}
                    >
                        Recuperar senha
                    </h1>
                    <p
                        style={{
                            fontSize: "16px",
                            color: "#6b7280",
                            margin: "0",
                            lineHeight: "1.5",
                        }}
                    >
                        Digite seu e-mail para receber um link de recuperação
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "20px" }}>
                        <label
                            style={{
                                display: "block",
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#374151",
                                marginBottom: "8px",
                            }}
                        >
                            E-mail
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Seu email"
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                border: "1px solid #d1d5db",
                                borderRadius: "8px",
                                fontSize: "16px",
                                background: "white",
                                transition: "all 0.2s ease",
                                boxSizing: "border-box",
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#3b82f6";
                                e.target.style.outline = "none";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#d1d5db";
                            }}
                        />
                    </div>

                    {error && (
                        <div
                            style={{
                                padding: "12px 16px",
                                background: "#fef2f2",
                                border: "1px solid #fecaca",
                                borderRadius: "8px",
                                marginBottom: "20px",
                            }}
                        >
                            <p
                                style={{
                                    color: "#dc2626",
                                    fontSize: "14px",
                                    margin: "0",
                                }}
                            >
                                {error}
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: "100%",
                            padding: "12px 24px",
                            background: isLoading ? "#9ca3af" : "#3b82f6",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            transition: "all 0.2s ease",
                            marginBottom: "20px",
                        }}
                        onMouseOver={(e) => {
                            if (!isLoading) {
                                e.currentTarget.style.background = "#2563eb";
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!isLoading) {
                                e.currentTarget.style.background = "#3b82f6";
                            }
                        }}
                    >
                        {isLoading ? "Enviando..." : "Enviar link"}
                    </button>

                    <div
                        style={{
                            borderTop: "1px solid #e5e7eb",
                            paddingTop: "20px",
                            textAlign: "center",
                        }}
                    >
                        <button
                            type="button"
                            onClick={handleBackToLogin}
                            style={{
                                background: "none",
                                border: "none",
                                color: "#3b82f6",
                                fontSize: "14px",
                                cursor: "pointer",
                                textDecoration: "underline",
                                padding: "0",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.color = "#2563eb";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.color = "#3b82f6";
                            }}
                        >
                            Voltar ao login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
