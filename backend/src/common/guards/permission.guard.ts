import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UsersService } from "../../modules/users/users.service";
import { Permission } from "../../modules/users/entities/role.entity";

export const PERMISSION_KEY = "permission";

export const PermissionGuard = (permission: Permission): any => {
    @Injectable()
    class PermissionGuardImpl implements CanActivate {
        constructor(
            public reflector: Reflector,
            public usersService: UsersService
        ) { }

        async canActivate(context: ExecutionContext): Promise<boolean> {
            const request = context.switchToHttp().getRequest();
            const user = request.user;

            if (!user) {
                throw new ForbiddenException("Usuário não autenticado");
            }

            const hasPermission = await this.usersService.hasPermission(user.id, permission);

            if (!hasPermission) {
                throw new ForbiddenException(`Permissão necessária: ${permission}`);
            }

            return true;
        }
    }

    return PermissionGuardImpl;
};
