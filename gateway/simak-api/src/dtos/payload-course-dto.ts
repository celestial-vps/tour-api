import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class FilterCourseDto {
  @ApiProperty({ example: 'IF101', description: 'Course code' })
  @IsOptional()
  @IsString()
  courseCode?: string;

  @ApiProperty({ example: 'Algorithms', description: 'Course name' })
  @IsOptional()
  @IsString()
  courseName?: string;
}

export class CreateCourseDto {
  @ApiProperty({ example: 'IF101', description: 'Course code' })
  @IsString()
  @IsNotEmpty()
  courseCode: string;

  @ApiProperty({ example: 'Algorithms', description: 'Course name' })
  @IsString()
  @IsNotEmpty()
  courseName: string;

  @ApiProperty({ example: 3, description: 'Credits' })
  @IsNumber()
  @IsNotEmpty()
  credits: number;

  // @ApiProperty({ example: '654321', description: 'Teacher ID' })
  // @IsString()
  // @IsNotEmpty()
  // teacher: string;
}

export class UpdateCourseDto extends CreateCourseDto {}
