import {
  IsString,
  IsBoolean,
  IsNotEmpty
} from 'class-validator';
import { ApiBaseResponseProps } from './base/api-base-response.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationInfo } from './base/pagination-info-dto';

// Filter DTO for User Role
export class FilterUserRoleDto {
  @IsString()
  @IsNotEmpty()
  roleName: string; // Required field

  @IsString()
  @IsNotEmpty()
  targetType: string; // Required field
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


/** ---------------- Response DTO ---------------- */
export class ResponseUserRoleVm {
    @ApiProperty({ example: '1', description: 'OID bank' })
    oid: string;

    @ApiProperty({ example: 'B001', description: 'UserRole code' })
    roleName: string;

    @ApiProperty({ example: 'UserRole Mandiri', description: 'UserRole name' })
    targetType: string;

    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Created at' })
    createdAt: Date;

    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Updated at', required: false })
    updatedAt?: Date;
}

/** ---------------- Success Response DTO for UserRole ---------------- */
export class SuccessUserRoleResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: [ResponseUserRoleVm], description: 'List of banks' })
    data: ResponseUserRoleVm[] = [];
}


export class SuccessUserRoleObjectResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: ResponseUserRoleVm, description: 'UserRole object' })
    data: ResponseUserRoleVm;
}


export class SuccessUserRolePaginatedResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiProperty({ type: PaginationInfo })
    pagination: PaginationInfo;
    @ApiProperty({ type: [ResponseUserRoleVm] })
    data: ResponseUserRoleVm[];
}