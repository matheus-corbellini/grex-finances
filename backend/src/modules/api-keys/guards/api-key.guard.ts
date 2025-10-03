import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ApiKeysService } from "../api-keys.service";
import { IS_PUBLIC_KEY } from "@/common/decorators/auth.decorator";

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(
        private readonly apiKeysService: ApiKeysService,
        private reflector: Reflector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Verificar se o endpoint é público (não requer autenticação)
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const apiKey = this.extractApiKey(request);
        const clientIp = this.extractClientIp(request);

        if (!apiKey) {
            throw new UnauthorizedException("Chave API não fornecida");
        }

        try {
            // Validar a chave API
            const apiKeyEntity = await this.apiKeysService.validateApiKey(apiKey, undefined, clientIp);

            // Adicionar informações da chave API ao request
            request.apiKey = apiKeyEntity;
            request.user = { id: apiKeyEntity.userId }; // Para compatibilidade com outros guards

            return true;
        } catch (error) {
            throw new UnauthorizedException(error.message || "Chave API inválida");
        }
    }

    private extractApiKey(request: any): string | null {
        // Tentar extrair da header Authorization
        const authHeader = request.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }

        // Tentar extrair da header X-API-Key
        const apiKeyHeader = request.headers['x-api-key'];
        if (apiKeyHeader) {
            return apiKeyHeader;
        }

        // Tentar extrair do query parameter
        const apiKeyQuery = request.query.api_key;
        if (apiKeyQuery) {
            return apiKeyQuery;
        }

        return null;
    }

    private extractClientIp(request: any): string | null {
        // Tentar extrair IP real considerando proxies
        const forwarded = request.headers['x-forwarded-for'];
        if (forwarded) {
            return forwarded.split(',')[0].trim();
        }

        const realIp = request.headers['x-real-ip'];
        if (realIp) {
            return realIp;
        }

        return request.connection?.remoteAddress || request.socket?.remoteAddress || null;
    }
}
