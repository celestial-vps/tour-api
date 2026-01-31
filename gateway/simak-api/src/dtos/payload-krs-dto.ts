import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class FilterKrsDto {
  @ApiProperty({ example: 'studentId', description: 'Student ID' })
  @IsOptional()
  @IsString()
  student?: string;

  @ApiProperty({ example: 1, description: 'Semester' })
  @IsOptional()
  @IsNumber()
  semester?: number;
}

export class CreateKrsDto {
  @ApiProperty({ example: 'studentId', description: 'Student ID' })
  @IsString()
  @IsNotEmpty()
  student: string;

  @ApiProperty({ example: 1, description: 'Semester' })
  @IsNumber()
  @IsNotEmpty()
  semester: number;

  @ApiProperty({ example: '2024/2025', description: 'Academic year' })
  @IsString()
  @IsNotEmpty()
  academicYear: string;
}

export class UpdateKrsDto extends CreateKrsDto {}
