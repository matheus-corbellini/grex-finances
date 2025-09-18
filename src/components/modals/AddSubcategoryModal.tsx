"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/TextArea";
import { Icon } from "../ui/Icon";
import { Plus, Tag, Palette, Type } from "lucide-react";
import { Category, CreateSubcategoryDto } from "../../../shared/types/category.types";
import styles from "./AddSubcategoryModal.module.css";

export interface AddSubcategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateSubcategoryDto) => void;
    categories: Category[];
    isLoading?: boolean;
}

export const AddSubcategoryModal: React.FC<AddSubcategoryModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    categories,
    isLoading = false
}) => {
    const [formData, setFormData] = useState<CreateSubcategoryDto>({
        categoryId: "",
        name: "",
        description: "",
        color: "#3b82f6",
        icon: "tag"
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const colorOptions = [
        { value: "#3b82f6", label: "Azul", color: "#3b82f6" },
        { value: "#10b981", label: "Verde", color: "#10b981" },
        { value: "#f59e0b", label: "Amarelo", color: "#f59e0b" },
        { value: "#ef4444", label: "Vermelho", color: "#ef4444" },
        { value: "#8b5cf6", label: "Roxo", color: "#8b5cf6" },
        { value: "#06b6d4", label: "Ciano", color: "#06b6d4" },
        { value: "#84cc16", label: "Lima", color: "#84cc16" },
        { value: "#f97316", label: "Laranja", color: "#f97316" }
    ];

    const iconOptions = [
        { value: "tag", label: "Tag", icon: "tag" },
        { value: "shopping-cart", label: "Carrinho", icon: "shopping-cart" },
        { value: "home", label: "Casa", icon: "home" },
        { value: "car", label: "Carro", icon: "car" },
        { value: "utensils", label: "Comida", icon: "utensils" },
        { value: "heart", label: "Saúde", icon: "heart" },
        { value: "graduation-cap", label: "Educação", icon: "graduation-cap" },
        { value: "briefcase", label: "Trabalho", icon: "briefcase" },
        { value: "gamepad", label: "Entretenimento", icon: "gamepad" },
        { value: "airplane", label: "Viagem", icon: "airplane" }
    ];

    const handleInputChange = (field: keyof CreateSubcategoryDto, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.categoryId) {
            newErrors.categoryId = "Selecione uma categoria";
        }

        if (!formData.name.trim()) {
            newErrors.name = "Nome é obrigatório";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Nome deve ter pelo menos 2 caracteres";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        onSubmit(formData);
    };

    const handleClose = () => {
        setFormData({
            categoryId: "",
            name: "",
            description: "",
            color: "#3b82f6",
            icon: "tag"
        });
        setErrors({});
        onClose();
    };

    const selectedCategory = categories.find(cat => cat.id === formData.categoryId);

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Adicionar Subcategoria" size="medium">
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        <Tag size={16} />
                        Categoria Pai *
                    </label>
                    <Select
                        value={formData.categoryId}
                        onChange={(value) => handleInputChange("categoryId", value)}
                        error={errors.categoryId}
                        placeholder="Selecione uma categoria"
                    >
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </Select>
                    {selectedCategory && (
                        <div className={styles.categoryPreview}>
                            <div
                                className={styles.categoryColor}
                                style={{ backgroundColor: selectedCategory.color }}
                            />
                            <span className={styles.categoryName}>{selectedCategory.name}</span>
                        </div>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        <Type size={16} />
                        Nome da Subcategoria *
                    </label>
                    <Input
                        type="text"
                        value={formData.name}
                        onChange={(value) => handleInputChange("name", value)}
                        placeholder="Ex: Supermercado, Farmácia, Gasolina..."
                        error={errors.name}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        <Type size={16} />
                        Descrição
                    </label>
                    <Textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Descrição opcional da subcategoria..."
                        rows={3}
                        maxLength={200}
                    />
                </div>

                <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            <Palette size={16} />
                            Cor
                        </label>
                        <div className={styles.colorGrid}>
                            {colorOptions.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    className={`${styles.colorOption} ${formData.color === color.value ? styles.colorOptionSelected : ""
                                        }`}
                                    onClick={() => handleInputChange("color", color.value)}
                                    style={{ backgroundColor: color.color }}
                                    title={color.label}
                                />
                            ))}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            <Tag size={16} />
                            Ícone
                        </label>
                        <div className={styles.iconGrid}>
                            {iconOptions.map((icon) => (
                                <button
                                    key={icon.value}
                                    type="button"
                                    className={`${styles.iconOption} ${formData.icon === icon.value ? styles.iconOptionSelected : ""
                                        }`}
                                    onClick={() => handleInputChange("icon", icon.value)}
                                    title={icon.label}
                                >
                                    <Icon name={icon.icon} size={20} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={styles.preview}>
                    <h4 className={styles.previewTitle}>Prévia da Subcategoria</h4>
                    <div className={styles.previewItem}>
                        <div
                            className={styles.previewIcon}
                            style={{ backgroundColor: formData.color }}
                        >
                            <Icon
                                name={iconOptions.find(icon => icon.value === formData.icon)?.icon || "tag"}
                                size={20}
                                color="white"
                            />
                        </div>
                        <div className={styles.previewContent}>
                            <div className={styles.previewName}>
                                {formData.name || "Nome da subcategoria"}
                            </div>
                            <div className={styles.previewDescription}>
                                {formData.description || "Descrição da subcategoria"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        loading={isLoading}
                        disabled={!formData.categoryId || !formData.name.trim()}
                    >
                        <Plus size={16} />
                        Adicionar Subcategoria
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
