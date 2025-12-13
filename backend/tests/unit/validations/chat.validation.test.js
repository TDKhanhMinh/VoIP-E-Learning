import {
  createConversationSchema,
  markAsReadSchema,
  sendMessageSchema,
  paginationSchema,
  conversationIdParamSchema
} from '../../../src/validation/chat.validation.js';

describe('Chat Validation', () => {
  describe('createConversationSchema', () => {
    it('should validate valid conversation data', () => {
      const validData = {
        userId: '507f1f77bcf86cd799439011',
        participantId: '507f1f77bcf86cd799439012'
      };
      const { error } = createConversationSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should fail when userId is missing', () => {
      const invalidData = {
        participantId: '507f1f77bcf86cd799439012'
      };
      const { error } = createConversationSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.message).toContain('User ID is required');
    });
  });

  describe('sendMessageSchema', () => {
    it('should validate valid message data', () => {
      const validData = {
        receiverId: '507f1f77bcf86cd799439012',
        content: 'Hello, how are you?'
      };
      const { error } = sendMessageSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should fail when content is empty', () => {
      const invalidData = {
        receiverId: '507f1f77bcf86cd799439012',
        content: ''
      };
      const { error } = sendMessageSchema.validate(invalidData);
      expect(error).toBeDefined();
    });

    it('should fail when content exceeds 1000 characters', () => {
      const invalidData = {
        receiverId: '507f1f77bcf86cd799439012',
        content: 'a'.repeat(1001)
      };
      const { error } = sendMessageSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.message).toContain('1000');
    });

    it('should default messageType to text', () => {
      const validData = {
        receiverId: '507f1f77bcf86cd799439012',
        content: 'Hello'
      };
      const { value } = sendMessageSchema.validate(validData);
      expect(value.messageType).toBe('text');
    });
  });

  describe('paginationSchema', () => {
    it('should default page to 1 and limit to 50', () => {
      const { value } = paginationSchema.validate({});
      expect(value.page).toBe(1);
      expect(value.limit).toBe(50);
    });

    it('should fail when page is less than 1', () => {
      const invalidData = { page: 0 };
      const { error } = paginationSchema.validate(invalidData);
      expect(error).toBeDefined();
    });

    it('should fail when limit exceeds 100', () => {
      const invalidData = { limit: 101 };
      const { error } = paginationSchema.validate(invalidData);
      expect(error).toBeDefined();
    });
  });
});
