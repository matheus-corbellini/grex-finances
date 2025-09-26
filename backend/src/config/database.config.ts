import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '031004',
  database: 'grex',
  autoLoadEntities: true,
  synchronize: false, // Usar migrações em vez de synchronize
  logging: true,
  ssl: false,
};