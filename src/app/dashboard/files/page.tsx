"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Modal } from "../../../components/ui/Modal";
import { UploadLogoModal } from "../../../components/modals/UploadLogoModal";
import {
    Upload,
    Search,
    Filter,
    Download,
    Trash2,
    Eye,
    FileText,
    Image,
    File,
    Calendar,
    User,
    MoreVertical
} from "lucide-react";
import styles from "./Files.module.css";

interface FileItem {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: Date;
    uploadedBy: string;
    category: string;
    url: string;
}

const mockFiles: FileItem[] = [
    {
        id: "1",
        name: "logo-igreja.png",
        type: "image/png",
        size: 1024000,
        uploadedAt: new Date("2024-01-15"),
        uploadedBy: "João Silva",
        category: "Logo",
        url: "/uploads/logo-igreja.png"
    },
    {
        id: "2",
        name: "relatorio-mensal.pdf",
        type: "application/pdf",
        size: 2048000,
        uploadedAt: new Date("2024-01-14"),
        uploadedBy: "Maria Santos",
        category: "Relatórios",
        url: "/uploads/relatorio-mensal.pdf"
    },
    {
        id: "3",
        name: "foto-evento.jpg",
        type: "image/jpeg",
        size: 3072000,
        uploadedAt: new Date("2024-01-13"),
        uploadedBy: "Pedro Costa",
        category: "Eventos",
        url: "/uploads/foto-evento.jpg"
    }
];

export default function FilesPage() {
    const [files, setFiles] = useState<FileItem[]>(mockFiles);
    const [filteredFiles, setFilteredFiles] = useState<FileItem[]>(mockFiles);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

    const categories = ["all", "Logo", "Relatórios", "Eventos", "Documentos", "Outros"];

    useEffect(() => {
        let filtered = files;

        if (searchTerm) {
            filtered = filtered.filter(file =>
                file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                file.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== "all") {
            filtered = filtered.filter(file => file.category === selectedCategory);
        }

        setFilteredFiles(filtered);
    }, [files, searchTerm, selectedCategory]);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith("image/")) return <Image size={20} />;
        if (type === "application/pdf") return <FileText size={20} />;
        return <File size={20} />;
    };

    const handleUpload = async (file: File) => {
        // Simulate upload
        const newFile: FileItem = {
            id: Date.now().toString(),
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: new Date(),
            uploadedBy: "Usuário Atual",
            category: "Outros",
            url: URL.createObjectURL(file)
        };

        setFiles(prev => [newFile, ...prev]);
    };

    const handleDelete = (fileId: string) => {
        if (confirm("Tem certeza que deseja excluir este arquivo?")) {
            setFiles(prev => prev.filter(file => file.id !== fileId));
        }
    };

    const handlePreview = (file: FileItem) => {
        setSelectedFile(file);
        setIsPreviewModalOpen(true);
    };

    const handleDownload = (file: FileItem) => {
        const link = document.createElement("a");
        link.href = file.url;
        link.download = file.name;
        link.click();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>Gerenciamento de Arquivos</h1>
                    <p>Gerencie todos os arquivos da igreja</p>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setIsUploadModalOpen(true)}
                    icon={<Upload size={20} />}
                >
                    Upload de Arquivo
                </Button>
            </div>

            <div className={styles.filters}>
                <div className={styles.searchSection}>
                    <div className={styles.searchInput}>
                        <Search size={20} />
                        <Input
                            placeholder="Buscar arquivos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.categoryFilter}>
                    <Filter size={20} />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={styles.select}
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category === "all" ? "Todas as categorias" : category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <h3>{files.length}</h3>
                    <p>Total de Arquivos</p>
                </div>
                <div className={styles.statCard}>
                    <h3>{formatFileSize(files.reduce((acc, file) => acc + file.size, 0))}</h3>
                    <p>Espaço Utilizado</p>
                </div>
                <div className={styles.statCard}>
                    <h3>{categories.length - 1}</h3>
                    <p>Categorias</p>
                </div>
            </div>

            <div className={styles.filesList}>
                <div className={styles.tableHeader}>
                    <div className={styles.headerCell}>Nome</div>
                    <div className={styles.headerCell}>Tipo</div>
                    <div className={styles.headerCell}>Tamanho</div>
                    <div className={styles.headerCell}>Categoria</div>
                    <div className={styles.headerCell}>Upload</div>
                    <div className={styles.headerCell}>Ações</div>
                </div>

                {filteredFiles.length === 0 ? (
                    <div className={styles.emptyState}>
                        <File size={48} />
                        <h3>Nenhum arquivo encontrado</h3>
                        <p>Faça upload de arquivos ou ajuste os filtros de busca</p>
                    </div>
                ) : (
                    filteredFiles.map(file => (
                        <div key={file.id} className={styles.fileRow}>
                            <div className={styles.fileInfo}>
                                <div className={styles.fileIcon}>
                                    {getFileIcon(file.type)}
                                </div>
                                <div className={styles.fileDetails}>
                                    <h4>{file.name}</h4>
                                    <p>por {file.uploadedBy}</p>
                                </div>
                            </div>
                            <div className={styles.fileType}>
                                {file.type.split('/')[1].toUpperCase()}
                            </div>
                            <div className={styles.fileSize}>
                                {formatFileSize(file.size)}
                            </div>
                            <div className={styles.fileCategory}>
                                <span className={styles.categoryBadge}>{file.category}</span>
                            </div>
                            <div className={styles.fileDate}>
                                <Calendar size={16} />
                                {file.uploadedAt.toLocaleDateString('pt-BR')}
                            </div>
                            <div className={styles.fileActions}>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handlePreview(file)}
                                    icon={<Eye size={16} />}
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDownload(file)}
                                    icon={<Download size={16} />}
                                />
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(file.id)}
                                    icon={<Trash2 size={16} />}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>

            <UploadLogoModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUpload={handleUpload}
            />

            {selectedFile && (
                <Modal
                    isOpen={isPreviewModalOpen}
                    onClose={() => setIsPreviewModalOpen(false)}
                    title={`Preview: ${selectedFile.name}`}
                >
                    <div className={styles.previewContent}>
                        {selectedFile.type.startsWith("image/") ? (
                            <img
                                src={selectedFile.url}
                                alt={selectedFile.name}
                                className={styles.previewImage}
                            />
                        ) : (
                            <div className={styles.previewFile}>
                                <FileText size={64} />
                                <p>Preview não disponível para este tipo de arquivo</p>
                                <Button
                                    variant="primary"
                                    onClick={() => handleDownload(selectedFile)}
                                    icon={<Download size={20} />}
                                >
                                    Baixar Arquivo
                                </Button>
                            </div>
                        )}
                    </div>
                </Modal>
            )}
        </div>
    );
}
