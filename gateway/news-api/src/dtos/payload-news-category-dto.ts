import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiBaseResponseProps } from './base/api-base-response.decorator';
import { PaginationInfo } from './base/pagination-info-dto';

/** DTO untuk filter kategori */
export class FilterNewsCategoryDto { 
  @ApiPropertyOptional({ 
    example: 'Technology', 
    description: 'Filter kategori berdasarkan nama kategori' 
  })
  @IsString()
  @IsOptional()
  categoryName?: string;
}

/** DTO untuk membuat kategori baru */
export class CreateNewsCategoryDto { 
  @ApiProperty({ 
    example: 'Technology', 
    description: 'Nama kategori yang ingin dibuat' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Category name tidak boleh kosong' })
  categoryName: string; 
}

/** DTO untuk update kategori */
export class UpdateNewsCategoryDto { 
  @ApiProperty({ 
    example: 'Technology', 
    description: 'Nama kategori yang akan diupdate' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Category name tidak boleh kosong' })
  categoryName: string; 
}


/** ---------------- Response DTO ---------------- */
export class ResponseNewsCategoryVm {
    @ApiProperty({ example: '1', description: 'OID newsCategory' })
    oid: string;

    @ApiProperty({ example: 'B001', description: 'NewsCategory code' })
    categoryName: string;
 
    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Created at' })
    createdAt: Date;

    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Updated at', required: false })
    updatedAt?: Date;
}

/** ---------------- Success Response DTO for NewsCategory ---------------- */
export class SuccessNewsCategoryResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: [ResponseNewsCategoryVm], description: 'List of newsCategorys' })
    data: ResponseNewsCategoryVm[] = [];
}


export class SuccessNewsCategoryObjectResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: ResponseNewsCategoryVm, description: 'NewsCategory object' })
    data: ResponseNewsCategoryVm;
}


export class SuccessNewsCategoryPaginatedResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiProperty({ type: PaginationInfo })
    pagination: PaginationInfo;
    @ApiProperty({ type: [ResponseNewsCategoryVm] })
    data: ResponseNewsCategoryVm[];
}

 