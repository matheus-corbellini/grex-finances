import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  ApiResponse,
  ApiError,
  PaginatedResponse,
  RequestOptions,
} from "../../../shared/types";
import { auth } from "../../../firebaseConfig";

class BaseApiService {
  protected api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
      timeout: 15000, // Increased timeout for better reliability
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      withCredentials: false, // Desabilitar credentials para evitar problemas CORS
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await this.getAuthToken();
        console.log("📤 Fazendo requisição:", {
          url: config.url,
          method: config.method,
          hasToken: !!token,
          tokenPreview: token && typeof token === 'string' ? `${token.substring(0, 20)}...` : 'N/A'
        });

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse<ApiResponse<any>>) => {
        return response;
      },
      async (error) => {
        console.log("🚨 Erro na API:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          method: error.config?.method,
          data: error.response?.data,
          message: error.message,
          errorType: typeof error,
          errorKeys: Object.keys(error || {}),
          fullError: JSON.stringify(error, null, 2)
        });

        if (error.response?.status === 401) {
          console.log("🔐 Erro 401 detectado - chamando handleUnauthorized");
          await this.handleUnauthorized();
        }

        // Handle connection refused errors (backend not running)
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_CONNECTION_REFUSED') {
          const connectionError: ApiError = {
            message: "Servidor backend não está rodando. Por favor, inicie o servidor backend primeiro.",
            code: "BACKEND_NOT_RUNNING",
            details: {
              suggestion: "Execute 'npm run dev' na pasta backend ou 'docker-compose up' para iniciar o servidor",
              url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
            },
            timestamp: new Date(),
          };
          return Promise.reject(connectionError);
        }

        // Handle network errors
        if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
          const networkError: ApiError = {
            message: "Erro de conexão com o servidor. Verifique se o backend está rodando.",
            code: "NETWORK_ERROR",
            details: {
              suggestion: "Verifique se o servidor backend está rodando na porta 3001",
              url: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
            },
            timestamp: new Date(),
          };
          return Promise.reject(networkError);
        }

        const apiError: ApiError = {
          message:
            error.response?.data?.message ||
            error.message ||
            "An error occurred",
          code: error.response?.data?.code || "UNKNOWN_ERROR",
          details: error.response?.data?.details,
          timestamp: new Date(),
        };

        return Promise.reject(apiError);
      }
    );
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      if (typeof window !== "undefined" && auth.currentUser) {
        // Usar Firebase diretamente para obter token atualizado
        const token = await auth.currentUser.getIdToken();
        console.log('🔐 Token Firebase obtido:', typeof token, token ? token.substring(0, 20) + '...' : 'null');
        return token;
      }
    } catch (error) {
      console.error('❌ Erro ao obter token Firebase:', error);
    }
    return null;
  }

  private async handleUnauthorized() {
    if (typeof window !== "undefined") {
      console.log("🔐 Token inválido ou expirado. Limpando tokens...");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Não redirecionar automaticamente - deixar que os componentes tratem o erro
      console.error("❌ Erro de autenticação: Token inválido ou expirado");

      // Em vez de redirecionar, vamos disparar um evento customizado
      // que os componentes podem escutar para decidir o que fazer
      window.dispatchEvent(new CustomEvent('auth:unauthorized', {
        detail: { message: 'Sessão expirada. Faça login novamente.' }
      }));
    }
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<any>(url, config);
    // Return the response data directly - let individual services handle structure transformation
    return response.data;
  }

  protected async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.post<any>(url, data, config);
    return response.data;
  }

  protected async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.put<any>(url, data, config);
    return response.data;
  }

  protected async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.patch<any>(url, data, config);
    return response.data;
  }

  protected async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.delete<any>(url, config);
    return response.data;
  }

  protected async getPaginated<T>(
    url: string,
    options?: RequestOptions,
    config?: AxiosRequestConfig
  ): Promise<PaginatedResponse<T>> {
    const params = this.buildQueryParams(options);
    const response = await this.api.get<PaginatedResponse<T>>(url, {
      ...config,
      params,
    });
    return response.data;
  }

  private buildQueryParams(options?: RequestOptions): Record<string, any> {
    const params: Record<string, any> = {};

    if (options?.page) params.page = options.page;
    if (options?.limit) params.limit = options.limit;
    if (options?.sort) {
      params.sortBy = options.sort.field;
      params.sortOrder = options.sort.direction;
    }
    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = value;
        }
      });
    }
    if (options?.search) {
      params.search = options.search.query;
      if (options.search.fields) {
        params.searchFields = options.search.fields.join(",");
      }
    }

    return params;
  }
}

export default BaseApiService;
