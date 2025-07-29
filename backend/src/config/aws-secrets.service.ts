import { Injectable, Logger } from "@nestjs/common";
import { SecretsManager } from "aws-sdk";

@Injectable()
export class AWSSecretsService {
  private readonly logger = new Logger(AWSSecretsService.name);
  private secretsManager: SecretsManager;

  constructor() {
    this.secretsManager = new SecretsManager({
      region: process.env.AWS_REGION || "us-east-1",
    });
  }

  async getSecret(secretName: string): Promise<any> {
    try {
      const result = await this.secretsManager
        .getSecretValue({ SecretId: secretName })
        .promise();

      if (result.SecretString) {
        return JSON.parse(result.SecretString);
      }

      return null;
    } catch (error) {
      this.logger.error(`Failed to get secret ${secretName}:`, error);
      throw error;
    }
  }

  async getDatabaseCredentials(): Promise<{
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  }> {
    const secretName = process.env.DB_SECRET_NAME || "grex-finances/db";

    try {
      const secret = await this.getSecret(secretName);
      return {
        host: secret.host,
        port: secret.port || 3306,
        username: secret.username,
        password: secret.password,
        database: secret.database,
      };
    } catch (error) {
      this.logger.warn(
        "Using fallback database configuration from environment variables"
      );
      return {
        host: process.env.DB_HOST || "localhost",
        port: parseInt(process.env.DB_PORT) || 3306,
        username: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD || "password",
        database: process.env.DB_NAME || "grex_finances",
      };
    }
  }

  async getJWTSecret(): Promise<string> {
    const secretName = process.env.JWT_SECRET_NAME || "grex-finances/jwt";

    try {
      const secret = await this.getSecret(secretName);
      return secret.jwt_secret;
    } catch (error) {
      this.logger.warn("Using fallback JWT secret from environment variables");
      return (
        process.env.JWT_SECRET ||
        "your-super-secret-jwt-key-change-this-in-production"
      );
    }
  }
}
