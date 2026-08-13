import { ApplicationError } from '../errors/application.error';
import type { CurrentActor } from '../auth/ports/token-service.port';

export function assertResourceOwnership(
  actor: CurrentActor,
  ownerId: string,
): void {
  if (actor.userId === ownerId || actor.roles.includes('admin')) return;

  throw new ApplicationError('You do not own this resource', {
    code: 'RESOURCE_FORBIDDEN',
    kind: 'forbidden',
  });
}
