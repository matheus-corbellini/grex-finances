"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import {
    ArrowRight,
    Building,
    Users,
    CreditCard,
    FileText,
    CheckCircle,
    Star,
    Zap,
    Shield,
    Heart
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

export const WelcomePage: React.FC = () => {
    const theme = useTheme();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "Bem-vindo ao Grex Finances!",
            subtitle: "Sua jornada para uma gestão financeira completa começa aqui",
            content: (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div
                        style={{
                            width: "120px",
                            height: "120px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 24px",
                            boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
                        }}
                    >
                        <SheepIcon />
                    </div>
                    <h2
                        style={{
                            fontSize: "28px",
                            fontWeight: "700",
                            color: "#1f2937",
                            margin: "0 0 12px 0",
                        }}
                    >
                        🎉 Parabéns!
                    </h2>
                    <p
                        style={{
                            fontSize: "18px",
                            color: "#6b7280",
                            margin: "0 0 32px 0",
                            lineHeight: "1.6",
                        }}
                    >
                        Sua conta foi criada com sucesso. Agora você tem acesso a todas as funcionalidades do Grex Finances.
                    </p>
                </div>
            ),
        },
        {
            title: "Principais Funcionalidades",
            subtitle: "Descubra o que você pode fazer com o Grex Finances",
            content: (
                <div style={{ padding: "20px 0" }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "20px",
                            marginBottom: "32px",
                        }}
                    >
                        <div
                            style={{
                                padding: "20px",
                                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                                borderRadius: "16px",
                                border: "1px solid #bae6fd",
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 12px",
                                }}
                            >
                                <Building size={24} color="white" />
                            </div>
                            <h3
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#1f2937",
                                    margin: "0 0 8px 0",
                                }}
                            >
                                Minha Igreja
                            </h3>
                            <p
                                style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    margin: "0",
                                    lineHeight: "1.5",
                                }}
                            >
                                Configure as informações da sua igreja e personalize o sistema
                            </p>
                        </div>

                        <div
                            style={{
                                padding: "20px",
                                background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                                borderRadius: "16px",
                                border: "1px solid #bbf7d0",
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 12px",
                                }}
                            >
                                <CreditCard size={24} color="white" />
                            </div>
                            <h3
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#1f2937",
                                    margin: "0 0 8px 0",
                                }}
                            >
                                Gestão Financeira
                            </h3>
                            <p
                                style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    margin: "0",
                                    lineHeight: "1.5",
                                }}
                            >
                                Controle receitas, despesas e relatórios financeiros completos
                            </p>
                        </div>

                        <div
                            style={{
                                padding: "20px",
                                background: "linear-gradient(135deg, #fef3f2 0%, #fee2e2 100%)",
                                borderRadius: "16px",
                                border: "1px solid #fecaca",
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 12px",
                                }}
                            >
                                <Users size={24} color="white" />
                            </div>
                            <h3
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#1f2937",
                                    margin: "0 0 8px 0",
                                }}
                            >
                                Gestão de Usuários
                            </h3>
                            <p
                                style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    margin: "0",
                                    lineHeight: "1.5",
                                }}
                            >
                                Adicione membros da equipe e configure permissões de acesso
                            </p>
                        </div>

                        <div
                            style={{
                                padding: "20px",
                                background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
                                borderRadius: "16px",
                                border: "1px solid #e9d5ff",
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 12px",
                                }}
                            >
                                <FileText size={24} color="white" />
                            </div>
                            <h3
                                style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#1f2937",
                                    margin: "0 0 8px 0",
                                }}
                            >
                                Relatórios Avançados
                            </h3>
                            <p
                                style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    margin: "0",
                                    lineHeight: "1.5",
                                }}
                            >
                                Gere relatórios detalhados e acompanhe o crescimento financeiro
                            </p>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: "Próximos Passos",
            subtitle: "Vamos configurar sua conta para começar",
            content: (
                <div style={{ padding: "20px 0" }}>
                    <div style={{ marginBottom: "32px" }}>
                        <h3
                            style={{
                                fontSize: "20px",
                                fontWeight: "600",
                                color: "#1f2937",
                                margin: "0 0 20px 0",
                                textAlign: "center",
                            }}
                        >
                            Recomendamos começar com:
                        </h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "16px",
                                    background: "#f9fafb",
                                    borderRadius: "12px",
                                    border: "1px solid #e5e7eb",
                                }}
                            >
                                <div
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "8px",
                                        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "16px",
                                    }}
                                >
                                    <span style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>1</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            color: "#1f2937",
                                            margin: "0 0 4px 0",
                                        }}
                                    >
                                        Configurar informações da igreja
                                    </h4>
                                    <p
                                        style={{
                                            fontSize: "14px",
                                            color: "#6b7280",
                                            margin: "0",
                                        }}
                                    >
                                        Adicione nome, endereço e logo da sua igreja
                                    </p>
                                </div>
                                <ArrowRight size={20} color="#9ca3af" />
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "16px",
                                    background: "#f9fafb",
                                    borderRadius: "12px",
                                    border: "1px solid #e5e7eb",
                                }}
                            >
                                <div
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "8px",
                                        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "16px",
                                    }}
                                >
                                    <span style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>2</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            color: "#1f2937",
                                            margin: "0 0 4px 0",
                                        }}
                                    >
                                        Adicionar contas bancárias
                                    </h4>
                                    <p
                                        style={{
                                            fontSize: "14px",
                                            color: "#6b7280",
                                            margin: "0",
                                        }}
                                    >
                                        Configure suas contas para começar a registrar transações
                                    </p>
                                </div>
                                <ArrowRight size={20} color="#9ca3af" />
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "16px",
                                    background: "#f9fafb",
                                    borderRadius: "12px",
                                    border: "1px solid #e5e7eb",
                                }}
                            >
                                <div
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        borderRadius: "8px",
                                        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginRight: "16px",
                                    }}
                                >
                                    <span style={{ color: "white", fontWeight: "600", fontSize: "14px" }}>3</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4
                                        style={{
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            color: "#1f2937",
                                            margin: "0 0 4px 0",
                                        }}
                                    >
                                        Criar categorias personalizadas
                                    </h4>
                                    <p
                                        style={{
                                            fontSize: "14px",
                                            color: "#6b7280",
                                            margin: "0",
                                        }}
                                    >
                                        Organize suas receitas e despesas com categorias específicas
                                    </p>
                                </div>
                                <ArrowRight size={20} color="#9ca3af" />
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleFinish();
        }
    };

    const handleSkip = () => {
        handleFinish();
    };

    const handleFinish = () => {
        router.push("/dashboard");
    };

    const currentStepData = steps[currentStep];

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
                    flex: "0.3",
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
                    {currentStepData.title}
                </h1>
                <p
                    style={{
                        fontSize: "18px",
                        opacity: 0.9,
                        margin: "0",
                        maxWidth: "500px",
                        lineHeight: "1.5",
                    }}
                >
                    {currentStepData.subtitle}
                </p>
            </div>

            {/* Bottom Section - Content */}
            <div
                style={{
                    flex: "0.7",
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
                        maxWidth: "600px",
                    }}
                >
                    {currentStepData.content}

                    {/* Progress Indicator */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: "32px",
                        }}
                    >
                        {steps.map((_, index) => (
                            <div
                                key={index}
                                style={{
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "50%",
                                    background: index === currentStep ? "#3b82f6" : "#e5e7eb",
                                    margin: "0 6px",
                                    transition: "all 0.2s ease",
                                }}
                            />
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div
                        style={{
                            display: "flex",
                            gap: "12px",
                            justifyContent: "center",
                        }}
                    >
                        {currentStep < steps.length - 1 && (
                            <button
                                onClick={handleSkip}
                                style={{
                                    padding: "16px 24px",
                                    background: "transparent",
                                    color: "#6b7280",
                                    border: "2px solid #e5e7eb",
                                    borderRadius: "12px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
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
                                Pular
                            </button>
                        )}

                        <button
                            onClick={handleNext}
                            style={{
                                padding: "16px 32px",
                                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: "12px",
                                fontSize: "16px",
                                fontWeight: "600",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                boxShadow: "0 4px 16px rgba(59, 130, 246, 0.3)",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
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
                            {currentStep === steps.length - 1 ? "Começar" : "Continuar"}
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
