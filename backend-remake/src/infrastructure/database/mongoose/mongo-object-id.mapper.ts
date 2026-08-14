import { Types } from 'mongoose';
import { ApplicationError } from '../../../application/errors/application.error';

export function toMongoObjectId(id: string, field = 'id'): Types.ObjectId {
  if (
    !Types.ObjectId.isValid(id) ||
    new Types.ObjectId(id).toHexString() !== id
  ) {
    throw new ApplicationError('Invalid identifier', {
      code: 'INVALID_ID',
      kind: 'validation',
      details: { field },
    });
  }
  return new Types.ObjectId(id);
}

export function fromMongoObjectId(id: Types.ObjectId): string {
  return id.toHexString();
}
