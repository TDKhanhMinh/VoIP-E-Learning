import { SetMetadata } from '@nestjs/common';
import type { PublicHttpRouteId } from '../../../../application/security/public-http-route.contract';

export const PUBLIC_ROUTE_METADATA = 'security.publicRoute';

export const PublicRoute = (routeId: PublicHttpRouteId) =>
  SetMetadata(PUBLIC_ROUTE_METADATA, routeId);
