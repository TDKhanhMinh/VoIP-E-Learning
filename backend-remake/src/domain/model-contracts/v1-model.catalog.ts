export type V1ModelName =
  | 'announcement'
  | 'assignment'
  | 'attendance'
  | 'class'
  | 'classStudent'
  | 'comment'
  | 'conversation'
  | 'course'
  | 'document'
  | 'material'
  | 'message'
  | 'onlineTest'
  | 'post'
  | 'recordLessonSummary'
  | 'room'
  | 'semester'
  | 'submission'
  | 'teachingSchedule'
  | 'testAttempt'
  | 'testQuestion'
  | 'testSession'
  | 'topic'
  | 'user';

/** Maps every active V1 mongoose model to its remake persistence owner. */
export type V1FeatureName =
  | 'academics'
  | 'assessments'
  | 'auth-foundation'
  | 'collaboration'
  | 'community'
  | 'course-pilot'
  | 'knowledge'
  | 'learning';

export const V1_MODEL_CATALOG: Readonly<Record<V1ModelName, V1FeatureName>> = {
  announcement: 'learning',
  assignment: 'learning',
  attendance: 'academics',
  class: 'academics',
  classStudent: 'academics',
  comment: 'community',
  conversation: 'collaboration',
  course: 'course-pilot',
  document: 'knowledge',
  material: 'learning',
  message: 'collaboration',
  onlineTest: 'assessments',
  post: 'community',
  recordLessonSummary: 'collaboration',
  room: 'collaboration',
  semester: 'academics',
  submission: 'learning',
  teachingSchedule: 'academics',
  testAttempt: 'assessments',
  testQuestion: 'assessments',
  testSession: 'assessments',
  topic: 'community',
  user: 'auth-foundation',
};
