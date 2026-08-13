export interface CourseProperties {
  id: string;
  code: string;
  codeNormalized: string;
  name: string;
  /** V1 equivalent of `name`; retained for lossless data migration. */
  title?: string;
  credit?: number;
  description?: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Course {
  private constructor(private readonly properties: CourseProperties) {}

  static create(properties: CourseProperties): Course {
    return new Course({
      ...properties,
      code: properties.code.trim().toUpperCase(),
      codeNormalized: properties.code.trim().toLowerCase(),
      name: properties.name.trim(),
    });
  }

  get id(): string {
    return this.properties.id;
  }
  get code(): string {
    return this.properties.code;
  }
  get codeNormalized(): string {
    return this.properties.codeNormalized;
  }
  get name(): string {
    return this.properties.name;
  }
  get title(): string | undefined {
    return this.properties.title;
  }
  get credit(): number | undefined {
    return this.properties.credit;
  }
  get description(): string | null | undefined {
    return this.properties.description;
  }
  get ownerId(): string {
    return this.properties.ownerId;
  }
  get createdAt(): Date {
    return this.properties.createdAt;
  }
  get updatedAt(): Date {
    return this.properties.updatedAt;
  }
}
