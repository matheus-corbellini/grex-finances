/**
 * Script para criar usuário padrão no Firebase
 * 
 * Usuário: grex@gmail.com
 * Senha: 123456
 * 
 * Uso: npx ts-node scripts/create-default-user.ts
 */

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDTniBYkusXUI_WOs38ui3H9o4sj8r78b0",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "grex-2afe3.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "grex-2afe3",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "grex-2afe3.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "228214548843",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:228214548843:web:1ce2c9bf23b45f0c95042e",
};

async function createDefaultUser() {
    console.log('🔥 Iniciando criação de usuário padrão...\n');

    try {
        // Inicializar Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        console.log('✅ Firebase inicializado');

        // Dados do usuário padrão
        const defaultUser = {
            email: 'grex@gmail.com',
            password: '123456',
            firstName: 'Grex',
            lastName: 'Admin',
        };

        console.log(`\n📝 Criando usuário: ${defaultUser.email}`);

        // Criar usuário no Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            defaultUser.email,
            defaultUser.password
        );

        console.log(`✅ Usuário criado no Authentication (UID: ${userCredential.user.uid})`);

        // Atualizar perfil com nome
        await updateProfile(userCredential.user, {
            displayName: `${defaultUser.firstName} ${defaultUser.lastName}`,
        });

        console.log('✅ Perfil atualizado');

        // Criar documento no Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
            email: defaultUser.email,
            firstName: defaultUser.firstName,
            lastName: defaultUser.lastName,
            isActive: true,
            emailVerified: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        console.log('✅ Usuário criado no Firestore');

        console.log('\n🎉 Usuário padrão criado com sucesso!');
        console.log('\n📋 Credenciais:');
        console.log(`   Email: ${defaultUser.email}`);
        console.log(`   Senha: ${defaultUser.password}`);
        console.log(`   UID: ${userCredential.user.uid}`);
        console.log('\n✨ Você já pode fazer login no sistema!');

        process.exit(0);
    } catch (error: any) {
        console.error('\n❌ Erro ao criar usuário:', error.message);

        if (error.code === 'auth/email-already-in-use') {
            console.log('\n⚠️  O usuário grex@gmail.com já existe!');
            console.log('   Você pode fazer login com as credenciais:');
            console.log('   Email: grex@gmail.com');
            console.log('   Senha: 123456');
        } else if (error.code === 'auth/weak-password') {
            console.log('\n⚠️  A senha é muito fraca (mínimo 6 caracteres)');
        } else if (error.code === 'auth/invalid-email') {
            console.log('\n⚠️  O email fornecido é inválido');
        }

        process.exit(1);
    }
}

// Executar script
createDefaultUser();

