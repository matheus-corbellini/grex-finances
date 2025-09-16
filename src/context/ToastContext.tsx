"use client";

import React, { createContext, useContext, ReactNode, useState, useCallback } from "react";
import { ToastContainer } from "../components/ui/ToastContainer";
import { ToastProps } from "../components/ui/Toast";

interface ToastContextType {
    toasts: ToastProps[];
    addToast: (toast: Omit<ToastProps, "id">) => string;
    removeToast: (id: string) => void;
    clearAllToasts: () => void;
    success: (message: string, options?: Partial<ToastProps>) => string;
    error: (message: string, options?: Partial<ToastProps>) => string;
    warning: (message: string, options?: Partial<ToastProps>) => string;
    info: (message: string, options?: Partial<ToastProps>) => string;
    loading: (message: string, options?: Partial<ToastProps>) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
    children: ReactNode;
    position?: ToastProps["position"];
    maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
    children,
    position = "top-right",
    maxToasts = 5,
}) => {
    const [toasts, setToasts] = useState<ToastProps[]>([]);

    const addToast = useCallback((toast: Omit<ToastProps, "id">) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast: ToastProps = {
            ...toast,
            id,
        };

        setToasts(prev => [newToast, ...prev]);
        return id;
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const clearAllToasts = useCallback(() => {
        setToasts([]);
    }, []);

    const success = useCallback((message: string, options?: Partial<ToastProps>) => {
        return addToast({
            message,
            type: "success",
            title: "Sucesso",
            duration: 4000,
            ...options,
        });
    }, [addToast]);

    const error = useCallback((message: string, options?: Partial<ToastProps>) => {
        return addToast({
            message,
            type: "error",
            title: "Erro",
            duration: 6000,
            ...options,
        });
    }, [addToast]);

    const warning = useCallback((message: string, options?: Partial<ToastProps>) => {
        return addToast({
            message,
            type: "warning",
            title: "Atenção",
            duration: 5000,
            ...options,
        });
    }, [addToast]);

    const info = useCallback((message: string, options?: Partial<ToastProps>) => {
        return addToast({
            message,
            type: "info",
            title: "Informação",
            duration: 4000,
            ...options,
        });
    }, [addToast]);

    const loading = useCallback((message: string, options?: Partial<ToastProps>) => {
        return addToast({
            message,
            type: "loading",
            title: "Carregando",
            duration: 0, // Loading toasts don't auto-dismiss
            ...options,
        });
    }, [addToast]);

    const contextValue: ToastContextType = {
        toasts,
        addToast,
        removeToast,
        clearAllToasts,
        success,
        error,
        warning,
        info,
        loading,
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <ToastContainer
                toasts={toasts}
                onRemoveToast={removeToast}
                position={position}
                maxToasts={maxToasts}
            />
        </ToastContext.Provider>
    );
};

export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
