import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CourseCatalogService } from '../../../application/courses/course-catalog.service';
import { ApplicationError } from '../../../application/errors/application.error';
import type { CurrentActor } from '../../../application/auth/ports/token-service.port';
import { PaginatedResult } from '../../../application/pagination/paginated-result';
import { CurrentActorDecorator } from '../auth/decorators/current-actor.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
  CourseListQueryPipe,
  type CourseListQuery,
} from './course-list-query.pipe';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { CoursePresenter, type CourseResponse } from './course.presenter';

@Controller({ path: 'courses', version: '1' })
@UseGuards(JwtAccessGuard, RolesGuard)
export class CourseController {
  constructor(
    @Inject(CourseCatalogService)
    private readonly courses: CourseCatalogService,
  ) {}
  @Post()
  @Roles('admin')
  async create(
    @CurrentActorDecorator() actor: CurrentActor,
    @Body() body: CreateCourseDto,
  ): Promise<CourseResponse> {
    return CoursePresenter.toHttp(await this.courses.create(actor, body));
  }
  @Get(':id')
  async getById(@Param('id') id: string): Promise<CourseResponse> {
    const course = await this.courses.getById(id);
    if (!course)
      throw new ApplicationError('Course was not found', {
        code: 'COURSE_NOT_FOUND',
        kind: 'not_found',
      });
    return CoursePresenter.toHttp(course);
  }
  @Get('code/:code')
  async getByCode(@Param('code') code: string): Promise<CourseResponse> {
    const course = await this.courses.getByCode(code);
    if (!course)
      throw new ApplicationError('Course was not found', {
        code: 'COURSE_NOT_FOUND',
        kind: 'not_found',
      });
    return CoursePresenter.toHttp(course);
  }
  @Patch(':id')
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateCourseDto,
  ): Promise<CourseResponse> {
    const course = await this.courses.update(id, body);
    if (!course)
      throw new ApplicationError('Course was not found', {
        code: 'COURSE_NOT_FOUND',
        kind: 'not_found',
      });
    return CoursePresenter.toHttp(course);
  }
  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async archive(@Param('id') id: string): Promise<void> {
    await this.courses.archive(id);
  }
  @Get()
  async list(
    @Query(CourseListQueryPipe) query: CourseListQuery,
  ): Promise<PaginatedResult<CourseResponse>> {
    const result = await this.courses.list(query.pageRequest, {
      code: query.code,
    });
    return PaginatedResult.create({
      items: result.items.map((course) => CoursePresenter.toHttp(course)),
      totalItems: result.pagination.totalItems,
      pageRequest: query.pageRequest,
    });
  }
}
