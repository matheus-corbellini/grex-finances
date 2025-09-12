"use client";

import React, { useState } from "react";
import { X, Mail, User, Shield, Building, Send, CheckCircle, AlertCircle } from "lucide-react";

interface InviteForm {
    email: string;
    name: string;
    role: string;
    department: string;
    message: string;
}

interface InviteModalsProps {
    showInviteUserModal: boolean;
    onCloseInviteUserModal: () => void;
    inviteForm: InviteForm;
    onInviteFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onSendInvite: () => void;
}

export const InviteModals: React.FC<InviteModalsProps> = ({
    showInviteUserModal,
    onCloseInviteUserModal,
    inviteForm,
    onInviteFormChange,
    onSendInvite
}) => {
    const [step, setStep] = useState<'form' | 'success' | 'error'>('form');
    const [loading, setLoading] = useState(false);

    const handleSendInvite = async () => {
        setLoading(true);

        try {
            // Simular envio do convite
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Convite enviado:', inviteForm);
            setStep('success');
        } catch (error) {
            console.error('Erro ao enviar convite:', error);
            setStep('error');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setStep('form');
        setLoading(false);
        onCloseInviteUserModal();
    };

    const handleSendAnotherInvite = () => {
        setStep('form');
    };

    const renderInviteForm = () => (
        <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "500px",
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
                        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <Mail size={24} color="white" />
                    </div>
                    <div>
                        <h2 style={{
                            fontSize: "20px",
                            fontWeight: "600",
                            color: "#1f2937",
                            margin: "0 0 4px 0"
                        }}>
                            Convidar Usuário
                        </h2>
                        <p style={{
                            fontSize: "14px",
                            color: "#6b7280",
                            margin: "0"
                        }}>
                            Envie um convite por e-mail
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleCloseModal}
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

            {/* Content */}
            <div style={{
                padding: "24px",
                flex: 1,
                overflow: "auto"
            }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <label style={{
                            display: "block",
                            marginBottom: "8px",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151"
                        }}>
                            E-mail do Usuário *
                        </label>
                        <div style={{ position: "relative" }}>
                            <Mail size={16} style={{
                                position: "absolute",
                                left: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#6b7280"
                            }} />
                            <input
                                type="email"
                                name="email"
                                value={inviteForm.email}
                                onChange={onInviteFormChange}
                                placeholder="usuario@exemplo.com"
                                style={{
                                    width: "100%",
                                    padding: "12px 12px 12px 40px",
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
                        <div style={{ position: "relative" }}>
                            <User size={16} style={{
                                position: "absolute",
                                left: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#6b7280"
                            }} />
                            <input
                                type="text"
                                name="name"
                                value={inviteForm.name}
                                onChange={onInviteFormChange}
                                placeholder="Digite o nome completo"
                                style={{
                                    width: "100%",
                                    padding: "12px 12px 12px 40px",
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

                    <div>
                        <label style={{
                            display: "block",
                            marginBottom: "8px",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151"
                        }}>
                            Função
                        </label>
                        <div style={{ position: "relative" }}>
                            <Shield size={16} style={{
                                position: "absolute",
                                left: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#6b7280"
                            }} />
                            <select
                                name="role"
                                value={inviteForm.role}
                                onChange={onInviteFormChange}
                                style={{
                                    width: "100%",
                                    padding: "12px 12px 12px 40px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "8px",
                                    fontSize: "14px",
                                    color: "#111827",
                                    backgroundColor: "white",
                                    outline: "none",
                                    appearance: "none",
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: "right 12px center",
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "16px"
                                }}
                            >
                                <option value="Membro">Membro</option>
                                <option value="Líder">Líder</option>
                                <option value="Pastor">Pastor</option>
                                <option value="Administrador">Administrador</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{
                            display: "block",
                            marginBottom: "8px",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151"
                        }}>
                            Departamento
                        </label>
                        <div style={{ position: "relative" }}>
                            <Building size={16} style={{
                                position: "absolute",
                                left: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "#6b7280"
                            }} />
                            <input
                                type="text"
                                name="department"
                                value={inviteForm.department}
                                onChange={onInviteFormChange}
                                placeholder="Ex: Administração, Música, etc."
                                style={{
                                    width: "100%",
                                    padding: "12px 12px 12px 40px",
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

                    <div>
                        <label style={{
                            display: "block",
                            marginBottom: "8px",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#374151"
                        }}>
                            Mensagem Personalizada
                        </label>
                        <textarea
                            name="message"
                            value={inviteForm.message}
                            onChange={onInviteFormChange}
                            placeholder="Escreva uma mensagem personalizada para o convite..."
                            rows={3}
                            style={{
                                width: "100%",
                                padding: "12px",
                                border: "1px solid #d1d5db",
                                borderRadius: "8px",
                                fontSize: "14px",
                                color: "#111827",
                                backgroundColor: "white",
                                outline: "none",
                                resize: "vertical"
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                padding: "24px",
                borderTop: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px"
            }}>
                <button
                    onClick={handleCloseModal}
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
                <button
                    onClick={handleSendInvite}
                    disabled={loading}
                    style={{
                        padding: "12px 24px",
                        background: loading ? "#9ca3af" : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: loading ? "not-allowed" : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}
                >
                    {loading ? (
                        <>
                            <div style={{
                                width: "16px",
                                height: "16px",
                                border: "2px solid rgba(255,255,255,0.3)",
                                borderTop: "2px solid white",
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite"
                            }} />
                            Enviando...
                        </>
                    ) : (
                        <>
                            <Send size={16} />
                            Enviar Convite
                        </>
                    )}
                </button>
            </div>

            {/* CSS for spinner animation */}
            <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );

    const renderSuccess = () => (
        <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "500px",
            padding: "40px",
            textAlign: "center"
        }}>
            <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px auto"
            }}>
                <CheckCircle size={40} color="white" />
            </div>

            <h2 style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#1f2937",
                margin: "0 0 16px 0"
            }}>
                Convite Enviado!
            </h2>

            <p style={{
                fontSize: "16px",
                color: "#6b7280",
                margin: "0 0 32px 0",
                lineHeight: "1.6"
            }}>
                O convite foi enviado com sucesso para <strong>{inviteForm.email}</strong>.
                O usuário receberá um e-mail com as instruções para aceitar o convite.
            </p>

            <div style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center"
            }}>
                <button
                    onClick={handleCloseModal}
                    style={{
                        padding: "16px 24px",
                        background: "white",
                        color: "#6b7280",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
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
                    Fechar
                </button>
                <button
                    onClick={handleSendAnotherInvite}
                    style={{
                        padding: "16px 24px",
                        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.4)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    Enviar Outro Convite
                </button>
            </div>
        </div>
    );

    const renderError = () => (
        <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            width: "100%",
            maxWidth: "500px",
            padding: "40px",
            textAlign: "center"
        }}>
            <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px auto"
            }}>
                <AlertCircle size={40} color="white" />
            </div>

            <h2 style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#1f2937",
                margin: "0 0 16px 0"
            }}>
                Erro ao Enviar
            </h2>

            <p style={{
                fontSize: "16px",
                color: "#6b7280",
                margin: "0 0 32px 0",
                lineHeight: "1.6"
            }}>
                Ocorreu um erro ao enviar o convite. Verifique os dados e tente novamente.
            </p>

            <div style={{
                display: "flex",
                gap: "16px",
                justifyContent: "center"
            }}>
                <button
                    onClick={handleSendAnotherInvite}
                    style={{
                        padding: "16px 24px",
                        background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.4)";
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                >
                    Tentar Novamente
                </button>
                <button
                    onClick={handleCloseModal}
                    style={{
                        padding: "16px 24px",
                        background: "white",
                        color: "#6b7280",
                        border: "2px solid #e5e7eb",
                        borderRadius: "12px",
                        fontSize: "16px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
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
                    Fechar
                </button>
            </div>
        </div>
    );

    if (!showInviteUserModal) return null;

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
            {step === 'form' && renderInviteForm()}
            {step === 'success' && renderSuccess()}
            {step === 'error' && renderError()}
        </div>
    );
};
