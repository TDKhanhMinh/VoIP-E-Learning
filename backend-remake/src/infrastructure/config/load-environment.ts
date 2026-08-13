import { config } from 'dotenv';
import { resolve } from 'node:path';

/**
 * Loads the environment before dynamic Nest modules decide whether a persistence
 * adapter is enabled. ConfigModule validates the resulting values afterwards.
 */
export function loadEnvironment(): void {
  const nodeEnvironment = process.env.NODE_ENV ?? 'development';

  config({
    path: [
      resolve(process.cwd(), `.env.${nodeEnvironment}`),
      resolve(process.cwd(), '.env'),
    ],
    override: false,
    quiet: true,
  });
}
