import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApplicationError } from '../../application/errors/application.error';
import { GetSystemReadinessUseCase } from '../../application/health/get-system-readiness.use-case';
import { GetSystemHealthUseCase } from '../../application/use-cases/get-system-health.use-case';
import {
  HealthPresenter,
  type HealthResponse,
  type ReadinessResponse,
} from './health.presenter';
import { PublicRoute } from './auth/decorators/public-route.decorator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly getSystemHealthUseCase: GetSystemHealthUseCase,
    private readonly getSystemReadinessUseCase: GetSystemReadinessUseCase,
  ) {}

  @Get('live')
  @PublicRoute('health.liveness')
  @ApiOperation({ summary: 'Check whether the API process is alive' })
  @ApiOkResponse({ description: 'The API process is alive' })
  getLiveness(): HealthResponse {
    return HealthPresenter.toHttp(this.getSystemHealthUseCase.execute());
  }

  @Get('ready')
  @PublicRoute('health.readiness')
  @ApiOperation({ summary: 'Check required runtime dependencies' })
  @ApiOkResponse({ description: 'Required dependencies are ready' })
  async getReadiness(): Promise<ReadinessResponse> {
    const readiness = await this.getSystemReadinessUseCase.execute();

    if (!readiness.ready) {
      throw new ApplicationError('Service is not ready', {
        code: 'SERVICE_NOT_READY',
        kind: 'service_unavailable',
        details: readiness.dependencies,
      });
    }

    return HealthPresenter.readinessToHttp(readiness);
  }
}
