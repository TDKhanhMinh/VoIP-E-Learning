import { assertResourceOwnership } from './ownership.policy';

describe('assertResourceOwnership', () => {
  it('allows the resource owner and administrators', () => {
    expect(() =>
      assertResourceOwnership(
        { userId: 'owner', sessionId: 'session', roles: ['student'] },
        'owner',
      ),
    ).not.toThrow();
    expect(() =>
      assertResourceOwnership(
        { userId: 'admin', sessionId: 'session', roles: ['admin'] },
        'owner',
      ),
    ).not.toThrow();
  });
  it('rejects other authenticated users', () => {
    expect(() =>
      assertResourceOwnership(
        { userId: 'student', sessionId: 'session', roles: ['student'] },
        'owner',
      ),
    ).toThrow('You do not own this resource');
  });
});
