import { Types } from 'mongoose';
import { fromMongoObjectId, toMongoObjectId } from './mongo-object-id.mapper';

describe('Mongo ObjectId mapper', () => {
  it('is the explicit ObjectId to opaque string boundary', () => {
    const objectId = new Types.ObjectId('507f1f77bcf86cd799439011');
    expect(fromMongoObjectId(objectId)).toBe('507f1f77bcf86cd799439011');
    expect(toMongoObjectId(fromMongoObjectId(objectId))).toEqual(objectId);
  });

  it.each(['user-1', '550e8400-e29b-41d4-a716-446655440000', 'ABCDEF'])(
    'rejects non-ObjectId persistence input %s',
    (id) => {
      expect(() => toMongoObjectId(id, 'user.id')).toThrow(
        'Invalid identifier',
      );
    },
  );
});
