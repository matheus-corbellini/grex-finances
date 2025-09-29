/**
 * Função utilitária para fazer log seguro de erros, evitando referências circulares
 */
export function safeErrorLog(message: string, error: any): void {
    try {
        const safeError = {
            message: error?.message || 'Unknown error',
            status: error?.status,
            response: error?.response?.data || error?.response,
            stack: error?.stack,
            name: error?.name,
            code: error?.code
        };

        console.error(message, safeError);
    } catch (logError) {
        // Se mesmo assim der erro, log apenas a mensagem
        console.error(message, 'Error logging failed');
    }
}

/**
 * Função para extrair apenas informações seguras de um erro
 */
export function extractSafeErrorInfo(error: any): {
    message: string;
    status?: number;
    response?: any;
    stack?: string;
    name?: string;
    code?: string;
} {
    return {
        message: error?.message || 'Unknown error',
        status: error?.status,
        response: error?.response?.data || error?.response,
        stack: error?.stack,
        name: error?.name,
        code: error?.code
    };
}
