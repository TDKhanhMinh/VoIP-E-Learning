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
import {
  USER_MANAGEMENT_SERVICE,
  type UserManagementServicePort,
} from '../../../application/auth/ports/user-management.service.port';
import {
  USER_ROLES,
  USER_ACCOUNT_STATUSES,
} from '../../../domain/users/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { PaginationQueryPipe } from '../pipes/pagination-query.pipe';
import type { PageRequest } from '../../../application/pagination/page-request';
import { PaginatedResult } from '../../../application/pagination/paginated-result';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { UserPresenter, type UserResponse } from './user.presenter';

@Controller({ path: 'users', version: '1' })
@UseGuards(JwtAccessGuard, RolesGuard)
@Roles('admin')
export class UserController {
  constructor(
    @Inject(USER_MANAGEMENT_SERVICE)
    private readonly users: UserManagementServicePort,
  ) {}

  @Get()
  async list(
    @Query(PaginationQueryPipe) pageRequest: PageRequest,
    @Query('role') role?: string,
    @Query('accountStatus') accountStatus?: string,
  ) {
    if (role !== undefined && !USER_ROLES.includes(role as never))
      throw this.invalidFilter('role', USER_ROLES);
    if (
      accountStatus !== undefined &&
      !USER_ACCOUNT_STATUSES.includes(accountStatus as never)
    )
      throw this.invalidFilter('accountStatus', USER_ACCOUNT_STATUSES);
    const result = await this.users.listUsers({
      pageRequest,
      role: role as (typeof USER_ROLES)[number] | undefined,
      accountStatus: accountStatus as
        (typeof USER_ACCOUNT_STATUSES)[number] | undefined,
    });
    return PaginatedResult.create({
      items: result.items.map((user) => UserPresenter.toHttp(user)),
      totalItems: result.pagination.totalItems,
      pageRequest,
    });
  }

  @Post()
  async create(@Body() body: CreateUserDto): Promise<UserResponse> {
    return UserPresenter.toHttp(await this.users.createUser(body));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
  ): Promise<UserResponse> {
    const user = await this.users.updateUser(id, body);
    if (!user)
      throw new ApplicationError('User was not found', {
        code: 'USER_NOT_FOUND',
        kind: 'not_found',
      });
    return UserPresenter.toHttp(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    // DELETE is a privacy-preserving soft-delete; hard-delete is not an
    // operational API because legacy records must retain referential integrity.
    await this.users.deleteUser(id);
  }

  private invalidFilter(
    name: string,
    values: readonly string[],
  ): ApplicationError {
    return new ApplicationError(`Invalid ${name} filter`, {
      code: 'INVALID_USER_FILTER',
      kind: 'validation',
      details: { allowed: values },
    });
  }
}
