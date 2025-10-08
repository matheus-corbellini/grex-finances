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
import { auth } from "../../firebaseConfig";
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

            return this.mapFirebaseUserToUser(userCredential.user);
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

            // Send email verification
            await sendEmailVerification(userCredential.user);

            return this.mapFirebaseUserToUser(userCredential.user);
        } catch (error: any) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    // Social Authentication
    async loginWithGoogle(): Promise<User> {
        try {
            const result = await signInWithPopup(auth, this.googleProvider);
            return this.mapFirebaseUserToUser(result.user);
        } catch (error: any) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    async loginWithFacebook(): Promise<User> {
        try {
            const result = await signInWithPopup(auth, this.facebookProvider);
            return this.mapFirebaseUserToUser(result.user);
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
            await signOut(auth);
        } catch (error: any) {
            throw new Error(this.getErrorMessage(error.code));
        }
    }

    async getCurrentUser(): Promise<User | null> {
        const user = auth.currentUser;
        return user ? this.mapFirebaseUserToUser(user) : null;
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

            return onAuthStateChanged(auth, (firebaseUser) => {
                try {
                    callback(firebaseUser ? this.mapFirebaseUserToUser(firebaseUser) : null);
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
