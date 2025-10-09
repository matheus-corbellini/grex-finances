import axios from "axios";
import { auth } from "../firebaseConfig";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});

// Interceptor para adicionar token do Firebase em todas as requisições
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;

      if (user) {
        // Pegar o token do Firebase
        const token = await user.getIdToken();

        // Adicionar token no header Authorization
        config.headers.Authorization = `Bearer ${token}`;

        // TEMPORÁRIO: Adicionar userId diretamente no header para desenvolvimento
        config.headers['X-User-Id'] = user.uid;

        console.log('🔐 Requisição autenticada:', {
          url: config.url,
          userId: user.uid,
          email: user.email
        });
      } else {
        console.warn('⚠️  Usuário não autenticado, enviando requisição sem token');
      }
    } catch (error) {
      console.error('❌ Erro ao obter token:', error);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error('❌ Erro 401: Não autorizado');

      // Limpar dados locais e redirecionar para login
      if (typeof window !== 'undefined') {
        localStorage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
