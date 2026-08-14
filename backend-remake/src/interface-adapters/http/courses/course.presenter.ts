import type { Course } from '../../../domain/courses/course.entity';

export interface CourseResponse {
  id: string;
  code: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
export class CoursePresenter {
  static toHttp(course: Course): CourseResponse {
    return {
      id: course.id,
      code: course.code,
      name: course.name,
      ownerId: course.ownerId,
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
    };
  }
}
