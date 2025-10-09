import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updatePassword,
    updateProfile,
    User as FirebaseUser,
    UserCredential,
    sendEmailVerification,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    FacebookAuthProvider,
} from "firebase/auth";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { User, CreateUserDto, LoginDto } from "../../shared/types";

class FirebaseAuthService {
    private googleProvider = new GoogleAuthProvider();
    private facebookProvider = new FacebookAuthProvider();

    constructor() {
        // Configure Google provider
        this.googleProvider.addScope("email");
        this.googleProvider.addScope("profile");
    }

    // Email/Password Authentication
    async login(credentials: LoginDto): Promise<User> {
        try {
            if (!auth) {
                throw new Error("Firebase auth not initialized");
            }

            const userCredential: UserCredential = await signInWithEmailAndPassword(
                auth,
                credentials.email,
                credentials.password
            );

            // Buscar dados do usuário do Firestore
            const userData = await this.getUserFromFirestore(userCredential.user.uid);

            if (userData) {
                return userData;
            }

            // Se não existir no Firestore, criar registro
            return await this.createUserInFirestore(userCredential.user);
        } catch (error: any) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    async register(userData: CreateUserDto): Promise<User> {
        try {
            if (!auth) {
                throw new Error("Firebase auth not initialized");
            }

            const userCredential: UserCredential = await createUserWithEmailAndPassword(
                auth,
                userData.email,
                userData.password
            );

            // Update user profile with first and last name
            await updateProfile(userCredential.user, {
                displayName: `${userData.firstName} ${userData.lastName}`,
            });

            // Criar usuário no Firestore
            const user: User = {
                id: userCredential.user.uid,
                email: userData.email,
                firstName: userData.firstName,
                lastName: userData.lastName,
                isActive: true,
                emailVerified: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await setDoc(doc(db, "users", user.id), {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                isActive: user.isActive,
                emailVerified: user.emailVerified,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            // Send email verification
            await sendEmailVerification(userCredential.user);

            return user;
        } catch (error: any) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    // Social Authentication
    async loginWithGoogle(): Promise<User> {
        try {
            const result = await signInWithPopup(auth, this.googleProvider);

            // Buscar ou criar usuário no Firestore
            let userData = await this.getUserFromFirestore(result.user.uid);

            if (!userData) {
                userData = await this.createUserInFirestore(result.user);
            }

            return userData;
        } catch (error: any) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    async loginWithFacebook(): Promise<User> {
        try {
            const result = await signInWithPopup(auth, this.facebookProvider);

            // Buscar ou criar usuário no Firestore
            let userData = await this.getUserFromFirestore(result.user.uid);

            if (!userData) {
                userData = await this.createUserInFirestore(result.user);
            }

            return userData;
        } catch (error: any) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    // Password Management
    async forgotPassword(email: string): Promise<void> {
        try {
            await sendPasswordResetEmail(auth, email);
        } catch (error: any) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    async changePassword(newPassword: string): Promise<void> {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error("No user is currently signed in");
            }
            await updatePassword(user, newPassword);
        } catch (error: any) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    // User Management
    async logout(): Promise<void> {
        try {
            // Limpar tokens antes de deslogar
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                sessionStorage.removeItem('firebaseToken');
                localStorage.removeItem('refreshToken');
            }
            await signOut(auth);
        } catch (error: any) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    async getCurrentUser(): Promise<User | null> {
        const user = auth.currentUser;
        if (!user) return null;

        // Buscar dados completos do Firestore
        const userData = await this.getUserFromFirestore(user.uid);
        return userData || this.mapFirebaseUserToUser(user);
    }

    async resendVerificationEmail(): Promise<void> {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error("No user is currently signed in");
            }
            await sendEmailVerification(user);
        } catch (error: any) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    // Auth State Management
    onAuthStateChanged(callback: (user: User | null) => void): () => void {
        try {
            if (!auth) {
                console.error('Firebase auth not initialized');
                callback(null);
                return () => { };
            }

            return onAuthStateChanged(auth, async (firebaseUser) => {
                try {
                    if (!firebaseUser) {
                        // Limpar token quando usuário desloga
                        if (typeof window !== 'undefined') {
                            localStorage.removeItem('accessToken');
                            sessionStorage.removeItem('firebaseToken');
                        }
                        callback(null);
                        return;
                    }

                    // Obter e salvar token do Firebase
                    try {
                        const token = await firebaseUser.getIdToken();
                        if (typeof window !== 'undefined') {
                            localStorage.setItem('accessToken', token);
                            sessionStorage.setItem('firebaseToken', token);
                            console.log('✅ Token Firebase salvo:', token.substring(0, 20) + '...');
                        }
                    } catch (tokenError) {
                        console.error('❌ Erro ao obter token Firebase:', tokenError);
                    }

                    // Buscar dados do Firestore
                    const userData = await this.getUserFromFirestore(firebaseUser.uid);
                    callback(userData || this.mapFirebaseUserToUser(firebaseUser));
                } catch (error) {
                    console.error('Error in auth state callback:', error);
                    callback(null);
                }
            });
        } catch (error) {
            console.error('Error setting up auth state listener:', error);
            callback(null);
            return () => { };
        }
    }

    isAuthenticated(): boolean {
        return !!auth.currentUser;
    }

    // Firestore Methods
    private async getUserFromFirestore(userId: string): Promise<User | null> {
        try {
            const userDoc = await getDoc(doc(db, "users", userId));

            if (!userDoc.exists()) {
                return null;
            }

            const data = userDoc.data();
            return {
                id: userDoc.id,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                isActive: data.isActive ?? true,
                emailVerified: data.emailVerified ?? false,
                createdAt: data.createdAt instanceof Timestamp
                    ? data.createdAt.toDate()
                    : new Date(data.createdAt),
                updatedAt: data.updatedAt instanceof Timestamp
                    ? data.updatedAt.toDate()
                    : new Date(data.updatedAt),
            };
        } catch (error) {
            console.error("Error fetching user from Firestore:", error);
            return null;
        }
    }

    private async createUserInFirestore(firebaseUser: FirebaseUser): Promise<User> {
        const [firstName, lastName] = firebaseUser.displayName?.split(" ") || ["", ""];

        const user: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            firstName: firstName || "",
            lastName: lastName || "",
            isActive: true,
            emailVerified: firebaseUser.emailVerified,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await setDoc(doc(db, "users", user.id), {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive,
            emailVerified: user.emailVerified,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        return user;
    }

    // Helper Methods
    private mapFirebaseUserToUser(firebaseUser: FirebaseUser): User {
        const [firstName, lastName] = firebaseUser.displayName?.split(" ") || ["", ""];

        return {
            id: firebaseUser.uid,
            email: firebaseUser.email || "",
            firstName: firstName || "",
            lastName: lastName || "",
            isActive: true,
            emailVerified: firebaseUser.emailVerified,
            createdAt: new Date(firebaseUser.metadata.creationTime || ""),
            updatedAt: new Date(firebaseUser.metadata.lastSignInTime || ""),
        };
    }

    private getErrorMessage(errorCode: string): string {
        const errorMessages: { [key: string]: string } = {
            "auth/user-not-found": "Usuário não encontrado",
            "auth/wrong-password": "Senha incorreta",
            "auth/email-already-in-use": "Este email já está em uso",
            "auth/weak-password": "A senha deve ter pelo menos 6 caracteres",
            "auth/invalid-email": "Email inválido",
            "auth/user-disabled": "Esta conta foi desabilitada",
            "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde",
            "auth/network-request-failed": "Erro de conexão. Verifique sua internet",
            "auth/invalid-credential": "Credenciais inválidas",
            "auth/account-exists-with-different-credential": "Uma conta já existe com este email usando outro método de login",
            "auth/popup-closed-by-user": "Login cancelado pelo usuário",
            "auth/cancelled-popup-request": "Login cancelado",
            "auth/popup-blocked": "Popup bloqueado pelo navegador",
        };

        return errorMessages[errorCode] || "Erro de autenticação. Tente novamente.";
    }
}

export default new FirebaseAuthService();
