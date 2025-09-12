"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    CheckCircle,
    Building,
    Phone,
    MapPin
} from "lucide-react";

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

export const FirstUserSetupPage: React.FC = () => {
    const theme = useTheme();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        // Dados pessoais
        firstName: "",
        lastName: "",
        email: "",
        phone: "",

        // Dados da igreja
        churchName: "",
        churchPhone: "",
        churchAddress: "",

        // Credenciais
        password: "",
        confirmPassword: "",

        // Preferências
        role: "admin",
        notifications: true,
        language: "pt-BR",
    });

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Validação de dados pessoais
        if (!formData.firstName.trim()) {
            newErrors.firstName = "Nome é obrigatório";
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Sobrenome é obrigatório";
        }
        if (!formData.email.trim()) {
            newErrors.email = "E-mail é obrigatório";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "E-mail inválido";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Telefone é obrigatório";
        }

        // Validação da igreja
        if (!formData.churchName.trim()) {
            newErrors.churchName = "Nome da igreja é obrigatório";
        }

        // Validação de senha
        if (!formData.password) {
            newErrors.password = "Senha é obrigatória";
        } else if (formData.password.length < 8) {
            newErrors.password = "Senha deve ter pelo menos 8 caracteres";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = "Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Senhas não coincidem";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));

        // Limpar erro do campo quando o usuário começar a digitar
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // TODO: Implementar chamada para API de criação do primeiro usuário
            console.log("Dados do primeiro usuário:", formData);

            // Simular delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log("Primeiro usuário criado com sucesso!");

            // Redirecionar para o wizard de configuração
            router.push("/setup");
        } catch (error) {
            console.error("Erro ao criar primeiro usuário:", error);
            setErrors({ general: "Erro ao criar conta. Tente novamente." });
        } finally {
            setIsLoading(false);
        }
    };

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
                    maxWidth: "500px",
                    background: "white",
                    borderRadius: "16px",
                    padding: "40px",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
                }}
            >
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div
                        style={{
                            width: "80px",
                            height: "80px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 24px",
                            boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
                        }}
                    >
                        <User size={40} color="white" />
                    </div>

                    <h1
                        style={{
                            fontSize: "24px",
                            fontWeight: "700",
                            color: "#1f2937",
                            margin: "0 0 8px 0",
                        }}
                    >
                        Configure sua conta
                    </h1>

                    <p
                        style={{
                            fontSize: "16px",
                            color: "#6b7280",
                            margin: "0",
                            lineHeight: "1.5",
                        }}
                    >
                        Complete seu perfil para começar a usar o Grex Finances
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Dados Pessoais */}
                    <div style={{ marginBottom: "32px" }}>
                        <h3
                            style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#1f2937",
                                margin: "0 0 20px 0",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <User size={20} />
                            Dados Pessoais
                        </h3>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                                    Nome *
                                </label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                    placeholder="Seu nome"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        border: errors.firstName ? "1px solid #ef4444" : "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        fontSize: "16px",
                                        boxSizing: "border-box",
                                    }}
                                />
                                {errors.firstName && (
                                    <p style={{ fontSize: "12px", color: "#ef4444", margin: "4px 0 0 0" }}>
                                        {errors.firstName}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                                    Sobrenome *
                                </label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                    placeholder="Seu sobrenome"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        border: errors.lastName ? "1px solid #ef4444" : "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        fontSize: "16px",
                                        boxSizing: "border-box",
                                    }}
                                />
                                {errors.lastName && (
                                    <p style={{ fontSize: "12px", color: "#ef4444", margin: "4px 0 0 0" }}>
                                        {errors.lastName}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                                E-mail *
                            </label>
                            <div style={{ position: "relative" }}>
                                <Mail
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
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    placeholder="seu@email.com"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px 12px 48px",
                                        border: errors.email ? "1px solid #ef4444" : "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        fontSize: "16px",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>
                            {errors.email && (
                                <p style={{ fontSize: "12px", color: "#ef4444", margin: "4px 0 0 0" }}>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                                Telefone *
                            </label>
                            <div style={{ position: "relative" }}>
                                <Phone
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
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    placeholder="(11) 99999-9999"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px 12px 48px",
                                        border: errors.phone ? "1px solid #ef4444" : "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        fontSize: "16px",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>
                            {errors.phone && (
                                <p style={{ fontSize: "12px", color: "#ef4444", margin: "4px 0 0 0" }}>
                                    {errors.phone}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Dados da Igreja */}
                    <div style={{ marginBottom: "32px" }}>
                        <h3
                            style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#1f2937",
                                margin: "0 0 20px 0",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <Building size={20} />
                            Dados da Igreja
                        </h3>

                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                                Nome da Igreja *
                            </label>
                            <input
                                type="text"
                                value={formData.churchName}
                                onChange={(e) => handleInputChange("churchName", e.target.value)}
                                placeholder="Ex: Igreja Batista Central"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: errors.churchName ? "1px solid #ef4444" : "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    boxSizing: "border-box",
                                }}
                            />
                            {errors.churchName && (
                                <p style={{ fontSize: "12px", color: "#ef4444", margin: "4px 0 0 0" }}>
                                    {errors.churchName}
                                </p>
                            )}
                        </div>

                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                                Telefone da Igreja
                            </label>
                            <input
                                type="tel"
                                value={formData.churchPhone}
                                onChange={(e) => handleInputChange("churchPhone", e.target.value)}
                                placeholder="(11) 3333-4444"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                                Endereço da Igreja
                            </label>
                            <div style={{ position: "relative" }}>
                                <MapPin
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
                                    type="text"
                                    value={formData.churchAddress}
                                    onChange={(e) => handleInputChange("churchAddress", e.target.value)}
                                    placeholder="Rua, número, bairro, cidade"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px 12px 48px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        fontSize: "16px",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Senha */}
                    <div style={{ marginBottom: "32px" }}>
                        <h3
                            style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#1f2937",
                                margin: "0 0 20px 0",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <Lock size={20} />
                            Segurança
                        </h3>

                        <div style={{ marginBottom: "16px" }}>
                            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                                Senha *
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
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    placeholder="Mínimo 8 caracteres"
                                    style={{
                                        width: "100%",
                                        padding: "12px 48px 12px 48px",
                                        border: errors.password ? "1px solid #ef4444" : "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        fontSize: "16px",
                                        boxSizing: "border-box",
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
                            {errors.password && (
                                <p style={{ fontSize: "12px", color: "#ef4444", margin: "4px 0 0 0" }}>
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>
                                Confirmar Senha *
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
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                    placeholder="Digite a senha novamente"
                                    style={{
                                        width: "100%",
                                        padding: "12px 48px 12px 48px",
                                        border: errors.confirmPassword ? "1px solid #ef4444" : "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        fontSize: "16px",
                                        boxSizing: "border-box",
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
                            {errors.confirmPassword && (
                                <p style={{ fontSize: "12px", color: "#ef4444", margin: "4px 0 0 0" }}>
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Erro geral */}
                    {errors.general && (
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
                                {errors.general}
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            width: "100%",
                            padding: "16px 24px",
                            background: isLoading ? "#9ca3af" : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            transition: "all 0.2s ease",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                        }}
                        onMouseOver={(e) => {
                            if (!isLoading) {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.4)";
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!isLoading) {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }
                        }}
                    >
                        {isLoading ? (
                            <>
                                <div
                                    style={{
                                        width: "16px",
                                        height: "16px",
                                        border: "2px solid transparent",
                                        borderTop: "2px solid white",
                                        borderRadius: "50%",
                                        animation: "spin 1s linear infinite",
                                    }}
                                />
                                Criando conta...
                            </>
                        ) : (
                            <>
                                <CheckCircle size={20} />
                                Criar conta e começar
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* CSS for spinner animation */}
            <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
        </div>
    );
};
