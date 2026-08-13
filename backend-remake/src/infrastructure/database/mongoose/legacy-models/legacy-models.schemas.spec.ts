import { V1_MODEL_CATALOG } from '../../../../domain/legacy-models/v1-model.catalog';
import { LEGACY_MODEL_DEFINITIONS } from './legacy-models.schemas';

describe('V1 model persistence catalog', () => {
  it('accounts for every active V1 model exactly once', () => {
    expect(Object.keys(V1_MODEL_CATALOG).sort()).toEqual([
      'announcement',
      'assignment',
      'attendance',
      'class',
      'classStudent',
      'comment',
      'conversation',
      'course',
      'document',
      'material',
      'message',
      'onlineTest',
      'post',
      'recordLessonSummary',
      'room',
      'semester',
      'submission',
      'teachingSchedule',
      'testAttempt',
      'testQuestion',
      'testSession',
      'topic',
      'user',
    ]);
  });

  it('preserves V1 schema names, references, indexes and defaults', () => {
    expect(
      LEGACY_MODEL_DEFINITIONS.map((definition) => definition.name),
    ).toEqual([
      'Announcement',
      'Assignment',
      'Attendance',
      'Class',
      'ClassStudent',
      'Comment',
      'Conversation',
      'Document',
      'Material',
      'Message',
      'OnlineTest',
      'Post',
      'RecordLessonSummary',
      'Room',
      'Semester',
      'Submission',
      'TeachingSchedule',
      'TestAttempt',
      'TestQuestion',
      'TestSession',
      'Topic',
    ]);

    const attendance = LEGACY_MODEL_DEFINITIONS.find(
      (definition) => definition.name === 'Attendance',
    )?.schema;
    const classModel = LEGACY_MODEL_DEFINITIONS.find(
      (definition) => definition.name === 'Class',
    )?.schema;
    const document = LEGACY_MODEL_DEFINITIONS.find(
      (definition) => definition.name === 'Document',
    )?.schema;

    expect(attendance?.path('student').options.ref).toBe('User');
    expect(attendance?.indexes()).toContainEqual([
      { class: 1, student: 1, lesson: 1 },
      expect.objectContaining({ unique: true }),
    ]);
    expect(classModel?.path('schedule').isRequired).toBe(true);
    expect(document?.path('embedding').isRequired).toBe(true);
    expect(document?.indexes()).toEqual(
      expect.arrayContaining([
        [{ title: 1 }, expect.any(Object)],
        [{ tags: 1 }, expect.any(Object)],
        [{ level: 1 }, expect.any(Object)],
      ]),
    );
  });
});
