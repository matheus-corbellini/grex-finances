"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "../../shared/types";
import firebaseAuthService from "../services/firebase-auth.service";

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
    const [loading, setLoading] = useState(true);

    // Escutar mudanças no estado de autenticação do Firebase
    useEffect(() => {
        console.log('🔥 Configurando listener de autenticação Firebase...');

        const unsubscribe = firebaseAuthService.onAuthStateChanged((firebaseUser) => {
            console.log('🔥 Estado de autenticação alterado:', firebaseUser?.email || 'Deslogado');
            setUser(firebaseUser);
            setLoading(false);
        });

        // Cleanup: remover listener quando o componente desmontar
        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        try {
            setLoading(true);
            console.log('🔐 Tentando login com:', email);

            const loggedUser = await firebaseAuthService.login({ email, password });

            console.log('✅ Login bem-sucedido:', loggedUser);
            setUser(loggedUser);
        } catch (error: any) {
            console.error('❌ Erro no login:', error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }): Promise<void> => {
        try {
            setLoading(true);
            console.log('📝 Registrando novo usuário:', userData.email);

            const newUser = await firebaseAuthService.register(userData);

            console.log('✅ Registro bem-sucedido:', newUser);
            setUser(newUser);
        } catch (error: any) {
            console.error('❌ Erro no registro:', error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const loginWithGoogle = async (): Promise<void> => {
        try {
            setLoading(true);
            console.log('🔐 Tentando login com Google...');

            const googleUser = await firebaseAuthService.loginWithGoogle();

            console.log('✅ Login com Google bem-sucedido:', googleUser);
            setUser(googleUser);
        } catch (error: any) {
            console.error('❌ Erro no login com Google:', error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const loginWithFacebook = async (): Promise<void> => {
        try {
            setLoading(true);
            console.log('🔐 Tentando login com Facebook...');

            const facebookUser = await firebaseAuthService.loginWithFacebook();

            console.log('✅ Login com Facebook bem-sucedido:', facebookUser);
            setUser(facebookUser);
        } catch (error: any) {
            console.error('❌ Erro no login com Facebook:', error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            console.log('👋 Fazendo logout...');

            await firebaseAuthService.logout();

            // Limpar localStorage
            if (typeof window !== "undefined") {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
            }

            console.log('✅ Logout bem-sucedido');
            setUser(null);
        } catch (error: any) {
            console.error('❌ Erro no logout:', error.message);
            throw error;
        }
    };

    const forgotPassword = async (email: string): Promise<void> => {
        try {
            console.log('📧 Enviando email de recuperação para:', email);

            await firebaseAuthService.forgotPassword(email);

            console.log('✅ Email de recuperação enviado');
        } catch (error: any) {
            console.error('❌ Erro ao enviar email de recuperação:', error.message);
            throw error;
        }
    };

    const changePassword = async (newPassword: string): Promise<void> => {
        try {
            console.log('🔒 Alterando senha...');

            await firebaseAuthService.changePassword(newPassword);

            console.log('✅ Senha alterada com sucesso');
        } catch (error: any) {
            console.error('❌ Erro ao alterar senha:', error.message);
            throw error;
        }
    };

    const resendVerificationEmail = async (): Promise<void> => {
        try {
            console.log('📧 Reenviando email de verificação...');

            await firebaseAuthService.resendVerificationEmail();

            console.log('✅ Email de verificação reenviado');
        } catch (error: any) {
            console.error('❌ Erro ao reenviar email:', error.message);
            throw error;
        }
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
