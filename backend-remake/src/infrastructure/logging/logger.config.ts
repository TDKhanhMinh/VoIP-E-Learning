import type { ConfigService } from '@nestjs/config';
import type { Params } from 'nestjs-pino';
import { resolveRequestId } from '../../interface-adapters/http/request-context';

export function createLoggerConfig(config: ConfigService): Params {
  const fileLoggingEnabled = config.getOrThrow<boolean>('LOG_FILE_ENABLED');
  return {
    pinoHttp: {
      level: process.env.JEST_WORKER_ID
        ? 'silent'
        : config.getOrThrow<string>('LOG_LEVEL'),
      genReqId: (request, response) => {
        const requestId = resolveRequestId(request.headers['x-request-id']);
        response.setHeader('x-request-id', requestId);
        return requestId;
      },
      customProps: (request) => ({ requestId: request.id }),
      transport: fileLoggingEnabled
        ? {
            target: 'pino/file',
            options: {
              destination: config.getOrThrow<string>('LOG_FILE_PATH'),
              mkdir: true,
            },
          }
        : undefined,
      redact: {
        paths: [
          'req.headers.authorization',
          'req.headers.cookie',
          'req.body.password',
          'req.body.passwordHash',
          'req.body.sipPassword',
          'req.body.token',
          'req.body.accessToken',
          'req.body.refreshToken',
          'req.body.presignedUrl',
          'req.body.transcript',
          'req.body.embeddingQuery',
          'req.body.message',
          'req.body.content',
          'res.headers["set-cookie"]',
        ],
        censor: '[REDACTED]',
      },
    },
  };
}
