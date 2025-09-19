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

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        try {
            unsubscribe = firebaseAuthService.onAuthStateChanged((user) => {
                setUser(user);
                setLoading(false);
            });
        } catch (error) {
            console.error('Error setting up auth state listener:', error);
            setLoading(false);
        }

        return () => {
            if (unsubscribe) {
                try {
                    unsubscribe();
                } catch (error) {
                    console.error('Error unsubscribing from auth state:', error);
                }
            }
        };
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        try {
            const userData = await firebaseAuthService.login({ email, password });
            setUser(userData);
        } catch (error: any) {
            throw error;
        }
    };

    const register = async (userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
    }): Promise<void> => {
        try {
            const newUser = await firebaseAuthService.register(userData);
            setUser(newUser);
        } catch (error: any) {
            throw error;
        }
    };

    const loginWithGoogle = async (): Promise<void> => {
        try {
            const userData = await firebaseAuthService.loginWithGoogle();
            setUser(userData);
        } catch (error: any) {
            throw error;
        }
    };

    const loginWithFacebook = async (): Promise<void> => {
        try {
            const userData = await firebaseAuthService.loginWithFacebook();
            setUser(userData);
        } catch (error: any) {
            throw error;
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await firebaseAuthService.logout();
            setUser(null);
        } catch (error: any) {
            throw error;
        }
    };

    const forgotPassword = async (email: string): Promise<void> => {
        try {
            await firebaseAuthService.forgotPassword(email);
        } catch (error: any) {
            throw error;
        }
    };

    const changePassword = async (newPassword: string): Promise<void> => {
        try {
            await firebaseAuthService.changePassword(newPassword);
        } catch (error: any) {
            throw error;
        }
    };

    const resendVerificationEmail = async (): Promise<void> => {
        try {
            await firebaseAuthService.resendVerificationEmail();
        } catch (error: any) {
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
