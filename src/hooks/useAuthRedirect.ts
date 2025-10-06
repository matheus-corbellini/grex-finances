import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Hook para gerenciar redirecionamentos de autenticação
 * Escuta eventos de autenticação e redireciona quando necessário
 */
export const useAuthRedirect = () => {
    const router = useRouter();

    useEffect(() => {
        const handleAuthUnauthorized = (event: CustomEvent) => {
            console.log("🔐 Evento de autenticação recebido:", event.detail);

            // Redirecionar para login apenas se estivermos em uma página protegida
            if (window.location.pathname.startsWith('/dashboard')) {
                console.log("🔄 Redirecionando para login...");
                router.push("/login");
            }
        };

        window.addEventListener('auth:unauthorized', handleAuthUnauthorized as EventListener);

        return () => {
            window.removeEventListener('auth:unauthorized', handleAuthUnauthorized as EventListener);
        };
    }, [router]);
};
