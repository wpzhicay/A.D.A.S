import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get frontend URL from environment or default to localhost
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
  
  // Enable CORS with proper configuration for production
  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
     const allowedOrigins = [
  'https://agent-6a5d1d4413e70a7a03--lambent-centaur-1f63a7.netlify.app',
  'http://localhost:4200',
];
      
      if (!origin || allowedOrigins.some(allowed => origin.includes(allowed) || origin === allowed)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Use PORT from environment (Railway sets this) or default to 3000
  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
