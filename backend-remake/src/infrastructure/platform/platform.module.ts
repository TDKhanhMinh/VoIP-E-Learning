import { Global, Module } from '@nestjs/common';
import { CLOCK_PORT } from '../../application/ports/clock.port';
import { ID_GENERATOR } from '../../application/ports/id-generator.port';
import { ObjectIdGeneratorAdapter } from '../database/mongoose/object-id-generator.adapter';
import { SystemClockAdapter } from '../time/system-clock.adapter';

@Global()
@Module({
  providers: [
    SystemClockAdapter,
    ObjectIdGeneratorAdapter,
    { provide: CLOCK_PORT, useExisting: SystemClockAdapter },
    { provide: ID_GENERATOR, useExisting: ObjectIdGeneratorAdapter },
  ],
  exports: [CLOCK_PORT, ID_GENERATOR],
})
export class PlatformModule {}
