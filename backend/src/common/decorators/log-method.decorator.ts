import { SetMetadata } from '@nestjs/common';

export const LOG_METHOD_KEY = 'logMethod';

export interface LogMethodOptions {
    level?: 'log' | 'debug' | 'warn' | 'error';
    message?: string;
    includeArgs?: boolean;
    includeResult?: boolean;
}

export const LogMethod = (options: LogMethodOptions = {}) => {
    return SetMetadata(LOG_METHOD_KEY, {
        level: options.level || 'debug',
        message: options.message,
        includeArgs: options.includeArgs ?? true,
        includeResult: options.includeResult ?? false,
    });
};
