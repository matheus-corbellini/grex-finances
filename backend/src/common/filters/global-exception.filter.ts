import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

export interface ErrorResponse {
    statusCode: number;
    timestamp: string;
    path: string;
    method: string;
    message: string | object;
    error?: string;
    details?: any;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionFilter.name);

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = this.getHttpStatus(exception);
        const message = this.getErrorMessage(exception);
        const error = this.getErrorName(exception);

        const errorResponse: ErrorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message,
            error,
        };

        // Adicionar detalhes para erros de validação
        if (exception instanceof HttpException && status === HttpStatus.BAD_REQUEST) {
            const exceptionResponse = exception.getResponse();
            if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
                errorResponse.details = exceptionResponse;
            }
        }

        // Log do erro
        this.logError(exception, request, errorResponse);

        // Resposta para o cliente
        response.status(status).json(errorResponse);
    }

    private getHttpStatus(exception: unknown): number {
        if (exception instanceof HttpException) {
            return exception.getStatus();
        }

        // Erros de banco de dados
        if (exception instanceof Error) {
            const message = exception.message.toLowerCase();

            if (message.includes('duplicate') || message.includes('unique')) {
                return HttpStatus.CONFLICT;
            }

            if (message.includes('not found') || message.includes('does not exist')) {
                return HttpStatus.NOT_FOUND;
            }

            if (message.includes('foreign key') || message.includes('constraint')) {
                return HttpStatus.BAD_REQUEST;
            }

            if (message.includes('permission') || message.includes('unauthorized')) {
                return HttpStatus.UNAUTHORIZED;
            }

            if (message.includes('forbidden') || message.includes('access denied')) {
                return HttpStatus.FORBIDDEN;
            }
        }

        return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    private getErrorMessage(exception: unknown): string | object {
        if (exception instanceof HttpException) {
            const response = exception.getResponse();

            // Se é um objeto com message, retornar o objeto completo
            if (typeof response === 'object' && response !== null) {
                return response;
            }

            return response as string;
        }

        if (exception instanceof Error) {
            // Em produção, não expor detalhes internos
            if (process.env.NODE_ENV === 'production') {
                return 'Erro interno do servidor';
            }

            return exception.message;
        }

        return 'Erro interno do servidor';
    }

    private getErrorName(exception: unknown): string {
        if (exception instanceof HttpException) {
            return exception.constructor.name;
        }

        if (exception instanceof Error) {
            return exception.constructor.name;
        }

        return 'UnknownError';
    }

    private logError(exception: unknown, request: Request, errorResponse: ErrorResponse): void {
        const logContext = {
            method: request.method,
            url: request.url,
            userAgent: request.get('User-Agent'),
            ip: request.ip,
            userId: (request as any).user?.id,
            statusCode: errorResponse.statusCode,
            error: errorResponse.error,
        };

        if (errorResponse.statusCode >= 500) {
            // Erros de servidor - log como error
            this.logger.error(
                `Server Error: ${errorResponse.message}`,
                exception instanceof Error ? exception.stack : undefined,
                logContext,
            );
        } else if (errorResponse.statusCode >= 400) {
            // Erros de cliente - log como warn
            this.logger.warn(
                `Client Error: ${errorResponse.message}`,
                logContext,
            );
        } else {
            // Outros erros - log como debug
            this.logger.debug(
                `Application Error: ${errorResponse.message}`,
                logContext,
            );
        }
    }
}
