"use client";

import React, { useState, useRef } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Upload, X, Image as ImageIcon, Check } from "lucide-react";
import styles from "./UploadLogoModal.module.css";

interface UploadLogoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => Promise<void>;
    currentLogo?: string;
}

export const UploadLogoModal: React.FC<UploadLogoModalProps> = ({
    isOpen,
    onClose,
    onUpload,
    currentLogo,
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                alert("Por favor, selecione apenas arquivos de imagem.");
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("O arquivo deve ter no máximo 5MB.");
                return;
            }

            setSelectedFile(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 100);

            await onUpload(selectedFile);

            setUploadProgress(100);
            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
                setSelectedFile(null);
                setPreview(null);
                onClose();
            }, 500);
        } catch (error) {
            console.error("Erro no upload:", error);
            alert("Erro ao fazer upload do logo. Tente novamente.");
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleClose = () => {
        if (!isUploading) {
            setSelectedFile(null);
            setPreview(null);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Upload do Logo da Igreja">
            <div className={styles.container}>
                <div className={styles.currentLogo}>
                    <h3>Logo Atual</h3>
                    {currentLogo ? (
                        <div className={styles.logoPreview}>
                            <img src={currentLogo} alt="Logo atual" />
                        </div>
                    ) : (
                        <div className={styles.noLogo}>
                            <ImageIcon size={48} />
                            <p>Nenhum logo definido</p>
                        </div>
                    )}
                </div>

                <div className={styles.uploadSection}>
                    <h3>Novo Logo</h3>

                    {!selectedFile ? (
                        <div className={styles.uploadArea}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className={styles.fileInput}
                                id="logo-upload"
                            />
                            <label htmlFor="logo-upload" className={styles.uploadLabel}>
                                <Upload size={32} />
                                <p>Clique para selecionar uma imagem</p>
                                <span>PNG, JPG, GIF até 5MB</span>
                            </label>
                        </div>
                    ) : (
                        <div className={styles.selectedFile}>
                            <div className={styles.filePreview}>
                                <img src={preview || ""} alt="Preview" />
                                <button
                                    className={styles.removeButton}
                                    onClick={handleRemoveFile}
                                    disabled={isUploading}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <div className={styles.fileInfo}>
                                <p className={styles.fileName}>{selectedFile.name}</p>
                                <p className={styles.fileSize}>
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        </div>
                    )}

                    {isUploading && (
                        <div className={styles.uploadProgress}>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p>Fazendo upload... {uploadProgress}%</p>
                        </div>
                    )}
                </div>

                <div className={styles.actions}>
                    <Button
                        variant="secondary"
                        onClick={handleClose}
                        disabled={isUploading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                        loading={isUploading}
                    >
                        {isUploading ? "Enviando..." : "Fazer Upload"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
