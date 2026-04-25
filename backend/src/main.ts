import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';
import { AppLoggerService } from './common/logger/app-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(AppLoggerService);

  app.useLogger(logger);
  configureApp(app);
  const port = Number(process.env.PORT ?? 3333);

  await app.listen(port);
  logger.log('Backend started', 'Bootstrap', {
    port,
    environment: process.env.NODE_ENV ?? 'development',
  });
}
void bootstrap();
