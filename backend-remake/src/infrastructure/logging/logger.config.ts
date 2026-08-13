import type { ConfigService } from '@nestjs/config';
import type { Params } from 'nestjs-pino';
import { resolveRequestId } from '../../interface-adapters/http/request-context';

export function createLoggerConfig(config: ConfigService): Params {
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
      redact: {
        paths: [
          'req.headers.authorization',
          'req.headers.cookie',
          'req.body.password',
          'req.body.token',
          'req.body.refreshToken',
          'res.headers["set-cookie"]',
        ],
        censor: '[REDACTED]',
      },
    },
  };
}
