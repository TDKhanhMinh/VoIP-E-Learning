import { IsString, Length, Matches } from 'class-validator';

export class CreateCourseDto {
  @IsString() @Length(2, 32) @Matches(/^[A-Za-z0-9-]+$/) code!: string;
  @IsString() @Length(2, 160) name!: string;
}
