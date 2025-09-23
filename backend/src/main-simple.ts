import { NestFactory } from '@nestjs/core';
import { AppModule } from './app-simple.module';

async function bootstrap() {
    try {
        const app = await NestFactory.create(AppModule);

        // Enable CORS for frontend communication
        app.enableCors({
            origin: 'http://localhost:3000',
            credentials: true,
        });

        const port = 3001;
        await app.listen(port);

        console.log(`🚀 Backend running on: http://localhost:${port}`);
    } catch (error) {
        console.error('❌ Error starting backend:', error);
        process.exit(1);
    }
}

bootstrap();
