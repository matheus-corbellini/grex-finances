import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { AppLogger } from '../logger/app.logger';
import { LOG_METHOD_KEY, LogMethodOptions } from '../decorators/log-method.decorator';

@Injectable()
export class MethodLoggingInterceptor implements NestInterceptor {
    constructor(
        private readonly logger: AppLogger,
        private readonly reflector: Reflector,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const logOptions = this.reflector.get<LogMethodOptions>(
            LOG_METHOD_KEY,
            context.getHandler(),
        );

        if (!logOptions) {
            return next.handle();
        }

        const className = context.getClass().name;
        const methodName = context.getHandler().name;
        const args = context.getArgs();

        const startTime = Date.now();
        const logMessage = logOptions.message || `${className}.${methodName}`;

        // Log dos argumentos se habilitado
        if (logOptions.includeArgs) {
            this.logger[logOptions.level](`${logMessage} - Args:`, {
                className,
                methodName,
                args: this.sanitizeArgs(args),
                type: 'method_call',
            } as any);
        } else {
            this.logger[logOptions.level](`${logMessage} - Called`, {
                className,
                methodName,
                type: 'method_call',
            } as any);
        }

        return next.handle().pipe(
            tap({
                next: (result) => {
                    const duration = Date.now() - startTime;

                    if (logOptions.includeResult) {
                        this.logger[logOptions.level](`${logMessage} - Success`, {
                            className,
                            methodName,
                            duration,
                            result: this.sanitizeResult(result),
                            type: 'method_success',
                        } as any);
                    } else {
                        this.logger[logOptions.level](`${logMessage} - Success (${duration}ms)`, {
                            className,
                            methodName,
                            duration,
                            type: 'method_success',
                        } as any);
                    }
                },
                error: (error) => {
                    const duration = Date.now() - startTime;

                    this.logger.error(`${logMessage} - Error`, error.stack, {
                        className,
                        methodName,
                        duration,
                        error: error.message,
                        type: 'method_error',
                    });
                },
            }),
        );
    }

    private sanitizeArgs(args: any[]): any[] {
        return args.map(arg => {
            if (typeof arg === 'object' && arg !== null) {
                // Remover propriedades sensíveis
                const sanitized = { ...arg };
                delete sanitized.password;
                delete sanitized.token;
                delete sanitized.secret;
                return sanitized;
            }
            return arg;
        });
    }

    private sanitizeResult(result: any): any {
        if (typeof result === 'object' && result !== null) {
            // Remover propriedades sensíveis do resultado
            const sanitized = { ...result };
            delete sanitized.password;
            delete sanitized.token;
            delete sanitized.secret;
            return sanitized;
        }
        return result;
    }
}
