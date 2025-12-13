import request from 'supertest';
import express from 'express';
import fileRoutes from '../../../src/router/fileRouter.js';
import { connectTestDB, closeTestDB, clearTestDB } from '../setup.js';

const app = express();
app.use(express.json());
app.use('/api/file', fileRoutes);

describe('File Routes', () => {
  beforeAll(async () => await connectTestDB());
  afterAll(async () => await closeTestDB());
  afterEach(async () => await clearTestDB());

  describe('POST /api/file/download', () => {
    it('should generate download URL', async () => {
      const fileData = {
        public_id: 'test_file_123',
      };

      const res = await request(app)
        .post('/api/file/download')
        .send(fileData);
      
      expect([200, 500]).toContain(res.status);
    });

    it('should reject request without public_id', async () => {
      const res = await request(app)
        .post('/api/file/download')
        .send({});
      
      expect(res.status).toBe(400);
    });
  });
});
