import type { Semester } from '../../../domain/semesters/semester.entity';

export interface SemesterResponse {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  midTermStartDate: string | null;
  midTermEndDate: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export class SemesterPresenter {
  static toHttp(semester: Semester): SemesterResponse {
    return {
      id: semester.id,
      name: semester.name,
      startDate: semester.startDate.toISOString(),
      endDate: semester.endDate.toISOString(),
      midTermStartDate: semester.midTermStartDate?.toISOString() ?? null,
      midTermEndDate: semester.midTermEndDate?.toISOString() ?? null,
      archivedAt: semester.archivedAt?.toISOString() ?? null,
      createdAt: semester.createdAt.toISOString(),
      updatedAt: semester.updatedAt.toISOString(),
    };
  }
}
