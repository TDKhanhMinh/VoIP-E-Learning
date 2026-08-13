import { AnnouncementEntity } from './v1-models.entity';

describe('ModelEntity', () => {
  it('exposes an immutable, framework-free V1 model record', () => {
    const createdAt = new Date('2026-01-01T00:00:00.000Z');
    const announcement = new AnnouncementEntity({
      id: 'announcement-1',
      classId: 'class-1',
      title: 'Exam schedule',
      content: null,
      createdBy: 'teacher-1',
      fileUrl: null,
      fileName: null,
      createdAt,
    });

    expect(announcement.id).toBe('announcement-1');
    expect(announcement.createdAt).toBe(createdAt);
    expect(announcement.toPrimitives()).toEqual(
      expect.objectContaining({
        classId: 'class-1',
        createdBy: 'teacher-1',
      }),
    );
  });
});
