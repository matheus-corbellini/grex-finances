"use client";

import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import {
    ZoomIn,
    ZoomOut,
    RotateCw,
    Download,
    Trash2,
    Check,
    X,
    Maximize2,
    Minimize2
} from "lucide-react";
import styles from "./ImagePreviewModal.module.css";

interface ImagePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    fileName: string;
    onConfirm?: () => void;
    onDelete?: () => void;
    onDownload?: () => void;
    showActions?: boolean;
}

export const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
    isOpen,
    onClose,
    imageUrl,
    fileName,
    onConfirm,
    onDelete,
    onDownload,
    showActions = true,
}) => {
    const [zoom, setZoom] = useState(100);
    const [rotation, setRotation] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 25, 300));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 25, 25));
    };

    const handleRotate = () => {
        setRotation(prev => (prev + 90) % 360);
    };

    const handleReset = () => {
        setZoom(100);
        setRotation(0);
    };

    const handleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete();
        }
        onClose();
    };

    const handleDownload = () => {
        if (onDownload) {
            onDownload();
        } else {
            // Default download behavior
            const link = document.createElement("a");
            link.href = imageUrl;
            link.download = fileName;
            link.click();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Preview: ${fileName}`}
        >
            <div className={styles.container}>
                <div className={styles.toolbar}>
                    <div className={styles.zoomControls}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleZoomOut}
                            icon={<ZoomOut size={16} />}
                            disabled={zoom <= 25}
                        >
                            Zoom Out
                        </Button>
                        <span className={styles.zoomLevel}>{zoom}%</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleZoomIn}
                            icon={<ZoomIn size={16} />}
                            disabled={zoom >= 300}
                        >
                            Zoom In
                        </Button>
                    </div>

                    <div className={styles.imageControls}>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRotate}
                            icon={<RotateCw size={16} />}
                        >
                            Rotate
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleFullscreen}
                            icon={isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        >
                            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                        </Button>
                    </div>

                    {showActions && (
                        <div className={styles.actionButtons}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDownload}
                                icon={<Download size={16} />}
                            >
                                Download
                            </Button>
                            {onDelete && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleDelete}
                                    icon={<Trash2 size={16} />}
                                >
                                    Excluir
                                </Button>
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.imageContainer}>
                    <div
                        className={styles.imageWrapper}
                        style={{
                            transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                        }}
                    >
                        <img
                            src={imageUrl}
                            alt={fileName}
                            className={styles.previewImage}
                        />
                    </div>
                </div>

                {showActions && onConfirm && (
                    <div className={styles.footer}>
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            icon={<X size={16} />}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleConfirm}
                            icon={<Check size={16} />}
                        >
                            Confirmar
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
};
