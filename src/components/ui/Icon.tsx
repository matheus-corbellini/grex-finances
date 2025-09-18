"use client";

import React from "react";

export interface IconProps {
    name: string;
    size?: number;
    color?: string;
    className?: string;
}

export const Icon: React.FC<IconProps> = ({
    name,
    size = 16,
    color = "currentColor",
    className = ""
}) => {
    const iconMap: Record<string, React.ReactNode> = {
        // Categorias
        "utensils": (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M3 2v7c0 1.1.9 2 2 2h4v11c0 .55.45 1 1 1s1-.45 1-1V11h4c1.1 0 2-.9 2-2V2c0-.55-.45-1-1-1s-1 .45-1 1v5H5V2c0-.55-.45-1-1-1s-1 .45-1 1z" />
                <path d="M19 2v7c0 1.1.9 2 2 2h2c.55 0 1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1v5h-2V2c0-.55-.45-1-1-1s-1 .45-1 1z" />
            </svg>
        ),
        "car": (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
            </svg>
        ),
        "money": (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
            </svg>
        ),
        "home": (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
        ),
        "shopping-cart": (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
        ),
        "heart": (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        ),
        "graduation-cap": (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
            </svg>
        ),
        "briefcase": (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M20 6h-3V4c0-1.11-.89-2-2-2H9c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-9-3h6v2h-6V3zm9 16H4V8h16v11z" />
            </svg>
        ),
        "gamepad": (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M15 7.5V2H9v5.5l3 3 3-3zM7.5 9H2v6h5.5l3-3-3-3zM9 16.5V22h6v-5.5l-3-3-3 3zM16.5 9l-3 3 3 3H22V9h-5.5z" />
            </svg>
        ),
        "airplane": (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
            </svg>
        ),
        "tag": (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z" />
            </svg>
        ),

        // Bancos
        "bank-sicredi": (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M12 2L2 7v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7l-10-5zM6 17H4v-2h2v2zm4 0H8v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm0-4H4V9h16v4z" />
            </svg>
        ),
        "bank-bb": (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M12 2L2 7v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7l-10-5zM6 17H4v-2h2v2zm4 0H8v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm0-4H4V9h16v4z" />
            </svg>
        ),
        "bank-itau": (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M12 2L2 7v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7l-10-5zM6 17H4v-2h2v2zm4 0H8v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm0-4H4V9h16v4z" />
            </svg>
        ),
        "bank-santander": (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M12 2L2 7v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7l-10-5zM6 17H4v-2h2v2zm4 0H8v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm0-4H4V9h16v4z" />
            </svg>
        ),
        "bank-bradesco": (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M12 2L2 7v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7l-10-5zM6 17H4v-2h2v2zm4 0H8v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm0-4H4V9h16v4z" />
            </svg>
        ),
        "bank-caixa": (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M12 2L2 7v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7l-10-5zM6 17H4v-2h2v2zm4 0H8v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm0-4H4V9h16v4z" />
            </svg>
        ),

        // Cartões e Transações
        "credit-card": (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
            </svg>
        ),
        "document": (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            </svg>
        ),

        // Outros
        "default": (
            <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
        )
    };

    return (
        <span className={`inline-flex items-center justify-center ${className}`}>
            {iconMap[name] || iconMap["default"]}
        </span>
    );
};
