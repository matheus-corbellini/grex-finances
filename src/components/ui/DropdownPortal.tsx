"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface DropdownPortalProps {
    isOpen: boolean;
    onClose: () => void;
    triggerRef: React.RefObject<HTMLElement>;
    children: React.ReactNode;
    className?: string;
}

export const DropdownPortal: React.FC<DropdownPortalProps> = ({
    isOpen,
    onClose,
    triggerRef,
    children,
    className = ''
}) => {
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const dropdownHeight = 200; // Altura estimada do dropdown
            const dropdownWidth = 150; // Largura estimada do dropdown

            let top = triggerRect.bottom + 4;
            let left = triggerRect.left;

            // Verificar se o dropdown cabe na tela
            if (top + dropdownHeight > window.innerHeight) {
                top = triggerRect.top - dropdownHeight - 4;
            }

            if (left + dropdownWidth > window.innerWidth) {
                left = window.innerWidth - dropdownWidth - 10;
            }

            setPosition({ top, left });
        }
    }, [isOpen, triggerRef]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen, onClose, triggerRef]);

    if (!isOpen) return null;

    return createPortal(
        <div
            ref={dropdownRef}
            className={className}
            style={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                zIndex: 99999,
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                minWidth: '150px',
                maxHeight: '200px',
                overflowY: 'auto',
                animation: 'fadeIn 0.2s ease-out'
            }}
        >
            {children}
        </div>,
        document.body
    );
};
