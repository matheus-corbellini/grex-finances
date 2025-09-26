import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { AppLogger } from '../logger/app.logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: AppLogger) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const { method, url, ip } = request;
        const userAgent = request.get('User-Agent') || '';
        const userId = (request as any).user?.id;

        const startTime = Date.now();

        // Log da requisição
        this.logger.log(`Incoming request: ${method} ${url}`, {
            userId,
            method,
            url,
            ip,
            userAgent,
            type: 'request',
        });

        return next.handle().pipe(
            tap({
                next: () => {
                    const duration = Date.now() - startTime;
                    const statusCode = response.statusCode;

                    // Log da resposta
                    this.logger.logRequest(method, url, statusCode, duration, {
                        userId,
                        ip,
                        userAgent,
                    });
                },
                error: (error) => {
                    const duration = Date.now() - startTime;
                    const statusCode = error.status || 500;

                    // Log do erro
                    this.logger.error(`Request failed: ${method} ${url}`, error.stack, {
                        userId,
                        method,
                        url,
                        ip,
                        userAgent,
                        statusCode,
                        duration,
                        type: 'request_error',
                    });
                },
            }),
        );
    }
}
