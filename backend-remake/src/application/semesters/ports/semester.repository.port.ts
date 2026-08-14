import type { PageRequest } from '../../pagination/page-request';
import type { PaginatedResult } from '../../pagination/paginated-result';
import type { Semester } from '../../../domain/semesters/semester.entity';

export const SEMESTER_REPOSITORY = Symbol('SEMESTER_REPOSITORY');

export interface SemesterRepositoryPort {
  findById(id: string): Promise<Semester | null>;
  findByNameNormalized(nameNormalized: string): Promise<Semester | null>;
  save(semester: Semester): Promise<void>;
  update(
    id: string,
    changes: Partial<{
      name: string;
      nameNormalized: string;
      startDate: Date;
      endDate: Date;
      midTermStartDate: Date | null;
      midTermEndDate: Date | null;
      archivedAt: Date | null;
      updatedAt: Date;
    }>,
  ): Promise<Semester | null>;
  list(
    pageRequest: PageRequest,
    options?: { includeArchived?: boolean },
  ): Promise<PaginatedResult<Semester>>;
  countReferences(id: string): Promise<number>;
}
