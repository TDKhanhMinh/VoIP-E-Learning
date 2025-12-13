import { createAnnouncementSchema, updateAnnouncementSchema } from '../../../src/validation/announcement.validation.js';

describe('Announcement Validation', () => {
  describe('createAnnouncementSchema', () => {
    it('should validate valid announcement data', () => {
      const validData = {
        class: '507f1f77bcf86cd799439011',
        title: 'Important Notice',
        content: 'Class will be moved to next week'
      };
      const { error } = createAnnouncementSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should allow optional fields', () => {
      const validData = {
        class: '507f1f77bcf86cd799439011',
        title: 'Notice',
        content: 'Content',
        file_url: 'https://example.com/file.pdf',
        file_name: 'document.pdf'
      };
      const { error } = createAnnouncementSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should fail when class is missing', () => {
      const invalidData = {
        title: 'Notice',
        content: 'Content'
      };
      const { error } = createAnnouncementSchema.validate(invalidData);
      expect(error).toBeDefined();
    });
  });

  describe('updateAnnouncementSchema', () => {
    it('should allow partial updates', () => {
      const validData = {
        title: 'Updated Title'
      };
      const { error } = updateAnnouncementSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should allow null values', () => {
      const validData = {
        content: null
      };
      const { error } = updateAnnouncementSchema.validate(validData);
      expect(error).toBeUndefined();
    });
  });
});
