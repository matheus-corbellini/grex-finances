import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
    constructor(message: string, details?: any) {
        super(
            {
                message,
                error: 'BusinessError',
                details,
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}

export class ValidationException extends HttpException {
    constructor(message: string, validationErrors?: any[]) {
        super(
            {
                message,
                error: 'ValidationError',
                details: {
                    validationErrors,
                },
            },
            HttpStatus.BAD_REQUEST,
        );
    }
}

export class NotFoundException extends HttpException {
    constructor(resource: string, id?: string) {
        const message = id
            ? `${resource} com ID ${id} não encontrado`
            : `${resource} não encontrado`;

        super(
            {
                message,
                error: 'NotFoundError',
                details: {
                    resource,
                    id,
                },
            },
            HttpStatus.NOT_FOUND,
        );
    }
}

export class ConflictException extends HttpException {
    constructor(message: string, details?: any) {
        super(
            {
                message,
                error: 'ConflictError',
                details,
            },
            HttpStatus.CONFLICT,
        );
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message: string = 'Não autorizado') {
        super(
            {
                message,
                error: 'UnauthorizedError',
            },
            HttpStatus.UNAUTHORIZED,
        );
    }
}

export class ForbiddenException extends HttpException {
    constructor(message: string = 'Acesso negado') {
        super(
            {
                message,
                error: 'ForbiddenError',
            },
            HttpStatus.FORBIDDEN,
        );
    }
}

export class InternalServerException extends HttpException {
    constructor(message: string = 'Erro interno do servidor') {
        super(
            {
                message,
                error: 'InternalServerError',
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}
