import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'ep-sweet-grass-adnspb26-pooler.c-2.us-east-1.aws.neon.tech',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'neondb_owner',
  password: process.env.DB_PASSWORD || 'npg_FyzXVP8QZv4K',
  database: process.env.DB_NAME || 'neondb',
  autoLoadEntities: true,
  synchronize: false, // Desabilitado para evitar problemas de schema
  logging: process.env.NODE_ENV === 'development',
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
};