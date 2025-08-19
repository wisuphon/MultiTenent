import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      // Allow localhost subdomains for development
      /^http:\/\/.*\.localhost:\d+$/,
      // Allow production subdomains
      /^https?:\/\/.*\.yourdomain\.com$/,
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-Host'],
  });

  await app.listen(3000);
}
bootstrap();