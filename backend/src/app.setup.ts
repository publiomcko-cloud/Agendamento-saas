import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { RequestLoggingInterceptor } from './common/interceptors/request-logging.interceptor';
import { AppLoggerService } from './common/logger/app-logger.service';

export function configureApp(app: INestApplication) {
  const logger = app.get(AppLoggerService);
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
    : true;

  app.enableCors({
    origin: corsOrigins,
  });
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new GlobalExceptionFilter(logger));
  app.useGlobalInterceptors(new RequestLoggingInterceptor(logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Agendamento SaaS API')
    .setDescription(
      'API do sistema de agendamento e gestao para pequenas empresas.',
    )
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  logger.log('Application configured', 'AppSetup', {
    corsOrigins,
    globalPrefix: 'api',
    swaggerPath: '/api',
  });
}
