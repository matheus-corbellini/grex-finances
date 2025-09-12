"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "../../context/ThemeContext";
import {
    Mail,
    User,
    Shield,
    Building,
    CheckCircle,
    AlertCircle,
    Eye,
    EyeOff,
    Lock
} from "lucide-react";

const SheepIcon = () => (
    <img
        src="/Group 75.png"
        alt="Sheep Icon"
        style={{
            width: "60px",
            height: "60px",
            filter: "brightness(0) invert(1)",
        }}
    />
);

export const AcceptInvitePage: React.FC = () => {
    const theme = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [step, setStep] = useState<'info' | 'password' | 'success' | 'error'>('info');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [inviteData, setInviteData] = useState({
        churchName: "Igreja Batista Central",
        inviterName: "Pastor João Silva",
        role: "Membro",
        department: "Administração"
    });
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false
    });

    useEffect(() => {
        // Simular carregamento dos dados do convite
        const token = searchParams.get('token');
        if (!token) {
            setStep('error');
            return;
        }

        // Simular busca dos dados do convite
        setTimeout(() => {
            // Em uma implementação real, você buscaria os dados do convite pela API
            console.log('Token do convite:', token);
        }, 1000);
    }, [searchParams]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validatePassword = (password: string) => {
        const minLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return {
            isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
            checks: {
                minLength,
                hasUpperCase,
                hasLowerCase,
                hasNumber,
                hasSpecialChar
            }
        };
    };

    const handleNextStep = () => {
        if (!formData.name || !formData.email) {
            alert('Nome e e-mail são obrigatórios!');
            return;
        }

        if (!formData.acceptTerms) {
            alert('Você deve aceitar os termos de uso!');
            return;
        }

        setStep('password');
    };

    const handleAcceptInvite = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.password || !formData.confirmPassword) {
            alert('Senha e confirmação são obrigatórias!');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }

        const passwordValidation = validatePassword(formData.password);
        if (!passwordValidation.isValid) {
            alert('A senha não atende aos critérios de segurança!');
            return;
        }

        setLoading(true);

        try {
            // Simular aceitação do convite
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Convite aceito:', { ...inviteData, ...formData });
            setStep('success');
        } catch (error) {
            console.error('Erro ao aceitar convite:', error);
            setStep('error');
        } finally {
            setLoading(false);
        }
    };

    const handleGoToDashboard = () => {
        router.push('/dashboard');
    };

    const passwordValidation = validatePassword(formData.password);

    const renderInfoStep = () => (
        <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "500px"
        }}>
            {/* Header */}
            <div style={{
                textAlign: "center",
                marginBottom: "32px"
            }}>
                <div style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "20px",
                    background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px auto"
                }}>
                    <Mail size={40} color="white" />
                </div>
                <h1 style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#1f2937",
                    margin: "0 0 8px 0"
                }}>
                    Convite Recebido!
                </h1>
                <p style={{
                    fontSize: "16px",
                    color: "#6b7280",
                    margin: "0"
                }}>
                    Você foi convidado para participar da igreja
                </p>
            </div>

            {/* Invite Info */}
            <div style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "32px"
            }}>
                <h3 style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#1f2937",
                    margin: "0 0 16px 0"
                }}>
                    Detalhes do Convite
                </h3>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px"
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                    }}>
                        <Building size={20} color="#6b7280" />
                        <div>
                            <span style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151"
                            }}>
                                Igreja:
                            </span>
                            <span style={{
                                fontSize: "14px",
                                color: "#6b7280",
                                marginLeft: "8px"
                            }}>
                                {inviteData.churchName}
                            </span>
                        </div>
                    </div>

                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                    }}>
                        <User size={20} color="#6b7280" />
                        <div>
                            <span style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151"
                            }}>
                                Convidado por:
                            </span>
                            <span style={{
                                fontSize: "14px",
                                color: "#6b7280",
                                marginLeft: "8px"
                            }}>
                                {inviteData.inviterName}
                            </span>
                        </div>
                    </div>

                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                    }}>
                        <Shield size={20} color="#6b7280" />
                        <div>
                            <span style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151"
                            }}>
                                Função:
                            </span>
                            <span style={{
                                fontSize: "14px",
                                color: "#6b7280",
                                marginLeft: "8px"
                            }}>
                                {inviteData.role}
                            </span>
                        </div>
                    </div>

                    {inviteData.department && (
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px"
                        }}>
                            <Building size={20} color="#6b7280" />
                            <div>
                                <span style={{
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "#374151"
                                }}>
                                    Departamento:
                                </span>
                                <span style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    marginLeft: "8px"
                                }}>
                                    {inviteData.department}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px"
            }}>
                <div>
                    <label style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151"
                    }}>
                        Nome Completo *
                    </label>
                    <div style={{ position: "relative" }}>
                        <User size={18} style={{
                            position: "absolute",
                            left: "16px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#6b7280"
                        }} />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Digite seu nome completo"
                            required
                            style={{
                                width: "100%",
                                padding: "16px 16px 16px 50px",
                                border: "2px solid #e5e7eb",
                                borderRadius: "12px",
                                fontSize: "16px",
                                color: "#111827",
                                backgroundColor: "white",
                                outline: "none",
                                transition: "border-color 0.2s ease"
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = theme.colors.primary[500];
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#e5e7eb";
                            }}
                        />
                    </div>
                </div>

                <div>
                    <label style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151"
                    }}>
                        E-mail *
                    </label>
                    <div style={{ position: "relative" }}>
                        <Mail size={18} style={{
                            position: "absolute",
                            left: "16px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#6b7280"
                        }} />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="seu@email.com"
                            required
                            style={{
                                width: "100%",
                                padding: "16px 16px 16px 50px",
                                border: "2px solid #e5e7eb",
                                borderRadius: "12px",
                                fontSize: "16px",
                                color: "#111827",
                                backgroundColor: "white",
                                outline: "none",
                                transition: "border-color 0.2s ease"
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = theme.colors.primary[500];
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#e5e7eb";
                            }}
                        />
                    </div>
                </div>

                <div>
                    <label style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151"
                    }}>
                        Telefone
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(11) 99999-9999"
                        style={{
                            width: "100%",
                            padding: "16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "16px",
                            color: "#111827",
                            backgroundColor: "white",
                            outline: "none",
                            transition: "border-color 0.2s ease"
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = theme.colors.primary[500];
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = "#e5e7eb";
                        }}
                    />
                </div>

                {/* Terms */}
                <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "16px",
                    backgroundColor: "#f8fafc",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px"
                }}>
                    <input
                        type="checkbox"
                        name="acceptTerms"
                        checked={formData.acceptTerms}
                        onChange={handleInputChange}
                        style={{
                            marginTop: "2px",
                            width: "16px",
                            height: "16px",
                            cursor: "pointer"
                        }}
                    />
                    <label style={{
                        fontSize: "14px",
                        color: "#374151",
                        cursor: "pointer",
                        lineHeight: "1.5"
                    }}>
                        Eu aceito os <a href="/terms" style={{ color: theme.colors.primary[600], textDecoration: "underline" }}>Termos de Uso</a> e a <a href="/privacy" style={{ color: theme.colors.primary[600], textDecoration: "underline" }}>Política de Privacidade</a> da plataforma.
                    </label>
                </div>

                {/* Button */}
                <button
                    type="submit"
                    style={{
                        padding: "16px 24px",
                        background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`,
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
                    Continuar
                </button>
            </form>
        </div>
    );

    const renderPasswordStep = () => (
        <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "500px"
        }}>
            {/* Header */}
            <div style={{
                textAlign: "center",
                marginBottom: "32px"
            }}>
                <div style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "20px",
                    background: `linear-gradient(135deg, #10b981 0%, #059669 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px auto"
                }}>
                    <Lock size={40} color="white" />
                </div>
                <h1 style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#1f2937",
                    margin: "0 0 8px 0"
                }}>
                    Criar Senha
                </h1>
                <p style={{
                    fontSize: "16px",
                    color: "#6b7280",
                    margin: "0"
                }}>
                    Defina uma senha segura para sua conta
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAcceptInvite} style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px"
            }}>
                <div>
                    <label style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151"
                    }}>
                        Nova Senha *
                    </label>
                    <div style={{ position: "relative" }}>
                        <Lock size={18} style={{
                            position: "absolute",
                            left: "16px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#6b7280"
                        }} />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Digite sua senha"
                            required
                            style={{
                                width: "100%",
                                padding: "16px 50px 16px 50px",
                                border: "2px solid #e5e7eb",
                                borderRadius: "12px",
                                fontSize: "16px",
                                color: "#111827",
                                backgroundColor: "white",
                                outline: "none",
                                transition: "border-color 0.2s ease"
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = theme.colors.primary[500];
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#e5e7eb";
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
                                color: "#6b7280"
                            }}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {/* Password Requirements */}
                    {formData.password && (
                        <div style={{
                            marginTop: "12px",
                            padding: "16px",
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px"
                        }}>
                            <p style={{
                                fontSize: "14px",
                                fontWeight: "500",
                                color: "#374151",
                                margin: "0 0 8px 0"
                            }}>
                                Requisitos da senha:
                            </p>
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px"
                            }}>
                                {[
                                    { text: "Mínimo 8 caracteres", valid: passwordValidation.checks.minLength },
                                    { text: "Pelo menos uma letra maiúscula", valid: passwordValidation.checks.hasUpperCase },
                                    { text: "Pelo menos uma letra minúscula", valid: passwordValidation.checks.hasLowerCase },
                                    { text: "Pelo menos um número", valid: passwordValidation.checks.hasNumber },
                                    { text: "Pelo menos um caractere especial", valid: passwordValidation.checks.hasSpecialChar }
                                ].map((requirement, index) => (
                                    <div key={index} style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        fontSize: "12px",
                                        color: requirement.valid ? "#10b981" : "#6b7280"
                                    }}>
                                        <div style={{
                                            width: "12px",
                                            height: "12px",
                                            borderRadius: "50%",
                                            backgroundColor: requirement.valid ? "#10b981" : "#d1d5db",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            {requirement.valid && <CheckCircle size={8} color="white" />}
                                        </div>
                                        {requirement.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div>
                    <label style={{
                        display: "block",
                        marginBottom: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151"
                    }}>
                        Confirmar Senha *
                    </label>
                    <div style={{ position: "relative" }}>
                        <Lock size={18} style={{
                            position: "absolute",
                            left: "16px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#6b7280"
                        }} />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirme sua senha"
                            required
                            style={{
                                width: "100%",
                                padding: "16px 50px 16px 50px",
                                border: "2px solid #e5e7eb",
                                borderRadius: "12px",
                                fontSize: "16px",
                                color: "#111827",
                                backgroundColor: "white",
                                outline: "none",
                                transition: "border-color 0.2s ease"
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = theme.colors.primary[500];
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#e5e7eb";
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
                                color: "#6b7280"
                            }}
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {/* Buttons */}
                <div style={{
                    display: "flex",
                    gap: "16px",
                    marginTop: "8px"
                }}>
                    <button
                        type="button"
                        onClick={() => setStep('info')}
                        style={{
                            flex: 1,
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
                        Voltar
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !passwordValidation.isValid}
                        style={{
                            flex: 2,
                            padding: "16px 24px",
                            background: loading || !passwordValidation.isValid ? "#9ca3af" : `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`,
                            color: "white",
                            border: "none",
                            borderRadius: "12px",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: loading || !passwordValidation.isValid ? "not-allowed" : "pointer",
                            transition: "all 0.2s ease"
                        }}
                        onMouseOver={(e) => {
                            if (!loading && passwordValidation.isValid) {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 8px 24px rgba(59, 130, 246, 0.4)";
                            }
                        }}
                        onMouseOut={(e) => {
                            if (!loading && passwordValidation.isValid) {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "none";
                            }
                        }}
                    >
                        {loading ? (
                            <>
                                <div style={{
                                    width: "20px",
                                    height: "20px",
                                    border: "2px solid rgba(255,255,255,0.3)",
                                    borderTop: "2px solid white",
                                    borderRadius: "50%",
                                    animation: "spin 1s linear infinite",
                                    display: "inline-block",
                                    marginRight: "8px"
                                }} />
                                Aceitando Convite...
                            </>
                        ) : (
                            "Aceitar Convite"
                        )}
                    </button>
                </div>
            </form>

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
            padding: "40px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "500px",
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

            <h1 style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#1f2937",
                margin: "0 0 16px 0"
            }}>
                Convite Aceito!
            </h1>

            <p style={{
                fontSize: "16px",
                color: "#6b7280",
                margin: "0 0 32px 0",
                lineHeight: "1.6"
            }}>
                Bem-vindo(a) à <strong>{inviteData.churchName}</strong>!<br />
                Sua conta foi criada com sucesso e você já pode acessar o sistema.
            </p>

            <button
                onClick={handleGoToDashboard}
                style={{
                    padding: "16px 32px",
                    background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`,
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
                Ir para o Dashboard
            </button>
        </div>
    );

    const renderError = () => (
        <div style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "40px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            width: "100%",
            maxWidth: "500px",
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

            <h1 style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#1f2937",
                margin: "0 0 16px 0"
            }}>
                Convite Inválido
            </h1>

            <p style={{
                fontSize: "16px",
                color: "#6b7280",
                margin: "0 0 32px 0",
                lineHeight: "1.6"
            }}>
                Este convite não é válido ou já expirou.<br />
                Entre em contato com quem enviou o convite para solicitar um novo.
            </p>

            <button
                onClick={() => router.push('/login')}
                style={{
                    padding: "16px 32px",
                    background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`,
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
                Ir para o Login
            </button>
        </div>
    );

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%)`,
            padding: "20px",
            position: "relative"
        }}>
            {/* Logo */}
            <div style={{
                position: "absolute",
                top: "20px",
                left: "20px"
            }}>
                <SheepIcon />
            </div>

            {/* Content */}
            {step === 'info' && renderInfoStep()}
            {step === 'password' && renderPasswordStep()}
            {step === 'success' && renderSuccess()}
            {step === 'error' && renderError()}
        </div>
    );
};
