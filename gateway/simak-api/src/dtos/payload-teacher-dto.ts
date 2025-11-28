import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class FilterTeacherDto {
  @ApiProperty({ example: '123456', description: 'Teacher ID (NIDN)' })
  @IsOptional()
  @IsString()
  nidn?: string;

  @ApiProperty({ example: 'Dr. Smith', description: 'Teacher name' })
  @IsOptional()
  @IsString()
  name?: string;
}

export class CreateTeacherDto {
  @ApiProperty({ example: '123456', description: 'Teacher ID (NIDN)' })
  @IsString()
  @IsNotEmpty()
  nidn: string;

  @ApiProperty({ example: 'Dr. Smith', description: 'Teacher name' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateTeacherDto extends CreateTeacherDto {}
