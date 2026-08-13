import {
  type LegacyObjectId,
  LegacyModelEntity,
  type LegacyRecord,
} from './legacy-model.entity';

export type AttendanceStatus = 'present' | 'absent' | 'late';
export type ConversationType = 'private' | 'group';
export type DocumentLevel = 'Beginner' | 'Intermediate' | 'Advanced' | '';
export type MessageType = 'text' | 'image' | 'file';
export type PostStatus = 'pending' | 'approved' | 'rejected';
export type LessonAiStatus =
  'IDLE' | 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type RoomStatus = 'active' | 'ended';
export type RoomParticipantRole = 'teacher' | 'student';
export type TeachingScheduleStatus = 'SCHEDULED' | 'COMPLETED' | 'ABSENT';

export interface AnnouncementProperties extends LegacyRecord {
  classId: LegacyObjectId;
  title: string;
  content: string | null;
  createdBy: LegacyObjectId;
  fileUrl: string | null;
  fileName: string | null;
}
export class AnnouncementEntity extends LegacyModelEntity<AnnouncementProperties> {}

export interface AssignmentProperties extends LegacyRecord {
  title: string;
  description?: string;
  classId: LegacyObjectId;
  dueAt?: Date;
}
export class AssignmentEntity extends LegacyModelEntity<AssignmentProperties> {}

export interface AttendanceProperties extends LegacyRecord {
  classId: LegacyObjectId;
  studentId: LegacyObjectId;
  status: AttendanceStatus;
  lesson: number;
  attendAt: Date | null;
}
export class AttendanceEntity extends LegacyModelEntity<AttendanceProperties> {}

export interface ClassScheduleItem {
  dayOfWeek: 2 | 3 | 4 | 5 | 6 | 7;
  shift: 1 | 2 | 3 | 4;
  type: 'theory' | 'practice';
  room: string;
}
export interface ClassProperties extends LegacyRecord {
  name: string;
  schedule: readonly ClassScheduleItem[];
  courseId: LegacyObjectId;
  semesterId: LegacyObjectId;
  teacherId: LegacyObjectId;
  theoryWeeks: number;
  practiceWeeks?: number;
  absent: readonly { date: Date }[];
}
export class ClassEntity extends LegacyModelEntity<ClassProperties> {}

export interface ClassStudentProperties extends LegacyRecord {
  classId: LegacyObjectId;
  studentId: LegacyObjectId;
  joinedAt?: Date;
}
export class ClassStudentEntity extends LegacyModelEntity<ClassStudentProperties> {}

export interface CommentProperties extends LegacyRecord {
  postId: string;
  authorId: string;
  authorName?: string;
  content?: string;
}
export class CommentEntity extends LegacyModelEntity<CommentProperties> {}

export interface ConversationProperties extends LegacyRecord {
  participants: readonly LegacyObjectId[];
  type: ConversationType;
  lastMessageId?: LegacyObjectId;
}
export class ConversationEntity extends LegacyModelEntity<ConversationProperties> {}

export interface DocumentProperties extends LegacyRecord {
  title: string;
  description: string;
  tags: readonly string[];
  level: DocumentLevel;
  link: string;
  embedding: readonly number[];
  titleEmbedding: readonly number[] | null;
  tagsEmbedding: readonly number[] | null;
  levelEmbedding: readonly number[] | null;
  descriptionEmbedding: readonly number[] | null;
}
export class DocumentEntity extends LegacyModelEntity<DocumentProperties> {}

export interface MaterialProperties extends LegacyRecord {
  title: string;
  fileUrl: string;
  classId: LegacyObjectId;
  uploadedBy: LegacyObjectId;
}
export class MaterialEntity extends LegacyModelEntity<MaterialProperties> {}

export interface MessageProperties extends LegacyRecord {
  conversationId: LegacyObjectId;
  senderId: LegacyObjectId;
  receiverId: LegacyObjectId;
  messageType: MessageType;
  content: string;
  isRead: boolean;
}
export class MessageEntity extends LegacyModelEntity<MessageProperties> {}

export interface OnlineTestProperties extends LegacyRecord {
  classId?: LegacyObjectId;
  teacherId: LegacyObjectId;
  title: string;
  available: boolean;
  start: Date;
  end: Date;
  time: string;
  attempts: number;
  description?: string;
  shuffle: boolean;
  isPublished: boolean;
  totalQuestions: number;
}
export class OnlineTestEntity extends LegacyModelEntity<OnlineTestProperties> {}

export interface PostProperties extends LegacyRecord {
  classId?: string;
  topicId?: LegacyObjectId;
  authorId: string;
  authorName?: string;
  content?: string;
  title?: string;
  status: PostStatus;
}
export class PostEntity extends LegacyModelEntity<PostProperties> {}

export interface RecordLessonSummaryProperties extends LegacyRecord {
  roomName: string;
  classId: LegacyObjectId;
  teacherId: LegacyObjectId;
  createdBy: string;
  egressId?: string;
  recordingUrl?: string;
  summaryTitle: string;
  aiTranscript: string;
  aiSummary: string;
  aiStatus: LessonAiStatus;
  isReviewed: boolean;
  isPublished: boolean;
  aiError?: string;
}
export class RecordLessonSummaryEntity extends LegacyModelEntity<RecordLessonSummaryProperties> {}

export interface RoomParticipant {
  userId?: LegacyObjectId;
  email?: string;
  name?: string;
  role: RoomParticipantRole;
  joinedAt: Date;
  leftAt?: Date;
  duration?: number;
}
export interface RoomProperties extends LegacyRecord {
  classId: LegacyObjectId;
  teacherId?: LegacyObjectId;
  teacherEmail?: string;
  teacherName?: string;
  roomName?: string;
  joinCode?: string;
  startedAt?: Date;
  endedAt?: Date;
  status: RoomStatus;
  participants: readonly RoomParticipant[];
  metadata?: Record<string, unknown>;
}
export class RoomEntity extends LegacyModelEntity<RoomProperties> {}

export interface SemesterProperties extends LegacyRecord {
  name: string;
  startDate?: Date;
  endDate?: Date;
  midTerm?: { startDate?: Date; endDate?: Date };
}
export class SemesterEntity extends LegacyModelEntity<SemesterProperties> {}

export interface SubmissionProperties extends LegacyRecord {
  assignmentId: LegacyObjectId;
  studentId: LegacyObjectId;
  fileUrl: string;
  fileName?: string;
  score: number;
  feedback: string | null;
  graded: boolean;
}
export class SubmissionEntity extends LegacyModelEntity<SubmissionProperties> {}

export interface TeachingScheduleProperties extends LegacyRecord {
  classId: LegacyObjectId;
  teacherId: LegacyObjectId;
  date: Date;
  status: TeachingScheduleStatus;
  startTime: string;
  endTime: string;
}
export class TeachingScheduleEntity extends LegacyModelEntity<TeachingScheduleProperties> {}

export interface TestAttemptProperties extends LegacyRecord {
  studentId: LegacyObjectId;
  onlineTestId: LegacyObjectId;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  submittedAt: Date;
}
export class TestAttemptEntity extends LegacyModelEntity<TestAttemptProperties> {}

export interface TestQuestionOption {
  id?: LegacyObjectId;
  answer: string;
  isCorrect: boolean;
}
export interface TestQuestionProperties extends LegacyRecord {
  testId: LegacyObjectId;
  question: string;
  options: readonly TestQuestionOption[];
  image: string | null;
}
export class TestQuestionEntity extends LegacyModelEntity<TestQuestionProperties> {}

export interface TestSessionQuestionOption {
  id?: LegacyObjectId;
  answer?: string;
}
export interface TestSessionQuestion {
  questionId?: LegacyObjectId;
  question?: string;
  image?: string;
  options: readonly TestSessionQuestionOption[];
  selectedOptionId: LegacyObjectId | null;
}
export interface TestSessionProperties extends LegacyRecord {
  testId?: LegacyObjectId;
  studentId?: LegacyObjectId;
  startedAt?: Date;
  remainingTime?: number;
  questions: readonly TestSessionQuestion[];
  finished: boolean;
}
export class TestSessionEntity extends LegacyModelEntity<TestSessionProperties> {}

export interface TopicProperties extends LegacyRecord {
  title: string;
  description: string;
}
export class TopicEntity extends LegacyModelEntity<TopicProperties> {}
