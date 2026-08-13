import type { LegacyRecord } from '../../../domain/legacy-models/legacy-model.entity';

/**
 * Persistence contract only. Query and command-specific repository ports are
 * introduced with the corresponding application use case, never at model-import
 * time.
 */
export interface LegacyModelRepositoryPort<T extends LegacyRecord> {
  findById(id: string): Promise<T | null>;
  save(model: T): Promise<void>;
}
