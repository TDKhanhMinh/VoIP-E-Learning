import {
  IsEmail,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import {
  USER_ACCOUNT_STATUSES,
  USER_ROLES,
  type UserAccountStatus,
  type UserRole,
} from '../../../../domain/users/user.entity';

export class CreateUserDto {
  @IsEmail() email!: string;
  @IsString() @Length(1, 128) password!: string;
  @IsOptional() @IsString() @Length(1, 160) fullName?: string;
  @IsEnum(USER_ROLES) role!: UserRole;
}

export class UpdateUserDto {
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @Length(1, 128) password?: string;
  @IsOptional() @IsString() @Length(1, 160) fullName?: string;
  @IsOptional() @IsEnum(USER_ROLES) role?: UserRole;
  @IsOptional() @IsIn(USER_ACCOUNT_STATUSES) accountStatus?: UserAccountStatus;
}
