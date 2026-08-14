export interface SemesterProperties {
  id: string;
  name: string;
  nameNormalized: string;
  startDate: Date;
  endDate: Date;
  midTermStartDate?: Date | null;
  midTermEndDate?: Date | null;
  archivedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Semester {
  private constructor(private readonly properties: SemesterProperties) {}

  static create(properties: SemesterProperties): Semester {
    const name = properties.name.trim();
    const nameNormalized = name.toLowerCase();
    if (!name) throw new Error('Semester name is required.');
    if (!(properties.startDate < properties.endDate))
      throw new Error('Semester startDate must be before endDate.');
    const hasMidTermStart = properties.midTermStartDate != null;
    const hasMidTermEnd = properties.midTermEndDate != null;
    if (hasMidTermStart !== hasMidTermEnd)
      throw new Error('Semester mid-term requires both start and end dates.');
    if (
      hasMidTermStart &&
      hasMidTermEnd &&
      (!(properties.midTermStartDate! < properties.midTermEndDate!) ||
        properties.midTermStartDate! < properties.startDate ||
        properties.midTermEndDate! > properties.endDate)
    )
      throw new Error('Semester mid-term must be inside the semester.');
    return new Semester({
      ...properties,
      name,
      nameNormalized,
      archivedAt: properties.archivedAt ?? null,
    });
  }

  get id(): string {
    return this.properties.id;
  }
  get name(): string {
    return this.properties.name;
  }
  get nameNormalized(): string {
    return this.properties.nameNormalized;
  }
  get startDate(): Date {
    return this.properties.startDate;
  }
  get endDate(): Date {
    return this.properties.endDate;
  }
  get midTermStartDate(): Date | null {
    return this.properties.midTermStartDate ?? null;
  }
  get midTermEndDate(): Date | null {
    return this.properties.midTermEndDate ?? null;
  }
  get archivedAt(): Date | null {
    return this.properties.archivedAt ?? null;
  }
  get createdAt(): Date {
    return this.properties.createdAt;
  }
  get updatedAt(): Date {
    return this.properties.updatedAt;
  }
}
