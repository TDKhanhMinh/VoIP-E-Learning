import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { CurrentActor } from '../../../../application/auth/ports/token-service.port';

export const CurrentActorDecorator = createParamDecorator(
  (_data: unknown, context: ExecutionContext): CurrentActor => {
    return context.switchToHttp().getRequest<{ actor: CurrentActor }>().actor;
  },
);
