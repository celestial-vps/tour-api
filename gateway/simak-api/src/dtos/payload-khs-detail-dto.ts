import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStudyResultDetailDto {
  @ApiProperty({ example: 'studyResultId', description: 'Study result ID' })
  @IsString()
  @IsNotEmpty()
  studyResult: string;

  @ApiProperty({ example: 'courseId', description: 'Course ID' })
  @IsString()
  @IsNotEmpty()
  course: string;

  @ApiProperty({ example: 'A', description: 'Letter grade' })
  @IsString()
  @IsNotEmpty()
  gradeLetter: string;

  @ApiProperty({ example: 4.0, description: 'Grade point' })
  @IsNumber()
  @IsNotEmpty()
  gradePoint: number;
}

export class UpdateStudyResultDetailDto extends CreateStudyResultDetailDto {}
