import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, Length } from 'class-validator';

export class CreateSemesterDto {
  @IsString() @Length(2, 160) name!: string;
  @Type(() => Date) @IsDate() startDate!: Date;
  @Type(() => Date) @IsDate() endDate!: Date;
  @IsOptional() @Type(() => Date) @IsDate() midTermStartDate?: Date;
  @IsOptional() @Type(() => Date) @IsDate() midTermEndDate?: Date;
}

export class UpdateSemesterDto {
  @IsOptional() @IsString() @Length(2, 160) name?: string;
  @IsOptional() @Type(() => Date) @IsDate() startDate?: Date;
  @IsOptional() @Type(() => Date) @IsDate() endDate?: Date;
  @IsOptional() @Type(() => Date) @IsDate() midTermStartDate?: Date | null;
  @IsOptional() @Type(() => Date) @IsDate() midTermEndDate?: Date | null;
}
