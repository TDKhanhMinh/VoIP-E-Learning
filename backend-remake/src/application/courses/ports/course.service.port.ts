import type {
  Course,
  CourseProperties,
} from '../../../domain/courses/course.entity';

export type CreateCourseInput = Omit<
  CourseProperties,
  'id' | 'codeNormalized' | 'createdAt' | 'updatedAt'
>;
export type UpdateCourseInput = Partial<CreateCourseInput>;

/** V1 course service contract; existing create/list use cases remain the current implementation. */
export interface CourseServicePort {
  listCourses(): Promise<readonly Course[]>;
  getCourseById(courseId: string): Promise<Course | null>;
  getCourseByCode(code: string): Promise<Course | null>;
  createCourse(input: CreateCourseInput): Promise<Course>;
  updateCourse(
    courseId: string,
    input: UpdateCourseInput,
  ): Promise<Course | null>;
  deleteCourse(courseId: string): Promise<void>;
}

export const COURSE_SERVICE = Symbol('COURSE_SERVICE');
