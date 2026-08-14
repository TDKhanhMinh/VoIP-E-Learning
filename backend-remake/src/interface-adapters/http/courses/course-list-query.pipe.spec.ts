import { CourseListQueryPipe } from './course-list-query.pipe';

describe('CourseListQueryPipe', () => {
  const pipe = new CourseListQueryPipe();

  it('combines pagination with a trimmed exact code filter', () => {
    expect(pipe.transform({ page: '2', limit: '5', code: ' CS-301 ' })).toEqual(
      {
        pageRequest: { page: 2, limit: 5, offset: 5 },
        code: 'CS-301',
      },
    );
  });

  it('rejects malformed code filters', () => {
    let caught: unknown;
    try {
      pipe.transform({ code: 'CS 301' });
    } catch (error: unknown) {
      caught = error;
    }
    expect(caught).toMatchObject({ code: 'INVALID_COURSE_FILTER' });
  });
});
