import BaseApiService from "./base.service";
import {
  User,
  AuthResponse,
  LoginDto,
  CreateUserDto,
  ResetPasswordDto,
} from "../../../shared/types";

class AuthService extends BaseApiService {
  async login(credentials: LoginDto): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>("/auth/login", credentials);
    this.storeTokens(response.accessToken, response.refreshToken);
    return response;
  }

  async register(userData: CreateUserDto): Promise<AuthResponse> {
    const response = await this.post<AuthResponse>("/auth/register", userData);
    this.storeTokens(response.accessToken, response.refreshToken);
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.post("/auth/logout");
    } finally {
      this.clearTokens();
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await this.post<AuthResponse>("/auth/refresh", {
      refreshToken,
    });
    this.storeTokens(response.accessToken, response.refreshToken);
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return this.get<User>("/auth/me");
  }

  async forgotPassword(email: string): Promise<void> {
    await this.post("/auth/forgot-password", { email });
  }

  async resetPassword(data: ResetPasswordDto): Promise<void> {
    await this.post("/auth/reset-password", data);
  }

  async verifyEmail(token: string): Promise<void> {
    await this.post("/auth/verify-email", { token });
  }

  async resendVerificationEmail(): Promise<void> {
    await this.post("/auth/resend-verification");
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await this.post("/auth/change-password", { currentPassword, newPassword });
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  private storeTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  }

  private clearTokens(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  }

  private getAccessToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  }

  private getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("refreshToken");
    }
    return null;
  }
}

export default new AuthService();
