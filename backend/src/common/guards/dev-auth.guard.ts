import {
  ExecutionContext,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "@/common/decorators/auth.decorator";

@Injectable()
export class DevAuthGuard {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('🔍 DEV AUTH GUARD - Verificando acesso...');
    console.log('🔍 DEV AUTH GUARD - NODE_ENV:', process.env.NODE_ENV);
    
    // Em modo de desenvolvimento, sempre permitir acesso
    // Verificar se está rodando localmente (localhost) ou se NODE_ENV é development
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         process.env.NODE_ENV === undefined ||
                         process.env.NODE_ENV === '';
    
    console.log('🔍 DEV AUTH GUARD - isDevelopment:', isDevelopment);
    
    if (isDevelopment) {
      console.log('🔓 DEV MODE - Permitindo acesso sem autenticação');
      return true;
    }

    // Verificar se o endpoint é público
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      console.log('🔓 PUBLIC ENDPOINT - Permitindo acesso');
      return true;
    }

    // Em produção, exigir autenticação real
    console.log('🔒 PRODUCTION MODE - Exigindo autenticação');
    return false;
  }
}
