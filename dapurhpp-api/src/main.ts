import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  try {
    console.log('Initializing NestFactory...');
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors({
      origin: 'http://localhost:3000',
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.setGlobalPrefix('api');

    // Serve uploaded files
    app.useStaticAssets(join(process.cwd(), 'uploads'), {
      prefix: '/uploads/',
    });

    const port = process.env.PORT ?? 3001;
    console.log(`Attempting to listen on port ${port}...`);
    await app.listen(port);
    console.log(`✅ DapurHPP API running on http://localhost:${port}`);
  } catch (error) {
    console.error('❌ Bootstrap failed with error:', error);
  }
}
bootstrap();
