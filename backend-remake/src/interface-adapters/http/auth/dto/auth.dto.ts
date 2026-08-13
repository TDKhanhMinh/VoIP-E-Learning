import { IsEmail, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsEmail() email!: string;
  @IsString() @Length(12, 128) password!: string;
}

export class LoginDto {
  @IsEmail() email!: string;
  @IsString() @Length(1, 128) password!: string;
}
