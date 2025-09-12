"use client";

import React from "react";
import { X, User, Mail, Phone, Building, Shield } from "lucide-react";

interface UserForm {
    name: string;
    email: string;
    role: string;
    phone: string;
    department: string;
}

interface UserModalsProps {
    // Add User Modal
    showAddUserModal: boolean;
    onCloseAddUserModal: () => void;

    // Edit User Modal
    showEditUserModal: boolean;
    onCloseEditUserModal: () => void;

    // Delete User Modal
    showDeleteUserModal: boolean;
    onCloseDeleteUserModal: () => void;
    deletingUser: any;

    // Form data
    userForm: UserForm;
    onUserFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSaveUser: () => void;
    onConfirmDeleteUser: () => void;
}

export const UserModals: React.FC<UserModalsProps> = ({
    showAddUserModal,
    onCloseAddUserModal,
    showEditUserModal,
    onCloseEditUserModal,
    showDeleteUserModal,
    onCloseDeleteUserModal,
    deletingUser,
    userForm,
    onUserFormChange,
    onSaveUser,
    onConfirmDeleteUser
}) => {
    const renderAddUserModal = () => {
        if (!showAddUserModal) return null;

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
                                <User size={24} color="white" />
                            </div>
                            <div>
                                <h2 style={{
                                    fontSize: "20px",
                                    fontWeight: "600",
                                    color: "#1f2937",
                                    margin: "0 0 4px 0"
                                }}>
                                    Adicionar Usuário
                                </h2>
                                <p style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    margin: "0"
                                }}>
                                    Adicione um novo usuário à sua conta
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onCloseAddUserModal}
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
                                        value={userForm.name}
                                        onChange={onUserFormChange}
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
                                    E-mail *
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
                                        value={userForm.email}
                                        onChange={onUserFormChange}
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
                                    Telefone
                                </label>
                                <div style={{ position: "relative" }}>
                                    <Phone size={16} style={{
                                        position: "absolute",
                                        left: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#6b7280"
                                    }} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={userForm.phone}
                                        onChange={onUserFormChange}
                                        placeholder="(11) 99999-9999"
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
                                        value={userForm.department}
                                        onChange={onUserFormChange}
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
                                    Função *
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
                                        value={userForm.role}
                                        onChange={onUserFormChange}
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
                            onClick={onCloseAddUserModal}
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
                            onClick={onSaveUser}
                            style={{
                                padding: "12px 24px",
                                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: "pointer"
                            }}
                        >
                            Adicionar Usuário
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderEditUserModal = () => {
        if (!showEditUserModal) return null;

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
                                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <User size={24} color="white" />
                            </div>
                            <div>
                                <h2 style={{
                                    fontSize: "20px",
                                    fontWeight: "600",
                                    color: "#1f2937",
                                    margin: "0 0 4px 0"
                                }}>
                                    Editar Usuário
                                </h2>
                                <p style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    margin: "0"
                                }}>
                                    Edite as informações do usuário
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onCloseEditUserModal}
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
                                        value={userForm.name}
                                        onChange={onUserFormChange}
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
                                    E-mail *
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
                                        value={userForm.email}
                                        onChange={onUserFormChange}
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
                                    Telefone
                                </label>
                                <div style={{ position: "relative" }}>
                                    <Phone size={16} style={{
                                        position: "absolute",
                                        left: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#6b7280"
                                    }} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={userForm.phone}
                                        onChange={onUserFormChange}
                                        placeholder="(11) 99999-9999"
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
                                        value={userForm.department}
                                        onChange={onUserFormChange}
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
                                    Função *
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
                                        value={userForm.role}
                                        onChange={onUserFormChange}
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
                            onClick={onCloseEditUserModal}
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
                            onClick={onSaveUser}
                            style={{
                                padding: "12px 24px",
                                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: "pointer"
                            }}
                        >
                            Salvar Alterações
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderDeleteUserModal = () => {
        if (!showDeleteUserModal || !deletingUser) return null;

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
                    maxWidth: "400px",
                    overflow: "hidden"
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
                                background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <X size={24} color="white" />
                            </div>
                            <div>
                                <h2 style={{
                                    fontSize: "20px",
                                    fontWeight: "600",
                                    color: "#1f2937",
                                    margin: "0 0 4px 0"
                                }}>
                                    Remover Usuário
                                </h2>
                                <p style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    margin: "0"
                                }}>
                                    Esta ação não pode ser desfeita
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onCloseDeleteUserModal}
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
                        padding: "24px"
                    }}>
                        <div style={{
                            backgroundColor: "#fef2f2",
                            border: "1px solid #fecaca",
                            borderRadius: "8px",
                            padding: "16px",
                            marginBottom: "20px"
                        }}>
                            <p style={{
                                fontSize: "14px",
                                color: "#dc2626",
                                margin: "0",
                                fontWeight: "500"
                            }}>
                                Tem certeza que deseja remover o usuário <strong>{deletingUser.name}</strong>?
                            </p>
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
                            <div style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: "#f3f4f6",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#6b7280"
                            }}>
                                {deletingUser.initials}
                            </div>
                            <div>
                                <h3 style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#1f2937",
                                    margin: "0 0 4px 0"
                                }}>
                                    {deletingUser.name}
                                </h3>
                                <p style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    margin: "0"
                                }}>
                                    {deletingUser.email}
                                </p>
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
                            onClick={onCloseDeleteUserModal}
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
                            onClick={onConfirmDeleteUser}
                            style={{
                                padding: "12px 24px",
                                background: "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "14px",
                                fontWeight: "600",
                                cursor: "pointer"
                            }}
                        >
                            Remover Usuário
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {renderAddUserModal()}
            {renderEditUserModal()}
            {renderDeleteUserModal()}
        </>
    );
};
