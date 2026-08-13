/**
 * Framework-free representation of a persisted model. It deliberately contains
 * no validation or behavior: V1 data rules are migrated as schema metadata and
 * will move into individual use cases only when a feature slice is implemented.
 */
export abstract class LegacyModelEntity<T extends LegacyRecord> {
  public constructor(private readonly properties: Readonly<T>) {}

  get id(): LegacyObjectId {
    return this.properties.id;
  }

  get createdAt(): Date | undefined {
    return this.properties.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.properties.updatedAt;
  }

  toPrimitives(): Readonly<T> {
    return this.properties;
  }
}

export type LegacyObjectId = string;

export interface LegacyRecord {
  id: LegacyObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
