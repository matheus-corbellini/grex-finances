/**
 * Configuração do Firebase
 * 
 * Serviços utilizados:
 * - Firebase Authentication (getAuth) - Login e autenticação
 * - Firestore Database (getFirestore) - Armazenamento de dados dos usuários
 * 
 * Serviços NÃO utilizados:
 * - Cloud Storage
 * - Cloud Functions
 * - Realtime Database
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase com valores padrão (fallback)
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDTniBYkusXUI_WOs38ui3H9o4sj8r78b0",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "grex-2afe3.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "grex-2afe3",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "grex-2afe3.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "228214548843",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:228214548843:web:1ce2c9bf23b45f0c95042e",
};

// Inicializa o Firebase App
let app;
try {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase inicializado com sucesso');
} catch (error: any) {
    if (error.code === 'app/duplicate-app') {
        console.warn('⚠️  Firebase app já foi inicializado');
    } else {
        console.error('❌ Erro ao inicializar Firebase:', error);
        throw error;
    }
}

// Exporta os serviços configurados
export const auth = getAuth(app);
export const db = getFirestore(app);
