import {
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class CreateCourseDto {
  @IsString() @Length(2, 32) @Matches(/^[A-Za-z0-9-]+$/) code!: string;
  @IsOptional() @IsString() @Length(2, 160) name?: string;
  @IsString() @Length(2, 160) title!: string;
  @IsInt() @Min(1) credit!: number;
  @IsString() @Length(1, 4000) description!: string;
}

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  @Length(2, 32)
  @Matches(/^[A-Za-z0-9-]+$/)
  code?: string;
  @IsOptional() @IsString() @Length(2, 160) name?: string;
  @IsOptional() @IsString() @Length(2, 160) title?: string;
  @IsOptional() @IsInt() @Min(1) credit?: number;
  @IsOptional() @IsString() @Length(1, 4000) description?: string | null;
}
