import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  ApiResponse,
  ApiError,
  PaginatedResponse,
  RequestOptions,
} from "../../../shared/types";

class BaseApiService {
  protected api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor for auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
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
        if (error.response?.status === 401) {
          await this.handleUnauthorized();
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

  private getAuthToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }

  private async handleUnauthorized() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<ApiResponse<T>>(url, config);
    return response.data.data;
  }

  protected async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  protected async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.put<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  protected async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.patch<ApiResponse<T>>(url, data, config);
    return response.data.data;
  }

  protected async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.api.delete<ApiResponse<T>>(url, config);
    return response.data.data;
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
