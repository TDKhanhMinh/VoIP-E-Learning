import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateCourseUseCase } from '../../../application/courses/create-course.use-case';
import { ListCoursesUseCase } from '../../../application/courses/list-courses.use-case';
import type { CurrentActor } from '../../../application/auth/ports/token-service.port';
import type { PageRequest } from '../../../application/pagination/page-request';
import { CurrentActorDecorator } from '../auth/decorators/current-actor.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PaginationQueryPipe } from '../pipes/pagination-query.pipe';
import { CreateCourseDto } from './dto/course.dto';
import { CoursePresenter, type CourseResponse } from './course.presenter';

@Controller({ path: 'courses', version: '1' })
@UseGuards(JwtAccessGuard, RolesGuard)
export class CourseController {
  constructor(
    @Inject(CreateCourseUseCase)
    private readonly createCourse: CreateCourseUseCase,
    @Inject(ListCoursesUseCase)
    private readonly listCourses: ListCoursesUseCase,
  ) {}
  @Post()
  @Roles('admin', 'teacher')
  async create(
    @CurrentActorDecorator() actor: CurrentActor,
    @Body() body: CreateCourseDto,
  ): Promise<CourseResponse> {
    return CoursePresenter.toHttp(await this.createCourse.execute(actor, body));
  }
  @Get()
  async list(@Query(PaginationQueryPipe) pageRequest: PageRequest) {
    const result = await this.listCourses.execute(pageRequest);
    return result;
  }
}
