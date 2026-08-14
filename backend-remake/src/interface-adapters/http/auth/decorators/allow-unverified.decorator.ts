import { SetMetadata } from '@nestjs/common';

export const ALLOW_UNVERIFIED_METADATA = 'auth:allow-unverified';
export const AllowUnverified = () =>
  SetMetadata(ALLOW_UNVERIFIED_METADATA, true);
