import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import type { IdGeneratorPort } from '../../../application/ports/id-generator.port';

@Injectable()
export class ObjectIdGeneratorAdapter implements IdGeneratorPort {
  generate(): string {
    return new Types.ObjectId().toHexString();
  }
}
