import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsEmail() email!: string;
  @IsString() @Length(1, 128) password!: string;
}

export class ChangePasswordDto {
  @IsString() @Length(1, 128) currentPassword!: string;
  @IsString() @Length(1, 128) newPassword!: string;
}

export class PasswordResetRequestDto {
  @IsEmail() email!: string;
}

export class PasswordResetConfirmDto {
  @IsString() @Length(32, 256) token!: string;
  @IsString() @Length(1, 128) newPassword!: string;
}

export class EmailVerificationConfirmDto {
  @IsString() @Length(32, 256) token!: string;
}
