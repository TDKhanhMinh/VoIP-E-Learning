import { HttpStatus, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { Logger as PinoLogger } from 'nestjs-pino';
import { getCorsOrigins } from '../config/runtime-config';

export function configureApp(app: NestExpressApplication): void {
  const config = app.get(ConfigService);
  const apiPrefix = config.getOrThrow<string>('API_PREFIX');
  const apiVersion = config.getOrThrow<string>('API_VERSION');
  const bodyLimit = config.getOrThrow<string>('BODY_LIMIT');

  app.useLogger(app.get(PinoLogger));
  app.set('trust proxy', config.getOrThrow<boolean>('TRUST_PROXY') ? 1 : false);
  app.use(helmet());
  app.enableCors({
    origin: getCorsOrigins(config),
    credentials: true,
  });
  app.useBodyParser('json', { limit: bodyLimit });
  app.useBodyParser('urlencoded', { extended: true, limit: bodyLimit });
  app.setGlobalPrefix(apiPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: apiVersion,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );
  app.enableShutdownHooks();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('VoIP E-Learning Remake API')
    .setDescription('Clean Architecture API contract for backend-remake')
    .setVersion(apiVersion)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    jsonDocumentUrl: `${apiPrefix}/docs-json`,
  });
}
