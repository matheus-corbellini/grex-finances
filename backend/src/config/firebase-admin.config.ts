import * as admin from 'firebase-admin';

let firebaseApp: admin.app.App;

/**
 * Inicializa o Firebase Admin SDK
 * Usa variáveis de ambiente para configuração
 */
export function initializeFirebaseAdmin(): admin.app.App {
    if (firebaseApp) {
        return firebaseApp;
    }

    try {
        // Verificar se já existe uma instância
        if (admin.apps.length > 0) {
            firebaseApp = admin.apps[0];
            console.log('✅ Firebase Admin já inicializado');
            return firebaseApp;
        }

        // Configuração do Firebase Admin
        const firebaseConfig: admin.ServiceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        };

        // Validar configuração
        if (!firebaseConfig.projectId || !firebaseConfig.clientEmail || !firebaseConfig.privateKey) {
            console.warn('⚠️  Firebase Admin não configurado. Usando modo de desenvolvimento sem validação.');
            console.warn('   Para produção, configure as variáveis de ambiente:');
            console.warn('   - FIREBASE_PROJECT_ID');
            console.warn('   - FIREBASE_CLIENT_EMAIL');
            console.warn('   - FIREBASE_PRIVATE_KEY');

            // Retornar null para indicar que não está configurado
            return null;
        }

        // Inicializar Firebase Admin SDK
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig),
        });

        console.log('✅ Firebase Admin inicializado com sucesso');
        console.log(`   Project ID: ${firebaseConfig.projectId}`);

        return firebaseApp;
    } catch (error) {
        console.error('❌ Erro ao inicializar Firebase Admin:', error.message);
        return null;
    }
}

/**
 * Obtém a instância do Firebase Admin
 */
export function getFirebaseAdmin(): admin.app.App {
    if (!firebaseApp) {
        return initializeFirebaseAdmin();
    }
    return firebaseApp;
}

/**
 * Verifica se o Firebase Admin está configurado
 */
export function isFirebaseAdminConfigured(): boolean {
    return !!firebaseApp || (
        !!process.env.FIREBASE_PROJECT_ID &&
        !!process.env.FIREBASE_CLIENT_EMAIL &&
        !!process.env.FIREBASE_PRIVATE_KEY
    );
}

