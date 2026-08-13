import type {
  OnlineTestProperties,
  TestAttemptProperties,
  TestQuestionProperties,
  TestSessionProperties,
} from '../../../domain/assessments/assessments.models';
import type { ModelObjectId } from '../../../domain/model-contracts/model.entity';

type CreateModelInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateModelInput<T> = Partial<CreateModelInput<T>>;

export interface AttemptAvailability {
  canAttempt: boolean;
  attemptsUsed: number;
  attemptsAllowed: number;
}

/** Application boundary mapped from V1 online-test, question, session and attempt services. */
export interface AssessmentsServicePort {
  listOnlineTests(): Promise<readonly OnlineTestProperties[]>;
  getOnlineTestById(
    testId: ModelObjectId,
  ): Promise<OnlineTestProperties | null>;
  getOnlineTestsByClass(
    classId: ModelObjectId,
  ): Promise<readonly OnlineTestProperties[]>;
  getOnlineTestsByStudent(
    studentId: ModelObjectId,
  ): Promise<readonly OnlineTestProperties[]>;
  createOnlineTest(
    input: CreateModelInput<OnlineTestProperties>,
  ): Promise<OnlineTestProperties>;
  updateOnlineTest(
    testId: ModelObjectId,
    input: UpdateModelInput<OnlineTestProperties>,
  ): Promise<OnlineTestProperties | null>;
  replaceOnlineTestQuestions(
    testId: ModelObjectId,
    questions: readonly CreateModelInput<TestQuestionProperties>[],
  ): Promise<OnlineTestProperties | null>;
  deleteOnlineTest(testId: ModelObjectId): Promise<void>;

  listQuestions(): Promise<readonly TestQuestionProperties[]>;
  getQuestionsByTest(
    testId: ModelObjectId,
  ): Promise<readonly TestQuestionProperties[]>;
  createQuestion(
    input: CreateModelInput<TestQuestionProperties>,
  ): Promise<TestQuestionProperties>;
  updateQuestion(
    questionId: ModelObjectId,
    input: UpdateModelInput<TestQuestionProperties>,
  ): Promise<TestQuestionProperties | null>;
  deleteQuestion(questionId: ModelObjectId): Promise<void>;
  deleteQuestionsByTest(testId: ModelObjectId): Promise<void>;

  createTestSession(
    input: CreateModelInput<TestSessionProperties>,
  ): Promise<TestSessionProperties>;
  getTestSessionById(
    sessionId: ModelObjectId,
  ): Promise<TestSessionProperties | null>;
  updateTestSession(
    sessionId: ModelObjectId,
    input: UpdateModelInput<TestSessionProperties>,
  ): Promise<TestSessionProperties | null>;
  deleteTestSession(sessionId: ModelObjectId): Promise<void>;
  getTestSessionsByTestAndStudent(
    testId: ModelObjectId,
    studentId: ModelObjectId,
  ): Promise<readonly TestSessionProperties[]>;
  autoSubmitExpiredSessions(): Promise<readonly TestSessionProperties[]>;

  getAttemptsByStudentAndTest(
    studentId: ModelObjectId,
    testId: ModelObjectId,
  ): Promise<readonly TestAttemptProperties[]>;
  checkAttemptAvailability(
    studentId: ModelObjectId,
    testId: ModelObjectId,
  ): Promise<AttemptAvailability>;
  createTestAttemptFromSession(
    sessionId: ModelObjectId,
  ): Promise<TestAttemptProperties>;
  getTestAttemptById(
    attemptId: ModelObjectId,
  ): Promise<TestAttemptProperties | null>;
  getAttemptsByTest(
    testId: ModelObjectId,
  ): Promise<readonly TestAttemptProperties[]>;
  getAttemptsByStudent(
    studentId: ModelObjectId,
  ): Promise<readonly TestAttemptProperties[]>;
}

export const ASSESSMENTS_SERVICE = Symbol('ASSESSMENTS_SERVICE');
