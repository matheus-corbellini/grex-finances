import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Request } from 'express';
import * as admin from 'firebase-admin';
import { getFirebaseAdmin, isFirebaseAdminConfigured } from '@/config/firebase-admin.config';

/**
 * Estratégia de autenticação Firebase
 * 
 * Valida tokens JWT do Firebase Authentication usando Firebase Admin SDK
 * Se o Firebase Admin não estiver configurado, usa modo de desenvolvimento (sem validação real)
 */
@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase') {
    private readonly useFirebaseValidation: boolean;

    constructor() {
        super();

        // Inicializar Firebase Admin se configurado
        getFirebaseAdmin();

        // Verificar se deve usar validação real ou modo dev
        this.useFirebaseValidation = isFirebaseAdminConfigured();

        if (this.useFirebaseValidation) {
            console.log('🔥 Firebase Strategy: Usando validação REAL com Firebase Admin SDK');
        } else {
            console.log('⚠️  Firebase Strategy: Usando modo DESENVOLVIMENTO (sem validação de assinatura)');
            console.log('   Configure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL e FIREBASE_PRIVATE_KEY para produção');
        }
    }

    async validate(req: Request): Promise<any> {
        try {
            // Extrair o token do header Authorization
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                throw new UnauthorizedException('Token não fornecido');
            }

            const token = authHeader.replace('Bearer ', '').trim();

            if (!token) {
                throw new UnauthorizedException('Token inválido');
            }

            // Validar token com Firebase Admin ou decodificar sem validação
            let payload: any;

            if (this.useFirebaseValidation) {
                payload = await this.validateWithFirebase(token);
            } else {
                payload = this.decodeTokenUnsafe(token);
            }

            // Extrair dados do usuário
            const userId = payload.uid || payload.user_id || payload.sub;

            if (!userId) {
                throw new UnauthorizedException('Token Firebase inválido: user_id não encontrado');
            }

            console.log('✅ Usuário autenticado via Firebase:', {
                uid: userId,
                email: payload.email,
            });

            // Retornar dados do usuário que serão injetados no request.user
            return {
                id: userId,
                email: payload.email || payload.firebase?.identities?.email?.[0],
                firebaseUid: userId,
                name: payload.name,
                picture: payload.picture,
            };
        } catch (error) {
            console.error('❌ Erro ao validar token Firebase:', error.message);
            throw new UnauthorizedException('Token Firebase inválido ou expirado');
        }
    }

    /**
     * Valida o token usando Firebase Admin SDK (SEGURO - para produção)
     */
    private async validateWithFirebase(token: string): Promise<admin.auth.DecodedIdToken> {
        try {
            const decodedToken = await admin.auth().verifyIdToken(token, true);
            return decodedToken;
        } catch (error) {
            if (error.code === 'auth/id-token-expired') {
                throw new UnauthorizedException('Token expirado');
            } else if (error.code === 'auth/argument-error') {
                throw new UnauthorizedException('Token inválido');
            } else {
                throw new UnauthorizedException(`Erro ao validar token: ${error.message}`);
            }
        }
    }

    /**
     * Decodifica o JWT sem validar a assinatura (INSEGURO - apenas para desenvolvimento)
     */
    private decodeTokenUnsafe(token: string): any {
        try {
            // JWT tem 3 partes separadas por pontos: header.payload.signature
            const parts = token.split('.');

            if (parts.length !== 3) {
                throw new Error('Token JWT inválido');
            }

            // Decodificar o payload (segunda parte)
            const payload = parts[1];

            // Adicionar padding se necessário
            const paddedPayload = payload.padEnd(
                payload.length + ((4 - (payload.length % 4)) % 4),
                '='
            );

            const decodedPayload = Buffer.from(paddedPayload, 'base64').toString('utf-8');
            const parsed = JSON.parse(decodedPayload);

            console.log('⚠️  Token decodificado SEM validação (modo desenvolvimento):', {
                uid: parsed.user_id || parsed.sub,
                email: parsed.email,
                exp: parsed.exp ? new Date(parsed.exp * 1000).toISOString() : 'N/A',
            });

            return parsed;
        } catch (error) {
            console.error('Erro ao decodificar token:', error.message);
            throw new UnauthorizedException('Não foi possível decodificar o token');
        }
    }
}
