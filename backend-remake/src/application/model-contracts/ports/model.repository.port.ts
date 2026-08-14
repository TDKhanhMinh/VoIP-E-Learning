import type { ModelRecord } from '../../../domain/model-contracts/model.entity';

/**
 * Persistence contract only. Query and command-specific repository ports are
 * introduced with the corresponding application use case, never at model-import
 * time.
 */
export interface ModelRepositoryPort<T extends ModelRecord> {
  findById(id: string): Promise<T | null>;
  save(model: T): Promise<void>;
}
