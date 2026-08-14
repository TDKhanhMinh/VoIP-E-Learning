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
import { ApplicationError } from '../../../application/errors/application.error';
import { SemesterCatalogService } from '../../../application/semesters/semester-catalog.service';
import { PaginatedResult } from '../../../application/pagination/paginated-result';
import type { PageRequest } from '../../../application/pagination/page-request';
import { PaginationQueryPipe } from '../pipes/pagination-query.pipe';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateSemesterDto, UpdateSemesterDto } from './dto/semester.dto';
import { SemesterPresenter, type SemesterResponse } from './semester.presenter';

@Controller({ path: 'semesters', version: '1' })
@UseGuards(JwtAccessGuard, RolesGuard)
export class SemesterController {
  constructor(
    @Inject(SemesterCatalogService)
    private readonly semesters: SemesterCatalogService,
  ) {}

  @Get()
  async list(
    @Query(PaginationQueryPipe) pageRequest: PageRequest,
  ): Promise<PaginatedResult<SemesterResponse>> {
    const result = await this.semesters.list(pageRequest);
    return PaginatedResult.create({
      items: result.items.map((semester) => SemesterPresenter.toHttp(semester)),
      totalItems: result.pagination.totalItems,
      pageRequest,
    });
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<SemesterResponse> {
    const semester = await this.semesters.getById(id);
    if (!semester)
      throw new ApplicationError('Semester was not found', {
        code: 'SEMESTER_NOT_FOUND',
        kind: 'not_found',
      });
    return SemesterPresenter.toHttp(semester);
  }

  @Post()
  @Roles('admin')
  async create(@Body() body: CreateSemesterDto): Promise<SemesterResponse> {
    return SemesterPresenter.toHttp(await this.semesters.create(body));
  }

  @Patch(':id')
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateSemesterDto,
  ): Promise<SemesterResponse> {
    const semester = await this.semesters.update(id, body);
    if (!semester)
      throw new ApplicationError('Semester was not found', {
        code: 'SEMESTER_NOT_FOUND',
        kind: 'not_found',
      });
    return SemesterPresenter.toHttp(semester);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async archive(@Param('id') id: string): Promise<void> {
    await this.semesters.archive(id);
  }
}
