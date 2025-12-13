import { createMaterialSchema } from '../../../src/validation/material.validation.js';

describe('Material Validation', () => {
  it('should validate valid material data', () => {
    const validData = {
      title: 'Lecture Notes Week 1',
      file_url: 'https://drive.google.com/file/123',
      class: '507f1f77bcf86cd799439011'
    };
    const { error } = createMaterialSchema.validate(validData);
    expect(error).toBeUndefined();
  });

  it('should fail when title is missing', () => {
    const invalidData = {
      file_url: 'https://drive.google.com/file/123',
      class: '507f1f77bcf86cd799439011'
    };
    const { error } = createMaterialSchema.validate(invalidData);
    expect(error).toBeDefined();
  });

  it('should fail when file_url is missing', () => {
    const invalidData = {
      title: 'Lecture Notes',
      class: '507f1f77bcf86cd799439011'
    };
    const { error } = createMaterialSchema.validate(invalidData);
    expect(error).toBeDefined();
  });

  it('should fail when class is missing', () => {
    const invalidData = {
      title: 'Lecture Notes',
      file_url: 'https://drive.google.com/file/123'
    };
    const { error } = createMaterialSchema.validate(invalidData);
    expect(error).toBeDefined();
  });
});
