import { ApplicationError } from '../errors/application.error';
import type { ClockPort } from '../ports/clock.port';
import type { IdGeneratorPort } from '../ports/id-generator.port';
import type { PageRequest } from '../pagination/page-request';
import type { PaginatedResult } from '../pagination/paginated-result';
import { Semester } from '../../domain/semesters/semester.entity';
import type { SemesterRepositoryPort } from './ports/semester.repository.port';

export interface SemesterWriteInput {
  name?: string;
  startDate?: Date;
  endDate?: Date;
  midTermStartDate?: Date | null;
  midTermEndDate?: Date | null;
}

export class SemesterCatalogService {
  constructor(
    private readonly semesters: SemesterRepositoryPort,
    private readonly ids: IdGeneratorPort,
    private readonly clock: ClockPort,
  ) {}

  list(pageRequest: PageRequest): Promise<PaginatedResult<Semester>> {
    return this.semesters.list(pageRequest);
  }

  getById(id: string): Promise<Semester | null> {
    return this.semesters.findById(id);
  }

  async create(input: SemesterWriteInput): Promise<Semester> {
    const fields = this.normalizeInput(input);
    if (await this.semesters.findByNameNormalized(fields.nameNormalized))
      throw this.conflict(
        'SEMESTER_NAME_ALREADY_EXISTS',
        'Semester name already exists',
      );
    const now = this.clock.now();
    const semester = Semester.create({
      id: this.ids.generate(),
      ...fields,
      archivedAt: null,
      createdAt: now,
      updatedAt: now,
    });
    await this.semesters.save(semester);
    return semester;
  }

  async update(
    id: string,
    input: SemesterWriteInput,
  ): Promise<Semester | null> {
    const existing = await this.semesters.findById(id);
    if (!existing) return null;
    const fields = this.normalizeInput({
      name: input.name ?? existing.name,
      startDate: input.startDate ?? existing.startDate,
      endDate: input.endDate ?? existing.endDate,
      midTermStartDate:
        input.midTermStartDate === undefined
          ? existing.midTermStartDate
          : input.midTermStartDate,
      midTermEndDate:
        input.midTermEndDate === undefined
          ? existing.midTermEndDate
          : input.midTermEndDate,
    });
    const duplicate = await this.semesters.findByNameNormalized(
      fields.nameNormalized,
    );
    if (duplicate && duplicate.id !== id)
      throw this.conflict(
        'SEMESTER_NAME_ALREADY_EXISTS',
        'Semester name already exists',
      );
    return this.semesters.update(id, {
      ...fields,
      updatedAt: this.clock.now(),
    });
  }

  async archive(id: string): Promise<void> {
    const existing = await this.semesters.findById(id);
    if (!existing)
      throw new ApplicationError('Semester was not found', {
        code: 'SEMESTER_NOT_FOUND',
        kind: 'not_found',
      });
    if ((await this.semesters.countReferences(id)) > 0)
      throw new ApplicationError(
        'Semester has dependent classes and cannot be archived',
        { code: 'SEMESTER_HAS_DEPENDENCIES', kind: 'conflict' },
      );
    await this.semesters.update(id, { archivedAt: this.clock.now() });
  }

  private normalizeInput(input: SemesterWriteInput) {
    if (!input.name || !input.startDate || !input.endDate)
      throw new ApplicationError(
        'Semester name, startDate and endDate are required',
        { code: 'SEMESTER_INVALID_INPUT', kind: 'validation' },
      );
    try {
      const candidate = Semester.create({
        id: '000000000000000000000000',
        name: input.name,
        nameNormalized: input.name.trim().toLowerCase(),
        startDate: input.startDate,
        endDate: input.endDate,
        midTermStartDate: input.midTermStartDate,
        midTermEndDate: input.midTermEndDate,
        createdAt: input.startDate,
        updatedAt: input.startDate,
      });
      return {
        name: candidate.name,
        nameNormalized: candidate.nameNormalized,
        startDate: candidate.startDate,
        endDate: candidate.endDate,
        midTermStartDate: candidate.midTermStartDate,
        midTermEndDate: candidate.midTermEndDate,
      };
    } catch (error: unknown) {
      throw new ApplicationError(
        error instanceof Error ? error.message : 'Invalid semester dates',
        { code: 'SEMESTER_INVALID_DATES', kind: 'validation' },
      );
    }
  }

  private conflict(code: string, message: string): ApplicationError {
    return new ApplicationError(message, { code, kind: 'conflict' });
  }
}
