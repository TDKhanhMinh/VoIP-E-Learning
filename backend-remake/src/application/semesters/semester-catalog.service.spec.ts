import { SemesterCatalogService } from './semester-catalog.service';
import type { SemesterRepositoryPort } from './ports/semester.repository.port';

describe('SemesterCatalogService', () => {
  let semesters: jest.Mocked<SemesterRepositoryPort>;
  let service: SemesterCatalogService;
  const ids = { generate: jest.fn(() => '507f1f77bcf86cd799439013') };
  const clock = { now: jest.fn(() => new Date('2026-08-14T00:00:00.000Z')) };

  beforeEach(() => {
    semesters = {
      findById: jest.fn(),
      findByNameNormalized: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      list: jest.fn(),
      countReferences: jest.fn(),
    };
    service = new SemesterCatalogService(semesters, ids, clock);
  });

  it('enforces mid-term dates inside the semester', async () => {
    await expect(
      service.create({
        name: 'Fall 2026',
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-12-20'),
        midTermStartDate: new Date('2026-08-01'),
        midTermEndDate: new Date('2026-09-15'),
      }),
    ).rejects.toMatchObject({ code: 'SEMESTER_INVALID_DATES' });
  });

  it('creates normalized semester names and dates', async () => {
    semesters.findByNameNormalized.mockResolvedValue(null);
    const semester = await service.create({
      name: ' Fall 2026 ',
      startDate: new Date('2026-09-01'),
      endDate: new Date('2026-12-20'),
      midTermStartDate: new Date('2026-10-15'),
      midTermEndDate: new Date('2026-10-25'),
    });
    expect(semester.name).toBe('Fall 2026');
    expect(semester.nameNormalized).toBe('fall 2026');
    expect(semesters.save.mock.calls).toContainEqual([semester]);
  });
});
