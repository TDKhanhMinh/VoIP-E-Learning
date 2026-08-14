export const REALTIME_SESSION_REVOCATION = Symbol(
  'REALTIME_SESSION_REVOCATION',
);

/**
 * Transport adapters implement this port to close active Socket connections
 * after an account/session revocation. The default adapter is intentionally a
 * no-op while the Socket provider remains disabled.
 */
export interface RealtimeSessionRevocationPort {
  disconnectUser(userId: string): Promise<void>;
}
