"use client";

import React from "react";
import { X, Tag, Palette, FileText, AlertCircle } from "lucide-react";

interface CategoryForm {
    name: string;
    type: string;
    parentId: string;
    description: string;
    color: string;
}

interface CategoryModalsProps {
    // Add Category Modal
    showAddCategoryModal: boolean;
    onCloseAddCategoryModal: () => void;

    // Edit Category Modal
    showEditCategoryModal: boolean;
    onCloseEditCategoryModal: () => void;

    // Delete Category Modal
    showDeleteCategoryModal: boolean;
    onCloseDeleteCategoryModal: () => void;
    deletingCategory: any;

    // Form data
    categoryForm: CategoryForm;
    onCategoryFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onSaveCategory: () => void;
    onConfirmDeleteCategory: () => void;
}

export const CategoryModals: React.FC<CategoryModalsProps> = ({
    showAddCategoryModal,
    onCloseAddCategoryModal,
    showEditCategoryModal,
    onCloseEditCategoryModal,
    showDeleteCategoryModal,
    onCloseDeleteCategoryModal,
    deletingCategory,
    categoryForm,
    onCategoryFormChange,
    onSaveCategory,
    onConfirmDeleteCategory
}) => {
    const renderAddCategoryModal = () => {
        if (!showAddCategoryModal) return null;

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
                                <Tag size={24} color="white" />
                            </div>
                            <div>
                                <h2 style={{
                                    fontSize: "20px",
                                    fontWeight: "600",
                                    color: "#1f2937",
                                    margin: "0 0 4px 0"
                                }}>
                                    Adicionar Categoria
                                </h2>
                                <p style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    margin: "0"
                                }}>
                                    Crie uma nova categoria de transação
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onCloseAddCategoryModal}
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
                                    Nome da Categoria *
                                </label>
                                <div style={{ position: "relative" }}>
                                    <Tag size={16} style={{
                                        position: "absolute",
                                        left: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#6b7280"
                                    }} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={categoryForm.name}
                                        onChange={onCategoryFormChange}
                                        placeholder="Ex: Despesas Administrativas"
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
                                    Tipo de Categoria *
                                </label>
                                <select
                                    name="type"
                                    value={categoryForm.type}
                                    onChange={onCategoryFormChange}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
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
                                    <option value="expense">Saída (Despesa)</option>
                                    <option value="income">Entrada (Receita)</option>
                                    <option value="other">Outros</option>
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
                                    Categoria Pai (Opcional)
                                </label>
                                <select
                                    name="parentId"
                                    value={categoryForm.parentId}
                                    onChange={onCategoryFormChange}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
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
                                    <option value="">Nenhuma (Categoria Principal)</option>
                                    <option value="1">Despesa com Pessoal</option>
                                    <option value="2">Despesa Administrativas</option>
                                    <option value="3">Receitas de Dízimos</option>
                                    <option value="4">Receitas de Ofertas</option>
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
                                    Cor da Categoria
                                </label>
                                <div style={{ position: "relative" }}>
                                    <Palette size={16} style={{
                                        position: "absolute",
                                        left: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#6b7280"
                                    }} />
                                    <input
                                        type="color"
                                        name="color"
                                        value={categoryForm.color}
                                        onChange={onCategoryFormChange}
                                        style={{
                                            width: "100%",
                                            height: "48px",
                                            padding: "0 0 0 40px",
                                            border: "1px solid #d1d5db",
                                            borderRadius: "8px",
                                            cursor: "pointer"
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
                                    Descrição
                                </label>
                                <div style={{ position: "relative" }}>
                                    <FileText size={16} style={{
                                        position: "absolute",
                                        left: "12px",
                                        top: "12px",
                                        color: "#6b7280"
                                    }} />
                                    <textarea
                                        name="description"
                                        value={categoryForm.description}
                                        onChange={onCategoryFormChange}
                                        placeholder="Descreva o propósito desta categoria..."
                                        rows={3}
                                        style={{
                                            width: "100%",
                                            padding: "12px 12px 12px 40px",
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
                            onClick={onCloseAddCategoryModal}
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
                            onClick={onSaveCategory}
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
                            Adicionar Categoria
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderEditCategoryModal = () => {
        if (!showEditCategoryModal) return null;

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
                                <Tag size={24} color="white" />
                            </div>
                            <div>
                                <h2 style={{
                                    fontSize: "20px",
                                    fontWeight: "600",
                                    color: "#1f2937",
                                    margin: "0 0 4px 0"
                                }}>
                                    Editar Categoria
                                </h2>
                                <p style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    margin: "0"
                                }}>
                                    Edite as informações da categoria
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onCloseEditCategoryModal}
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
                                    Nome da Categoria *
                                </label>
                                <div style={{ position: "relative" }}>
                                    <Tag size={16} style={{
                                        position: "absolute",
                                        left: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#6b7280"
                                    }} />
                                    <input
                                        type="text"
                                        name="name"
                                        value={categoryForm.name}
                                        onChange={onCategoryFormChange}
                                        placeholder="Ex: Despesas Administrativas"
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
                                    Tipo de Categoria *
                                </label>
                                <select
                                    name="type"
                                    value={categoryForm.type}
                                    onChange={onCategoryFormChange}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
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
                                    <option value="expense">Saída (Despesa)</option>
                                    <option value="income">Entrada (Receita)</option>
                                    <option value="other">Outros</option>
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
                                    Categoria Pai (Opcional)
                                </label>
                                <select
                                    name="parentId"
                                    value={categoryForm.parentId}
                                    onChange={onCategoryFormChange}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
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
                                    <option value="">Nenhuma (Categoria Principal)</option>
                                    <option value="1">Despesa com Pessoal</option>
                                    <option value="2">Despesa Administrativas</option>
                                    <option value="3">Receitas de Dízimos</option>
                                    <option value="4">Receitas de Ofertas</option>
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
                                    Cor da Categoria
                                </label>
                                <div style={{ position: "relative" }}>
                                    <Palette size={16} style={{
                                        position: "absolute",
                                        left: "12px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#6b7280"
                                    }} />
                                    <input
                                        type="color"
                                        name="color"
                                        value={categoryForm.color}
                                        onChange={onCategoryFormChange}
                                        style={{
                                            width: "100%",
                                            height: "48px",
                                            padding: "0 0 0 40px",
                                            border: "1px solid #d1d5db",
                                            borderRadius: "8px",
                                            cursor: "pointer"
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
                                    Descrição
                                </label>
                                <div style={{ position: "relative" }}>
                                    <FileText size={16} style={{
                                        position: "absolute",
                                        left: "12px",
                                        top: "12px",
                                        color: "#6b7280"
                                    }} />
                                    <textarea
                                        name="description"
                                        value={categoryForm.description}
                                        onChange={onCategoryFormChange}
                                        placeholder="Descreva o propósito desta categoria..."
                                        rows={3}
                                        style={{
                                            width: "100%",
                                            padding: "12px 12px 12px 40px",
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
                            onClick={onCloseEditCategoryModal}
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
                            onClick={onSaveCategory}
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

    const renderDeleteCategoryModal = () => {
        if (!showDeleteCategoryModal || !deletingCategory) return null;

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
                                <AlertCircle size={24} color="white" />
                            </div>
                            <div>
                                <h2 style={{
                                    fontSize: "20px",
                                    fontWeight: "600",
                                    color: "#1f2937",
                                    margin: "0 0 4px 0"
                                }}>
                                    Remover Categoria
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
                            onClick={onCloseDeleteCategoryModal}
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
                                Tem certeza que deseja remover a categoria <strong>{deletingCategory.name}</strong>?
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
                                borderRadius: "8px",
                                backgroundColor: deletingCategory.color || "#3b82f6",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Tag size={20} color="white" />
                            </div>
                            <div>
                                <h3 style={{
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    color: "#1f2937",
                                    margin: "0 0 4px 0"
                                }}>
                                    {deletingCategory.name}
                                </h3>
                                <p style={{
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    margin: "0"
                                }}>
                                    {deletingCategory.type === 'expense' ? 'Saída (Despesa)' :
                                        deletingCategory.type === 'income' ? 'Entrada (Receita)' : 'Outros'}
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
                            onClick={onCloseDeleteCategoryModal}
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
                            onClick={onConfirmDeleteCategory}
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
                            Remover Categoria
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {renderAddCategoryModal()}
            {renderEditCategoryModal()}
            {renderDeleteCategoryModal()}
        </>
    );
};
