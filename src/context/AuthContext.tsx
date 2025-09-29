"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "../../shared/types";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    loginWithFacebook: () => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    changePassword: (newPassword: string) => Promise<void>;
    resendVerificationEmail: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    // Simular um usuário logado automaticamente
    useEffect(() => {
        // Criar um usuário mock para simular login automático
        const mockUser: User = {
            id: "mock-user-id",
            email: "usuario@exemplo.com",
            firstName: "Usuário",
            lastName: "Exemplo",
            isActive: true,
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        
        // Simular um pequeno delay de carregamento
        setTimeout(() => {
            setUser(mockUser);
            setLoading(false);
        }, 500);
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        // Simular login sem validação real
        const mockUser: User = {
            id: "mock-user-id",
            email: email,
            firstName: "Usuário",
            lastName: "Exemplo",
            isActive: true,
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        
        setUser(mockUser);
    };

    const register = async (userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }): Promise<void> => {
        // Simular registro sem validação real
        const mockUser: User = {
            id: "mock-user-id",
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            isActive: true,
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        
        setUser(mockUser);
    };

    const loginWithGoogle = async (): Promise<void> => {
        // Simular login com Google
        const mockUser: User = {
            id: "mock-google-user-id",
            email: "usuario@gmail.com",
            firstName: "Google",
            lastName: "User",
            isActive: true,
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        
        setUser(mockUser);
    };

    const loginWithFacebook = async (): Promise<void> => {
        // Simular login com Facebook
        const mockUser: User = {
            id: "mock-facebook-user-id",
            email: "usuario@facebook.com",
            firstName: "Facebook",
            lastName: "User",
            isActive: true,
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        
        setUser(mockUser);
    };

    const logout = async (): Promise<void> => {
        setUser(null);
    };

    const forgotPassword = async (email: string): Promise<void> => {
        // Simular envio de email de recuperação
        console.log(`Email de recuperação enviado para: ${email}`);
    };

    const changePassword = async (newPassword: string): Promise<void> => {
        // Simular mudança de senha
        console.log("Senha alterada com sucesso");
    };

    const resendVerificationEmail = async (): Promise<void> => {
        // Simular reenvio de email de verificação
        console.log("Email de verificação reenviado");
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        loginWithFacebook,
        logout,
        forgotPassword,
        changePassword,
        resendVerificationEmail,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
