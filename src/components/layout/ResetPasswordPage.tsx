"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

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

export const ResetPasswordPage: React.FC = () => {
    const theme = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
        const tokenParam = searchParams.get("token");
        if (!tokenParam) {
            router.push("/forgot-password");
            return;
        }
        setToken(tokenParam);
    }, [searchParams, router]);

    const validatePassword = (password: string) => {
        const minLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return {
            minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumbers,
            hasSpecialChar,
            isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
        };
    };

    const passwordValidation = validatePassword(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwordValidation.isValid) {
            setError("A senha não atende aos critérios de segurança");
            return;
        }

        if (password !== confirmPassword) {
            setError("As senhas não coincidem");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // TODO: Implementar chamada para API de redefinição de senha
            // const response = await authService.resetPassword({ token, password });

            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log("Senha redefinida com sucesso");
            setIsSuccess(true);
        } catch (error) {
            console.error("Erro ao redefinir senha:", error);
            setError("Erro ao redefinir senha. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        router.push("/loading");
    };

    if (isSuccess) {
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
                {/* Top Section - Welcome Text Centered */}
                <div
                    style={{
                        flex: "0.4",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "40px 20px",
                        textAlign: "center",
                        color: "white",
                    }}
                >
                    <div style={{ marginBottom: "20px" }}>
                        <SheepIcon />
                    </div>
                    <h1
                        style={{
                            fontSize: "32px",
                            fontWeight: "700",
                            margin: "0 0 8px 0",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Senha Redefinida!
                    </h1>
                    <p
                        style={{
                            fontSize: "18px",
                            opacity: 0.9,
                            margin: "0",
                            maxWidth: "400px",
                            lineHeight: "1.5",
                        }}
                    >
                        Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.
                    </p>
                </div>

                {/* Bottom Section - Success Message */}
                <div
                    style={{
                        flex: "0.6",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "40px 20px",
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        borderRadius: "24px 24px 0 0",
                        margin: "0 20px",
                        marginTop: "auto",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "400px",
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

                        <h2
                            style={{
                                fontSize: "24px",
                                fontWeight: "600",
                                color: "#1f2937",
                                margin: "0 0 12px 0",
                            }}
                        >
                            Tudo certo!
                        </h2>

                        <p
                            style={{
                                fontSize: "16px",
                                color: "#6b7280",
                                margin: "0 0 32px 0",
                                lineHeight: "1.6",
                            }}
                        >
                            Sua senha foi alterada com sucesso. Agora você pode fazer login normalmente.
                        </p>

                        <button
                            onClick={handleBackToLogin}
                            style={{
                                width: "100%",
                                padding: "16px 24px",
                                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.4)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 16px rgba(59, 130, 246, 0.3)";
                            }}
                        >
                            Continuar
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
            {/* Top Section - Welcome Text Centered */}
            <div
                style={{
                    flex: "0.4",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px 20px",
                    textAlign: "center",
                    color: "white",
                }}
            >
                <div style={{ marginBottom: "20px" }}>
                    <SheepIcon />
                </div>
                <h1
                    style={{
                        fontSize: "32px",
                        fontWeight: "700",
                        margin: "0 0 8px 0",
                        letterSpacing: "-0.02em",
                    }}
                >
                    Redefinir Senha
                </h1>
                <p
                    style={{
                        fontSize: "18px",
                        opacity: 0.9,
                        margin: "0",
                        maxWidth: "400px",
                        lineHeight: "1.5",
                    }}
                >
                    Digite sua nova senha abaixo. Certifique-se de que ela seja segura e fácil de lembrar.
                </p>
            </div>

            {/* Bottom Section - Form */}
            <div
                style={{
                    flex: "0.6",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "40px 20px",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "24px 24px 0 0",
                    margin: "0 20px",
                    marginTop: "auto",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "400px",
                    }}
                >
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
                                Nova Senha
                            </label>
                            <div style={{ position: "relative" }}>
                                <Lock
                                    size={20}
                                    style={{
                                        position: "absolute",
                                        left: "16px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#9ca3af",
                                    }}
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Digite sua nova senha"
                                    style={{
                                        width: "100%",
                                        padding: "16px 48px 16px 48px",
                                        border: "2px solid #e5e7eb",
                                        borderRadius: "12px",
                                        fontSize: "16px",
                                        background: "white",
                                        transition: "all 0.2s ease",
                                        boxSizing: "border-box",
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#3b82f6";
                                        e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#e5e7eb";
                                        e.target.style.boxShadow = "none";
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute",
                                        right: "16px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#9ca3af",
                                        padding: "4px",
                                    }}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Password Requirements */}
                            {password && (
                                <div
                                    style={{
                                        marginTop: "12px",
                                        padding: "12px",
                                        background: "#f9fafb",
                                        borderRadius: "8px",
                                        border: "1px solid #e5e7eb",
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            color: "#374151",
                                            margin: "0 0 8px 0",
                                        }}
                                    >
                                        Requisitos da senha:
                                    </p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <div
                                                style={{
                                                    width: "12px",
                                                    height: "12px",
                                                    borderRadius: "50%",
                                                    background: passwordValidation.minLength ? "#10b981" : "#e5e7eb",
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: "12px",
                                                    color: passwordValidation.minLength ? "#10b981" : "#6b7280",
                                                }}
                                            >
                                                Pelo menos 8 caracteres
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <div
                                                style={{
                                                    width: "12px",
                                                    height: "12px",
                                                    borderRadius: "50%",
                                                    background: passwordValidation.hasUpperCase ? "#10b981" : "#e5e7eb",
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: "12px",
                                                    color: passwordValidation.hasUpperCase ? "#10b981" : "#6b7280",
                                                }}
                                            >
                                                Uma letra maiúscula
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <div
                                                style={{
                                                    width: "12px",
                                                    height: "12px",
                                                    borderRadius: "50%",
                                                    background: passwordValidation.hasLowerCase ? "#10b981" : "#e5e7eb",
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: "12px",
                                                    color: passwordValidation.hasLowerCase ? "#10b981" : "#6b7280",
                                                }}
                                            >
                                                Uma letra minúscula
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <div
                                                style={{
                                                    width: "12px",
                                                    height: "12px",
                                                    borderRadius: "50%",
                                                    background: passwordValidation.hasNumbers ? "#10b981" : "#e5e7eb",
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: "12px",
                                                    color: passwordValidation.hasNumbers ? "#10b981" : "#6b7280",
                                                }}
                                            >
                                                Um número
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <div
                                                style={{
                                                    width: "12px",
                                                    height: "12px",
                                                    borderRadius: "50%",
                                                    background: passwordValidation.hasSpecialChar ? "#10b981" : "#e5e7eb",
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: "12px",
                                                    color: passwordValidation.hasSpecialChar ? "#10b981" : "#6b7280",
                                                }}
                                            >
                                                Um caractere especial
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    color: "#374151",
                                    marginBottom: "8px",
                                }}
                            >
                                Confirmar Nova Senha
                            </label>
                            <div style={{ position: "relative" }}>
                                <Lock
                                    size={20}
                                    style={{
                                        position: "absolute",
                                        left: "16px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#9ca3af",
                                    }}
                                />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirme sua nova senha"
                                    style={{
                                        width: "100%",
                                        padding: "16px 48px 16px 48px",
                                        border: "2px solid #e5e7eb",
                                        borderRadius: "12px",
                                        fontSize: "16px",
                                        background: "white",
                                        transition: "all 0.2s ease",
                                        boxSizing: "border-box",
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#3b82f6";
                                        e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#e5e7eb";
                                        e.target.style.boxShadow = "none";
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{
                                        position: "absolute",
                                        right: "16px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#9ca3af",
                                        padding: "4px",
                                    }}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div
                                style={{
                                    padding: "12px 16px",
                                    background: "#fef2f2",
                                    border: "1px solid #fecaca",
                                    borderRadius: "8px",
                                    marginBottom: "24px",
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
                            disabled={isLoading || !passwordValidation.isValid || password !== confirmPassword}
                            style={{
                                width: "100%",
                                padding: "16px 24px",
                                background: isLoading || !passwordValidation.isValid || password !== confirmPassword
                                    ? "#9ca3af"
                                    : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: "600",
                                cursor: isLoading || !passwordValidation.isValid || password !== confirmPassword ? "not-allowed" : "pointer",
                                transition: "all 0.2s ease",
                                boxShadow: isLoading || !passwordValidation.isValid || password !== confirmPassword
                                    ? "none"
                                    : "0 4px 16px rgba(59, 130, 246, 0.3)",
                                marginBottom: "24px",
                            }}
                            onMouseOver={(e) => {
                                if (!isLoading && passwordValidation.isValid && password === confirmPassword) {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.4)";
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!isLoading && passwordValidation.isValid && password === confirmPassword) {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(59, 130, 246, 0.3)";
                                }
                            }}
                        >
                            {isLoading ? "Redefinindo..." : "Redefinir Senha"}
                        </button>

                        <button
                            type="button"
                            onClick={handleBackToLogin}
                            style={{
                                width: "100%",
                                padding: "16px 24px",
                                background: "transparent",
                                color: "#6b7280",
                                border: "2px solid #e5e7eb",
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
                                e.currentTarget.style.borderColor = "#d1d5db";
                                e.currentTarget.style.color = "#374151";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.borderColor = "#e5e7eb";
                                e.currentTarget.style.color = "#6b7280";
                            }}
                        >
                            <ArrowLeft size={16} />
                            Voltar ao login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
