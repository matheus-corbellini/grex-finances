import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator para extrair o usuário autenticado do request
 * Usado após autenticação JWT/Firebase
 * 
 * @example
 * ```typescript
 * @Get()
 * @UseGuards(JwtAuthGuard)
 * async findAll(@CurrentUser() user: any) {
 *   return this.service.findAll(user.id);
 * }
 * ```
 */
export const CurrentUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;

        // Se um campo específico foi solicitado, retorna apenas ele
        return data ? user?.[data] : user;
    },
);

