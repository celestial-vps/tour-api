import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsUUID, IsInt, Min, Max, IsIn } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

/** ===========================
 * DTO untuk Create Country
 * =========================== */
export class CreateCountryDto {
  @ApiProperty({ example: 'ID', description: 'Kode negara (ISO 3166-1 alpha-2)' })
  @IsString()
  @IsNotEmpty()
  countryCode: string;

  @ApiProperty({ example: 'Indonesia', description: 'Nama negara' })
  @IsString()
  @IsNotEmpty()
  countryName: string;

  @ApiProperty({ example: 'IDR', description: 'Mata uang negara' })
  @IsString()
  @IsNotEmpty()
  countryCurrency: string;
}

/** ===========================
 * DTO untuk Update Country
 * =========================== */
export class UpdateCountryDto extends PartialType(CreateCountryDto) {}

/** ===========================
 * DTO untuk Params (OID)
 * =========================== */
export class ParamsCountryDto {
  @ApiProperty({ example: 'f22a32d8-2f11-4b78-a263-c9b199ecad0c', description: 'OID negara' })
  @IsUUID()
  oid: string;
}

/** ===========================
 * DTO untuk Filter / Query
 * =========================== */
export class FilterCountryDto {
  @ApiPropertyOptional({ example: 'ID', description: 'Filter berdasarkan kode negara' })
  @IsString()
  @IsOptional()
  countryCode?: string;

  @ApiPropertyOptional({ example: 'Indonesia', description: 'Filter berdasarkan nama negara' })
  @IsString()
  @IsOptional()
  countryName?: string;

  @ApiPropertyOptional({ example: 'IDR', description: 'Filter berdasarkan mata uang' })
  @IsString()
  @IsOptional()
  countryCurrency?: string;

  @ApiPropertyOptional({ example: 1, description: 'Halaman ke berapa (pageIndex)' })
  @IsInt()
  @Min(1)
  @IsOptional()
  pageIndex?: number;

  @ApiPropertyOptional({ example: 10, description: 'Jumlah data per halaman (pageSize)' })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  pageSize?: number;

  @ApiPropertyOptional({ example: 'countryName', description: 'Kolom untuk sort', enum: ['countryCode','countryName','countryCurrency'] })
  @IsString()
  @IsIn(['countryCode','countryName','countryCurrency'])
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({ example: 'asc', description: 'Urutan sort', enum: ['asc','desc'] })
  @IsString()
  @IsIn(['asc','desc'])
  @IsOptional()
  sortOrder?: string;
}
