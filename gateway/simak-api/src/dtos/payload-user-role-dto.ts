import { 
    IsString, 
    IsBoolean, 
    IsNotEmpty 
  } from 'class-validator';
  
  // Filter DTO for User Role
  export class FilterUserRoleDto {
    @IsString()
    @IsNotEmpty()
    roleName: string; // Required field
  }
  
  // Page DTO for User Role
  export class PageUserRoleDto {
    @IsString()
    @IsNotEmpty()
    roleName: string; // Required field
  }
  
  // Create User Role DTO
  export class CreateUserRoleDto {
    @IsString()
    @IsNotEmpty()
    roleName: string; // Required field
  
    @IsString()
    @IsNotEmpty()
    targetType: string; // Required field
  
    @IsBoolean()
    isAdministrative: boolean; // Required field
  
    @IsBoolean()
    readState: boolean; // Required field
  
    @IsBoolean()
    writeState: boolean; // Required field
  
    @IsBoolean()
    createState: boolean; // Required field
  
    @IsBoolean()
    deleteState: boolean; // Required field
  
    @IsBoolean()
    navigateState: boolean; // Required field
  }
  
  // Update User Role DTO
  export class UpdateUserRoleDto {
    @IsString()
    @IsNotEmpty()
    roleName: string; // Required field
  
    @IsString()
    @IsNotEmpty()
    targetType: string; // Required field
  
    @IsBoolean()
    isAdministrative: boolean; // Required field
  
    @IsBoolean()
    readState: boolean; // Required field
  
    @IsBoolean()
    writeState: boolean; // Required field
  
    @IsBoolean()
    createState: boolean; // Required field
  
    @IsBoolean()
    deleteState: boolean; // Required field
  
    @IsBoolean()
    navigateState: boolean; // Required field
  }
  