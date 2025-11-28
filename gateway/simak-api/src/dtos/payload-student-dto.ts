import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';

export class FilterStudentDto {
  @ApiProperty({ example: '2023001', description: 'Student NIM' })
  @IsOptional()
  @IsString()
  nim?: string;

  @ApiProperty({ example: 'John Doe', description: 'Student name' })
  @IsOptional()
  @IsString()
  name?: string;
}

export class CreateStudentDto {
  @ApiProperty({ example: '2023001', description: 'Student NIM' })
  @IsString()
  @IsNotEmpty()
  nim: string;

  @ApiProperty({ example: 'John Doe', description: 'Student name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Informatics', description: 'Study program' })
  @IsString()
  @IsNotEmpty()
  studyProgram: string;

  @ApiProperty({ example: 2023, description: 'Enrollment year' })
  @IsNumber()
  @IsNotEmpty()
  yearOfEntry: number;
}

export class UpdateStudentDto extends CreateStudentDto {}
