import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'grex_finances.db',
  autoLoadEntities: true,
  synchronize: false, // Usar migrações em vez de synchronize
  logging: process.env.NODE_ENV === 'development',
};