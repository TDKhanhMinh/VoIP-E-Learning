import { createAssignmentSchema, updateAssignmentSchema } from '../../../src/validation/assignment.validation.js';

describe('Assignment Validation', () => {
  describe('createAssignmentSchema', () => {
    it('should validate valid assignment data', () => {
      const validData = {
        title: 'Homework 1',
        description: 'Complete exercises 1-5',
        class: '507f1f77bcf86cd799439011',
        due_at: new Date('2024-12-31')
      };
      const { error } = createAssignmentSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should fail when title is missing', () => {
      const invalidData = {
        description: 'Complete exercises',
        class: '507f1f77bcf86cd799439011',
        due_at: new Date()
      };
      const { error } = createAssignmentSchema.validate(invalidData);
      expect(error).toBeDefined();
    });

    it('should fail when due_at is not a date', () => {
      const invalidData = {
        title: 'Homework 1',
        description: 'Complete exercises',
        class: '507f1f77bcf86cd799439011',
        due_at: 'invalid-date'
      };
      const { error } = createAssignmentSchema.validate(invalidData);
      expect(error).toBeDefined();
    });
  });

  describe('updateAssignmentSchema', () => {
    it('should allow partial updates', () => {
      const validData = {
        title: 'Updated Title'
      };
      const { error } = updateAssignmentSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should allow null values', () => {
      const validData = {
        description: null
      };
      const { error } = updateAssignmentSchema.validate(validData);
      expect(error).toBeUndefined();
    });
  });
});
