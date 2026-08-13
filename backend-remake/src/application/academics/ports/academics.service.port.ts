import type {
  AttendanceProperties,
  ClassProperties,
  ClassStudentProperties,
  SemesterProperties,
  TeachingScheduleProperties,
} from '../../../domain/academics/academics.models';
import type { ModelObjectId } from '../../../domain/model-contracts/model.entity';

type CreateModelInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateModelInput<T> = Partial<CreateModelInput<T>>;

export interface TeachingAbsenceInput {
  teacherId: ModelObjectId;
  classId: ModelObjectId;
  targetDate: Date;
  shift: number;
}

/** Application boundary mapped from V1 academic services; no behavior is implemented here. */
export interface AcademicsServicePort {
  listClasses(): Promise<readonly ClassProperties[]>;
  getClassById(classId: ModelObjectId): Promise<ClassProperties | null>;
  getClassesForUser(userId: ModelObjectId): Promise<readonly ClassProperties[]>;
  createClass(
    input: CreateModelInput<ClassProperties>,
  ): Promise<ClassProperties>;
  updateClass(
    classId: ModelObjectId,
    input: UpdateModelInput<ClassProperties>,
  ): Promise<ClassProperties | null>;
  addClassAbsenceDate(
    classId: ModelObjectId,
    date: Date,
  ): Promise<ClassProperties | null>;
  deleteClass(classId: ModelObjectId): Promise<void>;

  listSemesters(): Promise<readonly SemesterProperties[]>;
  getSemesterById(
    semesterId: ModelObjectId,
  ): Promise<SemesterProperties | null>;
  createSemester(
    input: CreateModelInput<SemesterProperties>,
  ): Promise<SemesterProperties>;
  updateSemester(
    semesterId: ModelObjectId,
    input: UpdateModelInput<SemesterProperties>,
  ): Promise<SemesterProperties | null>;
  deleteSemester(semesterId: ModelObjectId): Promise<void>;

  listEnrollments(): Promise<readonly ClassStudentProperties[]>;
  getEnrollmentById(
    enrollmentId: ModelObjectId,
  ): Promise<ClassStudentProperties | null>;
  getEnrollmentsByStudent(
    studentId: ModelObjectId,
  ): Promise<readonly ClassStudentProperties[]>;
  getClassStudents(
    classId: ModelObjectId,
  ): Promise<readonly ClassStudentProperties[]>;
  createEnrollment(
    input: CreateModelInput<ClassStudentProperties>,
  ): Promise<ClassStudentProperties>;
  deleteEnrollment(enrollmentId: ModelObjectId): Promise<void>;

  listAttendance(): Promise<readonly AttendanceProperties[]>;
  getAttendanceById(
    attendanceId: ModelObjectId,
  ): Promise<AttendanceProperties | null>;
  getAttendanceByClass(
    classId: ModelObjectId,
  ): Promise<readonly AttendanceProperties[]>;
  getAttendanceByStudent(
    studentId: ModelObjectId,
  ): Promise<readonly AttendanceProperties[]>;
  createAttendance(
    input: CreateModelInput<AttendanceProperties>,
  ): Promise<AttendanceProperties>;
  updateAttendance(
    attendanceId: ModelObjectId,
    input: UpdateModelInput<AttendanceProperties>,
  ): Promise<AttendanceProperties | null>;
  deleteAttendance(attendanceId: ModelObjectId): Promise<void>;

  getTeachingSchedulesByTeacher(
    teacherId: ModelObjectId,
  ): Promise<readonly TeachingScheduleProperties[]>;
  getTeachingSchedulesByClass(
    classId: ModelObjectId,
  ): Promise<readonly TeachingScheduleProperties[]>;
  getTeachingScheduleById(
    scheduleId: ModelObjectId,
  ): Promise<TeachingScheduleProperties | null>;
  markTeachingAbsence(
    input: TeachingAbsenceInput,
  ): Promise<TeachingScheduleProperties | null>;
}

export const ACADEMICS_SERVICE = Symbol('ACADEMICS_SERVICE');
