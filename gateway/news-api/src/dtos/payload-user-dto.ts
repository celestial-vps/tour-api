import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDateString,
  Min,
  IsNotEmpty
} from 'class-validator';

// Filter DTO for User
export class FilterUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string; // Required
}

// Register DTO for User
export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string; // Required email

  @IsString()
  // @Min(6)
  @IsNotEmpty()
  password: string; // Required password
}

// Login DTO for User
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string; // Required email

  @IsString()
  // @Min(6)
  @IsNotEmpty()
  password: string; // Required password
}

// Create User DTO
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Required name

  @IsEmail()
  @IsNotEmpty()
  email: string; // Required email

  @IsString()
  // @Min(6)
  @IsNotEmpty()
  password: string; // Required password

  @IsDateString()
  @IsNotEmpty()
  birthday: string; // Required ISO date format

  @IsString()
  @IsNotEmpty()
  memberNumber: string; // Required member number

  @IsOptional()
  @IsString()
  androidToken?: string; // Optional

  @IsBoolean()
  isActive: boolean; // Required

  @IsString()
  @IsNotEmpty()
  roleOid: string; // Required

  @IsOptional()
  @IsDateString()
  activatedAt?: string | null; // Optional, can be null
}

// Update User 
export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Required name

  @IsEmail()
  @IsNotEmpty()
  email: string; // Required email

  @IsString()
  // @Min(6)
  @IsNotEmpty()
  password: string; // Required password

  @IsDateString()
  @IsNotEmpty()
  birthday: string; // Required ISO date format

  @IsString()
  @IsNotEmpty()
  memberNumber: string; // Required member number

  @IsOptional()
  @IsString()
  androidToken?: string; // Optional

  @IsBoolean()
  isActive: boolean; // Required

  @IsString()
  @IsNotEmpty()
  roleOid: string; // Required

  @IsOptional()
  @IsDateString()
  activatedAt?: string | null; // Optional, can be null
}