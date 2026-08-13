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
export const V1_MODEL_CATALOG: Readonly<Record<V1ModelName, string>> = {
  announcement: 'legacy-models',
  assignment: 'legacy-models',
  attendance: 'legacy-models',
  class: 'legacy-models',
  classStudent: 'legacy-models',
  comment: 'legacy-models',
  conversation: 'legacy-models',
  course: 'course-pilot',
  document: 'legacy-models',
  material: 'legacy-models',
  message: 'legacy-models',
  onlineTest: 'legacy-models',
  post: 'legacy-models',
  recordLessonSummary: 'legacy-models',
  room: 'legacy-models',
  semester: 'legacy-models',
  submission: 'legacy-models',
  teachingSchedule: 'legacy-models',
  testAttempt: 'legacy-models',
  testQuestion: 'legacy-models',
  testSession: 'legacy-models',
  topic: 'legacy-models',
  user: 'auth-foundation',
};
