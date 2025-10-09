/**
 * Script para criar usuário no Firebase
 * 
 * Uso: node scripts/create-user.js <email> <senha> [firstName] [lastName]
 * 
 * Exemplo:
 * node scripts/create-user.js grex@teste.com 123456 Grex Teste
 */

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, updateProfile } = require('firebase/auth');
const { getFirestore, doc, setDoc, serverTimestamp } = require('firebase/firestore');

// Configuração do Firebase
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDTniBYkusXUI_WOs38ui3H9o4sj8r78b0",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "grex-2afe3.firebaseapp.com",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "grex-2afe3",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "grex-2afe3.firebasestorage.app",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "228214548843",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:228214548843:web:1ce2c9bf23b45f0c95042e",
};

async function createUser(email, password, firstName = 'Usuário', lastName = 'Teste') {
    console.log('🔥 Criando novo usuário...\n');

    try {
        // Inicializar Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);

        console.log('✅ Firebase inicializado');

        console.log(`\n📝 Criando usuário: ${email}`);

        // Criar usuário no Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        console.log(`✅ Usuário criado no Authentication (UID: ${userCredential.user.uid})`);

        // Atualizar perfil com nome
        await updateProfile(userCredential.user, {
            displayName: `${firstName} ${lastName}`,
        });

        console.log('✅ Perfil atualizado');

        // Criar documento no Firestore
        try {
            await setDoc(doc(db, "users", userCredential.user.uid), {
                email: email,
                firstName: firstName,
                lastName: lastName,
                isActive: true,
                emailVerified: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            console.log('✅ Usuário criado no Firestore');
        } catch (firestoreError) {
            console.warn('⚠️  Não foi possível criar no Firestore:', firestoreError.message);
            console.log('📝 O usuário será criado automaticamente no primeiro login');
        }

        console.log('\n🎉 Usuário criado com sucesso!');
        console.log('\n📋 Credenciais:');
        console.log(`   Email: ${email}`);
        console.log(`   Senha: ${password}`);
        console.log(`   Nome: ${firstName} ${lastName}`);
        console.log(`   UID: ${userCredential.user.uid}`);
        console.log('\n✨ Você já pode fazer login no sistema!');

        process.exit(0);
    } catch (error) {
        console.error('\n❌ Erro ao criar usuário:', error.message);

        if (error.code === 'auth/email-already-in-use') {
            console.log(`\n⚠️  O usuário ${email} já existe!`);
            console.log('   Você pode fazer login com essas credenciais.');
        } else if (error.code === 'auth/weak-password') {
            console.log('\n⚠️  A senha é muito fraca (mínimo 6 caracteres)');
        } else if (error.code === 'auth/invalid-email') {
            console.log('\n⚠️  O email fornecido é inválido');
        }

        process.exit(1);
    }
}

// Extrair argumentos da linha de comando
const args = process.argv.slice(2);

if (args.length < 2) {
    console.log('❌ Uso incorreto!');
    console.log('\nUso: node scripts/create-user.js <email> <senha> [firstName] [lastName]');
    console.log('\nExemplo:');
    console.log('  node scripts/create-user.js grex@teste.com 123456');
    console.log('  node scripts/create-user.js grex@teste.com 123456 Grex Teste');
    process.exit(1);
}

const [email, password, firstName, lastName] = args;

// Executar script
createUser(email, password, firstName, lastName);

