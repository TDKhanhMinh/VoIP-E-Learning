import { Test, TestingModule } from '@nestjs/testing';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { IsString, Length } from 'class-validator';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { ApplicationError } from './../src/application/errors/application.error';
import type { PageRequest } from './../src/application/pagination/page-request';
import { PaginatedResult } from './../src/application/pagination/paginated-result';
import type {
  ApiErrorResponse,
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from './../src/interface-adapters/http/contracts/api-response';
import { SkipResponseEnvelope } from './../src/interface-adapters/http/decorators/skip-response-envelope.decorator';
import type { HealthResponse } from './../src/interface-adapters/http/health.presenter';
import { PaginationQueryPipe } from './../src/interface-adapters/http/pipes/pagination-query.pipe';
import { configureApp } from './../src/infrastructure/web/configure-app';

interface TestItem {
  id: number;
}

class TestValidationDto {
  @IsString()
  @Length(2, 50)
  name!: string;
}

@Controller('__test/errors')
class TestErrorController {
  @Get('application')
  throwApplicationError(): never {
    throw new ApplicationError('Course was not found', {
      code: 'COURSE_NOT_FOUND',
      kind: 'not_found',
      details: { courseId: 'missing-course' },
    });
  }

  @Get('unexpected')
  throwUnexpectedError(): never {
    throw new Error('Sensitive internal details');
  }

  @Get('raw')
  @SkipResponseEnvelope()
  getRawResponse(): { status: string } {
    return { status: 'raw' };
  }

  @Get('paginated')
  getPaginatedResponse(
    @Query(PaginationQueryPipe) pageRequest: PageRequest,
  ): PaginatedResult<TestItem> {
    const allItems: TestItem[] = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
    ];
    const items = allItems.slice(
      pageRequest.offset,
      pageRequest.offset + pageRequest.limit,
    );

    return PaginatedResult.create({
      items,
      totalItems: allItems.length,
      pageRequest,
    });
  }

  @Post('validation')
  validateRequest(@Body() body: TestValidationDto): TestValidationDto {
    return body;
  }
}

describe('HealthController (e2e)', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [TestErrorController],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>({
      bodyParser: false,
    });
    configureApp(app);
    await app.init();
  });

  it('/api/v1/health/live (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health/live')
      .set('x-request-id', 'health-e2e-request')
      .set('origin', 'http://localhost:5173')
      .expect(200)
      .expect((response) => {
        const body = response.body as ApiSuccessResponse<HealthResponse>;

        expect(body.success).toBe(true);
        expect(body.data?.status).toBe('ok');
        expect(typeof body.data?.checkedAt).toBe('string');
        expect(body.meta).toEqual({
          timestamp: expect.any(String) as string,
          path: '/api/v1/health/live',
          method: 'GET',
          requestId: 'health-e2e-request',
        });
        expect(response.get('x-request-id')).toBe('health-e2e-request');
        expect(response.get('access-control-allow-origin')).toBe(
          'http://localhost:5173',
        );
        expect(response.get('x-content-type-options')).toBe('nosniff');
      });
  });

  it('/api/v1/health/ready reports the configured MongoDB state', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health/ready')
      .expect(200)
      .expect((response) => {
        const body = response.body as ApiSuccessResponse<{
          status: string;
          dependencies: Record<string, { status: string }>;
        }>;

        expect(body.data?.status).toBe('ready');
        expect(body.data?.dependencies.mongodb).toEqual({
          status:
            process.env.MONGO_ENABLED?.toLowerCase() === 'true'
              ? 'up'
              : 'disabled',
        });
      });
  });

  it('/api/docs-json exposes the OpenAPI document', () => {
    return request(app.getHttpServer())
      .get('/api/docs-json')
      .expect(200)
      .expect((response) => {
        const body = response.body as { openapi?: unknown; paths?: unknown };

        expect(body.openapi).toBe('3.0.0');
        expect(body.paths).toBeDefined();
      });
  });

  it('formats framework HTTP exceptions', () => {
    return request(app.getHttpServer())
      .get('/api/v1/missing')
      .expect(404)
      .expect((response) => {
        const body = response.body as ApiErrorResponse;

        expect(body.success).toBe(false);
        expect(body.error.code).toBe('NOT_FOUND');
        expect(body.error.message).toBe('Cannot GET /api/v1/missing');
        expect(body.meta.path).toBe('/api/v1/missing');
        expect(body.meta.method).toBe('GET');
        expect(response.get('x-request-id')).toBe(body.meta.requestId);
      });
  });

  it('maps framework-free application errors to HTTP responses', () => {
    return request(app.getHttpServer())
      .get('/api/v1/__test/errors/application')
      .expect(404)
      .expect((response) => {
        const body = response.body as ApiErrorResponse;

        expect(body.error).toEqual({
          code: 'COURSE_NOT_FOUND',
          message: 'Course was not found',
          details: { courseId: 'missing-course' },
        });
      });
  });

  it('does not expose unexpected internal errors', () => {
    return request(app.getHttpServer())
      .get('/api/v1/__test/errors/unexpected')
      .expect(500)
      .expect((response) => {
        const body = response.body as ApiErrorResponse;

        expect(body.error).toEqual({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
        });
        expect(JSON.stringify(body)).not.toContain(
          'Sensitive internal details',
        );
      });
  });

  it('allows binary, stream or webhook handlers to skip the envelope', () => {
    return request(app.getHttpServer())
      .get('/api/v1/__test/errors/raw')
      .expect(200)
      .expect({ status: 'raw' });
  });

  it('moves pagination details into response metadata', () => {
    return request(app.getHttpServer())
      .get('/api/v1/__test/errors/paginated?page=2&limit=2')
      .expect(200)
      .expect((response) => {
        const body = response.body as ApiPaginatedResponse<TestItem>;

        expect(body).not.toHaveProperty('data');
        expect(body.meta.data).toEqual([{ id: 3 }, { id: 4 }]);
        expect(body.meta.pagination).toEqual({
          page: 2,
          limit: 2,
          totalItems: 5,
          totalPages: 3,
          hasNextPage: true,
          hasPreviousPage: true,
        });
      });
  });

  it('rejects unsafe pagination query values', () => {
    return request(app.getHttpServer())
      .get('/api/v1/__test/errors/paginated?page=0&limit=101')
      .expect(422)
      .expect((response) => {
        const body = response.body as ApiErrorResponse;

        expect(body.error.code).toBe('INVALID_PAGINATION');
        expect(body.error.message).toBe('Invalid pagination parameters');
        expect(body.error.details).toEqual({
          page: 'must be a positive integer; default is 1',
          limit:
            'must be a positive integer no greater than 100; default is 20',
        });
      });
  });

  it('rejects non-whitelisted DTO properties using the global format', () => {
    return request(app.getHttpServer())
      .post('/api/v1/__test/errors/validation')
      .send({ name: 'valid name', unexpected: true })
      .expect(422)
      .expect((response) => {
        const body = response.body as ApiErrorResponse;

        expect(body.error.code).toBe('VALIDATION_ERROR');
        expect(body.error.message).toBe('Validation failed');
        expect(body.error.details).toContain(
          'property unexpected should not exist',
        );
      });
  });

  it('registers, authenticates, refreshes and revokes a user session', async () => {
    const agent = request.agent(app.getHttpServer());
    const email = `student-${Date.now()}@example.com`;
    const registered = await agent
      .post('/api/v1/auth/register')
      .send({ email, password: 'a-long-enough-password' })
      .expect(201);
    const registerBody = registered.body as ApiSuccessResponse<{
      user: { id: string; email: string; roles: string[] };
      accessToken: string;
    }>;
    expect(registerBody.data?.user).toEqual({
      id: expect.any(String) as string,
      email,
      roles: ['student'],
    });
    expect(registerBody.data?.accessToken).toEqual(expect.any(String));
    expect(registered.get('set-cookie')).toBeDefined();

    await agent
      .get('/api/v1/auth/me')
      .set('authorization', `Bearer ${registerBody.data?.accessToken}`)
      .expect(200)
      .expect((response) => {
        const body = response.body as ApiSuccessResponse<{ email: string }>;
        expect(body.data?.email).toBe(email);
      });

    const refreshed = await agent.post('/api/v1/auth/refresh').expect(200);
    const refreshBody = refreshed.body as ApiSuccessResponse<{
      accessToken: string;
    }>;
    expect(refreshBody.data?.accessToken).toEqual(expect.any(String));

    await agent
      .post('/api/v1/auth/logout')
      .set('authorization', `Bearer ${refreshBody.data?.accessToken}`)
      .expect(204);
    await agent
      .post('/api/v1/auth/refresh')
      .expect(401)
      .expect((response) => {
        const body = response.body as ApiErrorResponse;
        expect(body.error.code).toBe('INVALID_REFRESH_TOKEN');
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
