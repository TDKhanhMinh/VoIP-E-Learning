import type { Course } from '../../../domain/courses/course.entity';

export interface CourseResponse {
  id: string;
  code: string;
  name: string;
  title?: string;
  credit?: number;
  description?: string | null;
  ownerId?: string;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
export class CoursePresenter {
  static toHttp(course: Course): CourseResponse {
    return {
      id: course.id,
      code: course.code,
      name: course.name,
      ...(course.title === undefined ? {} : { title: course.title }),
      ...(course.credit === undefined ? {} : { credit: course.credit }),
      ...(course.description === undefined
        ? {}
        : { description: course.description }),
      ownerId: course.ownerId,
      archivedAt: course.archivedAt?.toISOString() ?? null,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
    };
  }
}
