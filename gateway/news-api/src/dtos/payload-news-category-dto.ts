import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

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
