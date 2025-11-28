import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateStudyPlanDetailDto {
  @ApiProperty({ example: 'studyPlanId', description: 'Study plan ID' })
  @IsString()
  @IsNotEmpty()
  studyPlan: string;

  @ApiProperty({ example: 'courseId', description: 'Course ID' })
  @IsString()
  @IsNotEmpty()
  course: string;
}

export class UpdateStudyPlanDetailDto extends CreateStudyPlanDetailDto {}
