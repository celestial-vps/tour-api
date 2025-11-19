import { IsString, IsEmail, IsOptional, IsBoolean, IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Filter DTO for User
export class FilterUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string; // Required
}

// Register DTO for User
export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string; // Required email

  @ApiProperty({ example: 'secret123', description: 'Password for the user' })
  @IsString()
  @IsNotEmpty()
  password: string; // Required password
}

// Login DTO for User
export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string; // Required email

  @ApiProperty({ example: 'secret123', description: 'Password for login' })
  @IsString()
  @IsNotEmpty()
  password: string; // Required password
}

// Create User DTO
export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'secret123', description: 'Password for the user' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '1990-01-01', description: 'Birthday in ISO date format' })
  @IsDateString()
  @IsNotEmpty()
  birthday: string;

  @ApiProperty({ example: 'MEM123456', description: 'Member number' })
  @IsString()
  @IsNotEmpty()
  memberNumber: string;

  @ApiPropertyOptional({ example: 'android-token-xyz', description: 'Optional Android token' })
  @IsOptional()
  @IsString()
  androidToken?: string;

  @ApiProperty({ example: true, description: 'Whether user is active' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: 'role-uuid-123', description: 'Role OID assigned to the user' })
  @IsString()
  @IsNotEmpty()
  roleOid: string;

  @ApiPropertyOptional({ example: '2025-01-01', description: 'Optional activated date in ISO format' })
  @IsOptional()
  @IsDateString()
  activatedAt?: string | null;
}

// Update User DTO (sama dengan CreateUserDto, tapi bisa dibuat berbeda jika perlu)
export class UpdateUserDto extends CreateUserDto {}
