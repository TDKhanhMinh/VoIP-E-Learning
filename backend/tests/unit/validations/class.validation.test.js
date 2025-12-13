import { createClassSchema, updateClassSchema } from '../../../src/validation/class.validation.js';

describe('Class Validation', () => {
  describe('createClassSchema', () => {
    it('should validate valid class data', () => {
      const validData = {
        name: 'CS101',
        schedule: [
          { dayOfWeek: 2, shift: 1, type: 'theory', room: 'A101' }
        ],
        course: '507f1f77bcf86cd799439011',
        semester: 'HK1-2024',
        theoryWeeks: 15,
        practiceWeeks: 10,
        teacher: '507f1f77bcf86cd799439012'
      };
      const { error } = createClassSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should fail when name is missing', () => {
      const invalidData = {
        schedule: [{ dayOfWeek: 2, shift: 1, type: 'theory', room: 'A101' }],
        course: '507f1f77bcf86cd799439011',
        semester: 'HK1-2024',
        theoryWeeks: 15,
        teacher: '507f1f77bcf86cd799439012'
      };
      const { error } = createClassSchema.validate(invalidData);
      expect(error).toBeDefined();
    });

    it('should fail when dayOfWeek is invalid', () => {
      const invalidData = {
        name: 'CS101',
        schedule: [{ dayOfWeek: 1, shift: 1, type: 'theory', room: 'A101' }],
        course: '507f1f77bcf86cd799439011',
        semester: 'HK1-2024',
        theoryWeeks: 15,
        teacher: '507f1f77bcf86cd799439012'
      };
      const { error } = createClassSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.message).toContain('Thứ 2 đến Thứ 7');
    });

    it('should fail when shift is invalid', () => {
      const invalidData = {
        name: 'CS101',
        schedule: [{ dayOfWeek: 2, shift: 5, type: 'theory', room: 'A101' }],
        course: '507f1f77bcf86cd799439011',
        semester: 'HK1-2024',
        theoryWeeks: 15,
        teacher: '507f1f77bcf86cd799439012'
      };
      const { error } = createClassSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.message).toContain('Ca 1 đến Ca 4');
    });

    it('should fail when type is invalid', () => {
      const invalidData = {
        name: 'CS101',
        schedule: [{ dayOfWeek: 2, shift: 1, type: 'invalid', room: 'A101' }],
        course: '507f1f77bcf86cd799439011',
        semester: 'HK1-2024',
        theoryWeeks: 15,
        teacher: '507f1f77bcf86cd799439012'
      };
      const { error } = createClassSchema.validate(invalidData);
      expect(error).toBeDefined();
    });

    it('should allow null practiceWeeks', () => {
      const validData = {
        name: 'CS101',
        schedule: [{ dayOfWeek: 2, shift: 1, type: 'theory', room: 'A101' }],
        course: '507f1f77bcf86cd799439011',
        semester: 'HK1-2024',
        theoryWeeks: 15,
        practiceWeeks: null,
        teacher: '507f1f77bcf86cd799439012'
      };
      const { error } = createClassSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should fail when theoryWeeks is negative', () => {
      const invalidData = {
        name: 'CS101',
        schedule: [{ dayOfWeek: 2, shift: 1, type: 'theory', room: 'A101' }],
        course: '507f1f77bcf86cd799439011',
        semester: 'HK1-2024',
        theoryWeeks: -5,
        teacher: '507f1f77bcf86cd799439012'
      };
      const { error } = createClassSchema.validate(invalidData);
      expect(error).toBeDefined();
    });
  });

  describe('updateClassSchema', () => {
    it('should allow partial updates', () => {
      const validData = {
        name: 'CS102'
      };
      const { error } = updateClassSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should allow null values', () => {
      const validData = {
        course: null,
        semester: null
      };
      const { error } = updateClassSchema.validate(validData);
      expect(error).toBeUndefined();
    });
  });
});
