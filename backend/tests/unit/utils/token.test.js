import jwt from 'jsonwebtoken';
import { generateToken } from '../../../src/utils/token.js';

process.env.JWT_SECRET = 'test-secret-key-for-unit-tests-12345';

describe('Token Utils', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const id = '123456';
      const email = 'test@example.com';
      const role = 'student';
      
      const token = generateToken(id, email, role);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('should encode correct payload data', () => {
      const id = '507f1f77bcf86cd799439011';
      const email = 'john@example.com';
      const role = 'teacher';
      
      const token = generateToken(id, email, role);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      expect(decoded.id).toBe(id);
      expect(decoded.email).toBe(email);
      expect(decoded.role).toBe(role);
    });

    it('should set expiration to 24 hours', () => {
      const token = generateToken('123', 'test@test.com', 'student');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const now = Math.floor(Date.now() / 1000);
      const expectedExpiry = now + (24 * 60 * 60);
      
      expect(decoded.exp).toBeGreaterThan(now);
      expect(decoded.exp).toBeLessThanOrEqual(expectedExpiry + 5); 
    });

    it('should generate different tokens for different users', () => {
      const token1 = generateToken('user1', 'user1@test.com', 'student');
      const token2 = generateToken('user2', 'user2@test.com', 'teacher');
      
      expect(token1).not.toBe(token2);
    });

    it('should handle admin role', () => {
      const token = generateToken('admin1', 'admin@test.com', 'admin');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      expect(decoded.role).toBe('admin');
    });

    it('should handle special characters in email', () => {
      const token = generateToken('123', 'user+test@example.com', 'student');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      expect(decoded.email).toBe('user+test@example.com');
    });

    it('should handle long user IDs', () => {
      const longId = '507f1f77bcf86cd799439011507f1f77bcf86cd799439011';
      const token = generateToken(longId, 'test@test.com', 'student');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      expect(decoded.id).toBe(longId);
    });

    it('should fail verification with wrong secret', () => {
      const token = generateToken('123', 'test@test.com', 'student');
      
      expect(() => {
        jwt.verify(token, 'wrong-secret');
      }).toThrow();
    });

    it('should generate consistent tokens for same input (within same second)', () => {
      const id = 'test123';
      const email = 'same@test.com';
      const role = 'student';
      
      const token1 = generateToken(id, email, role);
      const token2 = generateToken(id, email, role);
      
      const decoded1 = jwt.verify(token1, process.env.JWT_SECRET);
      const decoded2 = jwt.verify(token2, process.env.JWT_SECRET);
      
      expect(decoded1.id).toBe(decoded2.id);
      expect(decoded1.email).toBe(decoded2.email);
      expect(decoded1.role).toBe(decoded2.role);
    });

    it('should handle empty strings gracefully', () => {
      const token = generateToken('', '', 'student');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      expect(decoded.id).toBe('');
      expect(decoded.email).toBe('');
      expect(decoded.role).toBe('student');
    });
  });
});
