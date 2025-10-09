import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "@/common/decorators/auth.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard(["firebase", "jwt"]) {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // Se houver erro ou não houver usuário, lançar exceção
    if (err || !user) {
      console.error('❌ Erro na autenticação:', err?.message || 'Usuário não encontrado', info);
      throw err || new UnauthorizedException("Token inválido ou expirado");
    }

    console.log('✅ Usuário autenticado:', {
      id: user.id,
      email: user.email,
    });

    return user;
  }
}
