import { Injectable } from '@nestjs/common';
import type { RealtimeSessionRevocationPort } from '../../application/auth/ports/realtime-session-revocation.port';

@Injectable()
export class NoopRealtimeSessionRevocationAdapter implements RealtimeSessionRevocationPort {
  disconnectUser(userId: string): Promise<void> {
    // Socket transport is not enabled until its adapter and runtime gates exist.
    void userId;
    return Promise.resolve();
  }
}
