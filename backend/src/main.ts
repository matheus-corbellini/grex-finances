import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { MethodLoggingInterceptor } from './common/interceptors/method-logging.interceptor';
import { AppLogger } from './common/logger/app.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new AppLogger(),
  });

  // Configurar logger global
  const appLogger = app.get(AppLogger);
  app.useLogger(appLogger);

  // Enable CORS for frontend communication
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Global Interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(appLogger),
    new MethodLoggingInterceptor(appLogger, app.get('Reflector')),
  );

  // Enable validation pipes globally
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    skipMissingProperties: false,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Grex Finances API')
    .setDescription('API para sistema de gestão financeira')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('transactions', 'Operações de transações')
    .addTag('accounts', 'Operações de contas')
    .addTag('categories', 'Operações de categorias')
    .addTag('users', 'Operações de usuários')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  appLogger.log(`🚀 Backend running on: http://localhost:${port}`, {
    port,
    environment: process.env.NODE_ENV || 'development',
    type: 'startup',
  });

  appLogger.log(`📚 Swagger documentation: http://localhost:${port}/api`, {
    port,
    type: 'startup',
  });
}

bootstrap(); 