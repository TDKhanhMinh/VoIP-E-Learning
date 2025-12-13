import { testQuestionSchema } from '../../../src/validation/testQuestion.validation.js';

describe('Test Question Validation', () => {
  it('should validate valid test question', () => {
    const validData = {
      test: '507f1f77bcf86cd799439011',
      question: 'What is 2+2?',
      options: [
        { answer: '3', isCorrect: false },
        { answer: '4', isCorrect: true }
      ]
    };
    const { error } = testQuestionSchema.validate(validData);
    expect(error).toBeUndefined();
  });

  it('should fail when test is missing', () => {
    const invalidData = {
      question: 'What is 2+2?',
      options: [{ answer: '4', isCorrect: true }]
    };
    const { error } = testQuestionSchema.validate(invalidData);
    expect(error).toBeDefined();
  });

  it('should fail when question is missing', () => {
    const invalidData = {
      test: '507f1f77bcf86cd799439011',
      options: [{ answer: '4', isCorrect: true }]
    };
    const { error } = testQuestionSchema.validate(invalidData);
    expect(error).toBeDefined();
  });

  it('should fail when options array is empty', () => {
    const invalidData = {
      test: '507f1f77bcf86cd799439011',
      question: 'What is 2+2?',
      options: []
    };
    const { error } = testQuestionSchema.validate(invalidData);
    expect(error).toBeDefined();
  });

  it('should fail when no correct answer exists', () => {
    const invalidData = {
      test: '507f1f77bcf86cd799439011',
      question: 'What is 2+2?',
      options: [
        { answer: '3', isCorrect: false },
        { answer: '5', isCorrect: false }
      ]
    };
    const { error } = testQuestionSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error.message).toContain('đáp án đúng');
  });

  it('should allow optional image URL', () => {
    const validData = {
      test: '507f1f77bcf86cd799439011',
      question: 'What is 2+2?',
      options: [{ answer: '4', isCorrect: true }],
      image: 'https://example.com/image.jpg'
    };
    const { error } = testQuestionSchema.validate(validData);
    expect(error).toBeUndefined();
  });

  it('should allow null or empty image', () => {
    const validData = {
      test: '507f1f77bcf86cd799439011',
      question: 'What is 2+2?',
      options: [{ answer: '4', isCorrect: true }],
      image: null
    };
    const { error } = testQuestionSchema.validate(validData);
    expect(error).toBeUndefined();
  });
});
