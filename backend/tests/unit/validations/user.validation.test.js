import { createUserSchema, updateUserSchema } from '../../../src/validation/user.validation.js';

describe('User Validation', () => {
  describe('createUserSchema', () => {
    it('should validate valid user data', () => {
      const validData = {
        full_name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'student'
      };
      const { error } = createUserSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should fail when full_name is missing', () => {
      const invalidData = {
        email: 'john@example.com',
        password: 'password123',
        role: 'student'
      };
      const { error } = createUserSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('full_name');
    });

    it('should fail when email is invalid', () => {
      const invalidData = {
        full_name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
        role: 'student'
      };
      const { error } = createUserSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('email');
    });

    it('should fail when password is less than 6 characters', () => {
      const invalidData = {
        full_name: 'John Doe',
        email: 'john@example.com',
        password: '12345',
        role: 'student'
      };
      const { error } = createUserSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].message).toContain('6');
    });

    it('should fail when role is invalid', () => {
      const invalidData = {
        full_name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'admin'
      };
      const { error } = createUserSchema.validate(invalidData);
      expect(error).toBeDefined();
    });

    it('should default role to student', () => {
      const data = {
        full_name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      };
      const { value } = createUserSchema.validate(data);
      expect(value.role).toBe('student');
    });
  });

  describe('updateUserSchema', () => {
    it('should validate valid update data', () => {
      const validData = {
        full_name: 'Jane Doe',
        email: 'jane@example.com'
      };
      const { error } = updateUserSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should allow null values', () => {
      const data = {
        full_name: null,
        email: null
      };
      const { error } = updateUserSchema.validate(data);
      expect(error).toBeUndefined();
    });

    it('should fail when email format is invalid', () => {
      const invalidData = {
        email: 'invalid-email'
      };
      const { error } = updateUserSchema.validate(invalidData);
      expect(error).toBeDefined();
    });

    it('should allow available boolean field', () => {
      const data = {
        available: true
      };
      const { error } = updateUserSchema.validate(data);
      expect(error).toBeUndefined();
    });
  });
});
