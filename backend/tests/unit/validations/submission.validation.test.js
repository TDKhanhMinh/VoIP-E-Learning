import { createSubmissionSchema, updateSubmissionSchema } from '../../../src/validation/submission.validation.js';

describe('Submission Validation', () => {
  describe('createSubmissionSchema', () => {
    it('should validate valid submission data', () => {
      const validData = {
        assignment: '507f1f77bcf86cd799439011',
        file_url: 'https://drive.google.com/file/123',
        student: '507f1f77bcf86cd799439012'
      };
      const { error } = createSubmissionSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should fail when assignment is missing', () => {
      const invalidData = {
        file_url: 'https://drive.google.com/file/123',
        student: '507f1f77bcf86cd799439012'
      };
      const { error } = createSubmissionSchema.validate(invalidData);
      expect(error).toBeDefined();
    });

    it('should allow optional file_name', () => {
      const validData = {
        assignment: '507f1f77bcf86cd799439011',
        file_url: 'https://drive.google.com/file/123',
        student: '507f1f77bcf86cd799439012',
        file_name: 'submission.pdf'
      };
      const { error } = createSubmissionSchema.validate(validData);
      expect(error).toBeUndefined();
    });
  });

  describe('updateSubmissionSchema', () => {
    it('should validate valid update data', () => {
      const validData = {
        score: 8.5,
        feedback: 'Good work!'
      };
      const { error } = updateSubmissionSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should fail when score is below 0', () => {
      const invalidData = {
        score: -1,
        feedback: 'Invalid'
      };
      const { error } = updateSubmissionSchema.validate(invalidData);
      expect(error).toBeDefined();
    });

    it('should fail when score is above 10', () => {
      const invalidData = {
        score: 11,
        feedback: 'Invalid'
      };
      const { error } = updateSubmissionSchema.validate(invalidData);
      expect(error).toBeDefined();
    });

    it('should allow graded boolean', () => {
      const validData = {
        score: 9,
        feedback: 'Excellent',
        graded: true
      };
      const { error } = updateSubmissionSchema.validate(validData);
      expect(error).toBeUndefined();
    });
  });
});
