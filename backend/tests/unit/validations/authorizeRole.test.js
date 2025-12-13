import { authorizeRoles } from '../../../src/middlewares/authorizeRole.js';
import { jest } from '@jest/globals';
describe('Authorize Roles Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: { role: 'student' },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  it('should allow authorized role', () => {
    req.user.role = 'admin';
    const middleware = authorizeRoles('admin', 'teacher');

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should block unauthorized role', () => {
    req.user.role = 'student';
    const middleware = authorizeRoles('admin', 'teacher');

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle missing user', () => {
    req.user = null;
    const middleware = authorizeRoles('admin');

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
  });
});
