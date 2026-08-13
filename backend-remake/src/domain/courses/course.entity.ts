export interface CourseProperties {
  id: string;
  code: string;
  codeNormalized: string;
  name: string;
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
