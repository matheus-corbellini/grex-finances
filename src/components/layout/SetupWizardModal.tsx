"use client";

import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import {
    ArrowRight,
    ArrowLeft,
    Building,
    MapPin,
    Palette,
    User,
    Settings,
    CheckCircle,
    X
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

interface ChurchData {
    // Informações básicas
    churchName: string;
    organizationType: string;
    document: string;
    phone: string;

    // Endereço
    zipCode: string;
    address: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;

    // Personalização
    logo: string;
    primaryColor: string;
    currency: string;
    language: string;

    // Usuário administrador
    adminName: string;
    adminEmail: string;
    adminPassword: string;
    confirmPassword: string;

    // Configurações gerais
    timezone: string;
    dateFormat: string;
    notifications: boolean;
}

interface SetupWizardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SetupWizardModal: React.FC<SetupWizardModalProps> = ({ isOpen, onClose }) => {
    const theme = useTheme();
    const [currentStep, setCurrentStep] = useState(1);
    const [churchData, setChurchData] = useState<ChurchData>({
        churchName: "",
        organizationType: "Igreja",
        document: "",
        phone: "",
        zipCode: "",
        address: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        logo: "",
        primaryColor: "#3b82f6",
        currency: "BRL",
        language: "pt-BR",
        adminName: "",
        adminEmail: "",
        adminPassword: "",
        confirmPassword: "",
        timezone: "America/Sao_Paulo",
        dateFormat: "DD/MM/YYYY",
        notifications: true,
    });

    const steps = [
        { id: 1, title: "Informações Básicas", icon: Building },
        { id: 2, title: "Endereço", icon: MapPin },
        { id: 3, title: "Personalização", icon: Palette },
        { id: 4, title: "Usuário Admin", icon: User },
        { id: 5, title: "Configurações", icon: Settings },
    ];

    const handleInputChange = (field: keyof ChurchData, value: string | boolean) => {
        setChurchData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        console.log('Dados da igreja salvos:', churchData);
        alert('Configuração da igreja salva com sucesso!');
        onClose();
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151"
                            }}>
                                Nome da Igreja *
                            </label>
                            <input
                                type="text"
                                value={churchData.churchName}
                                onChange={(e) => handleInputChange("churchName", e.target.value)}
                                placeholder="Ex: Igreja Batista Central"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    color: "#111827",
                                    backgroundColor: "white",
                                    outline: "none"
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151"
                            }}>
                                Tipo de Organização *
                            </label>
                            <select
                                value={churchData.organizationType}
                                onChange={(e) => handleInputChange("organizationType", e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    color: "#111827",
                                    backgroundColor: "white",
                                    outline: "none"
                                }}
                            >
                                <option value="Igreja">Igreja</option>
                                <option value="Ministério">Ministério</option>
                                <option value="Organização">Organização</option>
                            </select>
                        </div>

                        <div>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151"
                            }}>
                                CNPJ/CPF *
                            </label>
                            <input
                                type="text"
                                value={churchData.document}
                                onChange={(e) => handleInputChange("document", e.target.value)}
                                placeholder="00.000.000/0000-00"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    color: "#111827",
                                    backgroundColor: "white",
                                    outline: "none"
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151"
                            }}>
                                Telefone de Contato
                            </label>
                            <input
                                type="text"
                                value={churchData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                placeholder="(11) 99999-9999"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    color: "#111827",
                                    backgroundColor: "white",
                                    outline: "none"
                                }}
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px" }}>
                            <div>
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#374151"
                                }}>
                                    CEP *
                                </label>
                                <input
                                    type="text"
                                    value={churchData.zipCode}
                                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                                    placeholder="00000-000"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        color: "#111827",
                                        backgroundColor: "white",
                                        outline: "none"
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#374151"
                                }}>
                                    Endereço *
                                </label>
                                <input
                                    type="text"
                                    value={churchData.address}
                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                    placeholder="Rua, Avenida..."
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        color: "#111827",
                                        backgroundColor: "white",
                                        outline: "none"
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: "16px" }}>
                            <div>
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#374151"
                                }}>
                                    Número *
                                </label>
                                <input
                                    type="text"
                                    value={churchData.number}
                                    onChange={(e) => handleInputChange("number", e.target.value)}
                                    placeholder="123"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        color: "#111827",
                                        backgroundColor: "white",
                                        outline: "none"
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#374151"
                                }}>
                                    Complemento
                                </label>
                                <input
                                    type="text"
                                    value={churchData.complement}
                                    onChange={(e) => handleInputChange("complement", e.target.value)}
                                    placeholder="Apto, Sala..."
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        color: "#111827",
                                        backgroundColor: "white",
                                        outline: "none"
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#374151"
                                }}>
                                    Bairro *
                                </label>
                                <input
                                    type="text"
                                    value={churchData.neighborhood}
                                    onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                                    placeholder="Centro"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        color: "#111827",
                                        backgroundColor: "white",
                                        outline: "none"
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px" }}>
                            <div>
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#374151"
                                }}>
                                    Cidade *
                                </label>
                                <input
                                    type="text"
                                    value={churchData.city}
                                    onChange={(e) => handleInputChange("city", e.target.value)}
                                    placeholder="São Paulo"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        color: "#111827",
                                        backgroundColor: "white",
                                        outline: "none"
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#374151"
                                }}>
                                    Estado *
                                </label>
                                <input
                                    type="text"
                                    value={churchData.state}
                                    onChange={(e) => handleInputChange("state", e.target.value)}
                                    placeholder="SP"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        color: "#111827",
                                        backgroundColor: "white",
                                        outline: "none"
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151"
                            }}>
                                Cor Primária
                            </label>
                            <input
                                type="color"
                                value={churchData.primaryColor}
                                onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                                style={{
                                    width: "100%",
                                    height: "48px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    cursor: "pointer"
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151"
                            }}>
                                Moeda
                            </label>
                            <select
                                value={churchData.currency}
                                onChange={(e) => handleInputChange("currency", e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    color: "#111827",
                                    backgroundColor: "white",
                                    outline: "none"
                                }}
                            >
                                <option value="BRL">Real (BRL)</option>
                                <option value="USD">Dólar (USD)</option>
                                <option value="EUR">Euro (EUR)</option>
                            </select>
                        </div>

                        <div>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151"
                            }}>
                                Idioma
                            </label>
                            <select
                                value={churchData.language}
                                onChange={(e) => handleInputChange("language", e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    color: "#111827",
                                    backgroundColor: "white",
                                    outline: "none"
                                }}
                            >
                                <option value="pt-BR">Português (Brasil)</option>
                                <option value="en-US">English (US)</option>
                                <option value="es-ES">Español</option>
                            </select>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151"
                            }}>
                                Nome Completo *
                            </label>
                            <input
                                type="text"
                                value={churchData.adminName}
                                onChange={(e) => handleInputChange("adminName", e.target.value)}
                                placeholder="João Silva"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    color: "#111827",
                                    backgroundColor: "white",
                                    outline: "none"
                                }}
                            />
                        </div>

                        <div>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151"
                            }}>
                                E-mail *
                            </label>
                            <input
                                type="email"
                                value={churchData.adminEmail}
                                onChange={(e) => handleInputChange("adminEmail", e.target.value)}
                                placeholder="joao@igreja.com"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    color: "#111827",
                                    backgroundColor: "white",
                                    outline: "none"
                                }}
                            />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <div>
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#374151"
                                }}>
                                    Senha *
                                </label>
                                <input
                                    type="password"
                                    value={churchData.adminPassword}
                                    onChange={(e) => handleInputChange("adminPassword", e.target.value)}
                                    placeholder="Mínimo 8 caracteres"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        color: "#111827",
                                        backgroundColor: "white",
                                        outline: "none"
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#374151"
                                }}>
                                    Confirmar Senha *
                                </label>
                                <input
                                    type="password"
                                    value={churchData.confirmPassword}
                                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                    placeholder="Digite novamente"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "8px",
                                        fontSize: "14px",
                                        color: "#111827",
                                        backgroundColor: "white",
                                        outline: "none"
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        <div>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151"
                            }}>
                                Fuso Horário
                            </label>
                            <select
                                value={churchData.timezone}
                                onChange={(e) => handleInputChange("timezone", e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    color: "#111827",
                                    backgroundColor: "white",
                                    outline: "none"
                                }}
                            >
                                <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                                <option value="America/New_York">Nova York (GMT-5)</option>
                                <option value="Europe/London">Londres (GMT+0)</option>
                            </select>
                        </div>

                        <div>
                            <label style={{
                                display: "block",
                                marginBottom: "8px",
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151"
                            }}>
                                Formato de Data
                            </label>
                            <select
                                value={churchData.dateFormat}
                                onChange={(e) => handleInputChange("dateFormat", e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    color: "#111827",
                                    backgroundColor: "white",
                                    outline: "none"
                                }}
                            >
                                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            </select>
                        </div>

                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            padding: "16px",
                            backgroundColor: "#f8fafc",
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb"
                        }}>
                            <input
                                type="checkbox"
                                checked={churchData.notifications}
                                onChange={(e) => handleInputChange("notifications", e.target.checked)}
                                style={{
                                    width: "16px",
                                    height: "16px",
                                    cursor: "pointer"
                                }}
                            />
                            <label style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151",
                                cursor: "pointer"
                            }}>
                                Receber notificações por e-mail
                            </label>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px"
        }}>
            <div style={{
                backgroundColor: "white",
                borderRadius: "16px",
                width: "100%",
                maxWidth: "600px",
                maxHeight: "90vh",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column"
            }}>
                {/* Header */}
                <div style={{
                    padding: "24px 24px 0 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Building size={24} color="white" />
                        </div>
                        <div>
                            <h2 style={{
                                fontSize: "20px",
                                fontWeight: "600",
                                color: "#1f2937",
                                margin: "0 0 4px 0"
                            }}>
                                {steps[currentStep - 1].title}
                            </h2>
                            <p style={{
                                fontSize: "14px",
                                color: "#6b7280",
                                margin: "0"
                            }}>
                                Configure os dados da sua igreja
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "8px",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <X size={20} color="#6b7280" />
                    </button>
                </div>

                {/* Progress */}
                <div style={{
                    padding: "16px 24px 0 24px"
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}>
                        {steps.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    backgroundColor: currentStep >= step.id ? theme.colors.primary[600] : "#e5e7eb",
                                    color: currentStep >= step.id ? "white" : "#6b7280",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "14px",
                                    fontWeight: "600"
                                }}>
                                    {currentStep > step.id ? <CheckCircle size={16} /> : step.id}
                                </div>
                                {index < steps.length - 1 && (
                                    <div style={{
                                        flex: 1,
                                        height: "2px",
                                        backgroundColor: currentStep > step.id ? theme.colors.primary[600] : "#e5e7eb"
                                    }} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div style={{
                    padding: "24px",
                    flex: 1,
                    overflow: "auto"
                }}>
                    {renderStepContent()}
                </div>

                {/* Footer */}
                <div style={{
                    padding: "24px",
                    borderTop: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}>
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        style={{
                            padding: "12px 24px",
                            background: currentStep === 1 ? "#f3f4f6" : "white",
                            color: currentStep === 1 ? "#9ca3af" : "#374151",
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: currentStep === 1 ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        <ArrowLeft size={16} />
                        Anterior
                    </button>

                    <div style={{ display: "flex", gap: "12px" }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: "12px 24px",
                                background: "white",
                                color: "#6b7280",
                                border: "1px solid #d1d5db",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: "pointer"
                            }}
                        >
                            Cancelar
                        </button>
                        {currentStep === steps.length ? (
                            <button
                                onClick={handleSubmit}
                                style={{
                                    padding: "12px 24px",
                                    background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`,
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}
                            >
                                <CheckCircle size={16} />
                                Finalizar
                            </button>
                        ) : (
                            <button
                                onClick={nextStep}
                                style={{
                                    padding: "12px 24px",
                                    background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`,
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px"
                                }}
                            >
                                Próximo
                                <ArrowRight size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
