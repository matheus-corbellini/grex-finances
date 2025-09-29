import { Injectable, LoggerService, LogLevel } from '@nestjs/common';

export interface LogContext {
    userId?: string;
    requestId?: string;
    method?: string;
    url?: string;
    userAgent?: string;
    ip?: string;
    statusCode?: number;
    duration?: number;
    [key: string]: any;
}

export interface StructuredLog {
    level: LogLevel;
    message: string;
    context?: LogContext;
    timestamp: string;
    service: string;
    environment: string;
}

@Injectable()
export class AppLogger implements LoggerService {
    private readonly serviceName = 'grex-finances-backend';
    private readonly environment = process.env.NODE_ENV || 'development';

    log(message: string, context?: LogContext): void {
        this.writeLog('log', message, context);
    }

    error(message: string, trace?: string, context?: LogContext): void {
        this.writeLog('error', message, { ...context, trace });
    }

    warn(message: string, context?: LogContext): void {
        this.writeLog('warn', message, context);
    }

    debug(message: string, context?: LogContext): void {
        this.writeLog('debug', message, context);
    }

    verbose(message: string, context?: LogContext): void {
        this.writeLog('verbose', message, context);
    }

    private writeLog(level: LogLevel, message: string, context?: LogContext): void {
        const structuredLog: StructuredLog = {
            level,
            message,
            context,
            timestamp: new Date().toISOString(),
            service: this.serviceName,
            environment: this.environment,
        };

        // Em desenvolvimento, usar console colorido
        if (this.environment === 'development') {
            this.logToConsole(structuredLog);
        } else {
            // Em produção, usar JSON estruturado
            console.log(JSON.stringify(structuredLog));
        }
    }

    private logToConsole(log: StructuredLog): void {
        const { level, message, context, timestamp } = log;

        // Cores para diferentes níveis
        const colors = {
            log: '\x1b[32m',     // Verde
            error: '\x1b[31m',   // Vermelho
            warn: '\x1b[33m',    // Amarelo
            debug: '\x1b[36m',   // Ciano
            verbose: '\x1b[35m', // Magenta
        };

        const reset = '\x1b[0m';
        const color = colors[level] || '';

        // Formato legível para desenvolvimento
        const contextStr = context ? ` ${this.safeStringify(context)}` : '';

        console.log(
            `${color}[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}${reset}`
        );
    }

    // Métodos específicos para diferentes tipos de logs
    logRequest(method: string, url: string, statusCode: number, duration: number, context?: LogContext): void {
        this.log(`HTTP ${method} ${url} ${statusCode} - ${duration}ms`, {
            ...context,
            method,
            url,
            statusCode,
            duration,
        });
    }

    logDatabase(query: string, duration: number, context?: LogContext): void {
        this.debug(`Database query executed in ${duration}ms`, {
            ...context,
            query: query.substring(0, 100), // Limitar tamanho do log
            duration,
        });
    }

    logBusiness(message: string, userId?: string, context?: LogContext): void {
        this.log(message, {
            ...context,
            userId,
            type: 'business',
        });
    }

    logSecurity(event: string, context?: LogContext): void {
        this.warn(`Security event: ${event}`, {
            ...context,
            type: 'security',
        });
    }

    logPerformance(operation: string, duration: number, context?: LogContext): void {
        this.debug(`Performance: ${operation} took ${duration}ms`, {
            ...context,
            operation,
            duration,
            type: 'performance',
        });
    }

    private safeStringify(obj: any): string {
        try {
            return JSON.stringify(obj, null, 2);
        } catch (error) {
            // Se houver erro de serialização circular, usar uma versão simplificada
            const safeObj = this.removeCircularReferences(obj);
            return JSON.stringify(safeObj, null, 2);
        }
    }

    private removeCircularReferences(obj: any, seen = new WeakSet()): any {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (seen.has(obj)) {
            return '[Circular Reference]';
        }

        seen.add(obj);

        if (Array.isArray(obj)) {
            return obj.map(item => this.removeCircularReferences(item, seen));
        }

        const result: any = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                // Pular propriedades que podem causar problemas de serialização
                if (key === 'socket' || key === 'parser' || key === 'req' || key === 'res') {
                    result[key] = '[Object]';
                } else {
                    result[key] = this.removeCircularReferences(obj[key], seen);
                }
            }
        }

        return result;
    }
}
