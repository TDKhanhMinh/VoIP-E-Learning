import { onlineTestSchema } from '../../../src/validation/onlineTest.validation.js';

describe('Online Test Validation', () => {
  it('should validate valid test data', () => {
    const validData = {
      title: 'Midterm Exam',
      start: new Date('2024-12-01'),
      end: new Date('2024-12-02'),
      time: '60',
      attempts: 2,
      description: 'Midterm examination'
    };
    const { error } = onlineTestSchema.validate(validData);
    expect(error).toBeUndefined();
  });

  it('should fail when title is missing', () => {
    const invalidData = {
      start: new Date(),
      end: new Date(),
      time: '60',
      attempts: 2
    };
    const { error } = onlineTestSchema.validate(invalidData);
    expect(error).toBeDefined();
  });

  it('should default available to true', () => {
    const validData = {
      title: 'Test',
      start: new Date(),
      end: new Date(),
      time: '60',
      attempts: 2
    };
    const { value } = onlineTestSchema.validate(validData);
    expect(value.available).toBe(true);
  });

  it('should allow null class', () => {
    const validData = {
      class: null,
      title: 'Test',
      start: new Date(),
      end: new Date(),
      time: '60',
      attempts: 2
    };
    const { error } = onlineTestSchema.validate(validData);
    expect(error).toBeUndefined();
  });
});
