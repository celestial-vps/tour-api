import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsDateString, IsInt, IsIn, IsUUID, IsNumber, ValidateNested, IsArray } from 'class-validator';
import { ApiBaseResponseProps } from './base/api-base-response.decorator';
import { PaginationInfo } from './base/pagination-info-dto';
import { Type } from 'class-transformer';

export class FilterNewsDto {
    @ApiPropertyOptional({ example: 'Breaking News', description: 'Filter berita berdasarkan judul (title) yang mengandung kata ini' })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiPropertyOptional({ example: 'Isi lengkap berita...', description: 'Filter berita berdasarkan konten (content) yang mengandung kata ini' })
    @IsString()
    @IsOptional()
    content?: string;
}

export class NewsDetailDto {
    @ApiProperty({ example: 'uuid-category', description: 'OID kategori berita' })
    @IsUUID()
    imageOid: string;

    @ApiProperty({ example: 'uuid-category', description: 'OID kategori berita' })
    @IsUUID()
    newsOid: string;

    @ApiPropertyOptional({ example: 'draft', description: 'Status berita', enum: ['draft', 'published', 'archived'] })
    @IsString()
    @IsOptional()
    @IsIn(['cover', 'thumbnail', 'gallery'])
    role?: string;


}

/** DTO untuk membuat berita */
export class CreateNewsDto {
    @ApiProperty({ example: 'Breaking News', description: 'Judul berita' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Isi lengkap berita...', description: 'Konten berita' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiPropertyOptional({ example: 'Ringkasan berita', description: 'Ringkasan berita' })
    @IsString()
    @IsOptional()
    summary?: string;

    @ApiPropertyOptional({ example: 'John Doe', description: 'Penulis berita' })
    @IsString()
    @IsOptional()
    author?: string;

    @ApiPropertyOptional({ example: 'uuid-image', description: 'OID gambar utama berita' })
    @IsUUID()
    @IsOptional()
    imageOid?: string;

    @ApiProperty({ example: 'uuid-category', description: 'OID kategori berita' })
    @IsUUID()
    categoryOid: string;

    @ApiPropertyOptional({ example: 'draft', description: 'Status berita', enum: ['draft', 'published', 'archived'] })
    @IsString()
    @IsOptional()
    @IsIn(['draft', 'published', 'archived'])
    status?: string;

    @ApiPropertyOptional({ example: '2025-11-20T12:00:00Z', description: 'Tanggal publikasi berita' })
    @IsDateString()
    @IsOptional()
    publishedAt?: Date;

    // @ApiPropertyOptional({ example: 'tech,ai', description: 'Tags berita' })
    // @IsString()
    // @IsOptional()
    // tags?: string;

    @ApiPropertyOptional({
        example: ['tech', 'ai'],
        description: 'Tags berita',
        type: [String]
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tags?: string[];

    @ApiPropertyOptional({ example: 10, description: 'Tags berita' })
    @IsNumber()
    @IsOptional()
    views?: number;

    @ApiPropertyOptional({ example: 'en', description: 'Bahasa berita' })
    @IsString()
    @IsOptional()
    language?: string;

    @ApiPropertyOptional({
        type: [NewsDetailDto],
        description: 'Detail gambar berita',
        example: [{ imageOid: 'uuid-image', newsOid: 'uuid-news', role: 'cover' }]
    })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => NewsDetailDto)
    nwsDetails?: NewsDetailDto[];


}



export class UpdateNewsDto {
    @ApiProperty({ example: 'Breaking News', description: 'Judul berita' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Isi lengkap berita...', description: 'Konten berita' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiPropertyOptional({ example: 'Ringkasan berita', description: 'Ringkasan berita' })
    @IsString()
    @IsOptional()
    summary?: string;

    @ApiPropertyOptional({ example: 'John Doe', description: 'Penulis berita' })
    @IsString()
    @IsOptional()
    author?: string;

    @ApiPropertyOptional({ example: 'uuid-image', description: 'OID gambar utama berita' })
    @IsUUID()
    @IsOptional()
    imageOid?: string;

    @ApiProperty({ example: 'uuid-category', description: 'OID kategori berita' })
    @IsUUID()
    categoryOid: string;

    @ApiPropertyOptional({ example: 'draft', description: 'Status berita', enum: ['draft', 'published', 'archived'] })
    @IsString()
    @IsOptional()
    @IsIn(['draft', 'published', 'archived'])
    status?: string;

    @ApiPropertyOptional({ example: '2025-11-20T12:00:00Z', description: 'Tanggal publikasi berita' })
    @IsDateString()
    @IsOptional()
    publishedAt?: Date;

    @ApiPropertyOptional({ example: 'tech,ai', description: 'Tags berita' })
    @IsString()
    @IsOptional()
    tags?: string;

    @ApiPropertyOptional({ example: 10, description: 'Tags berita' })
    @IsNumber()
    @IsOptional()
    views?: number;

    @ApiPropertyOptional({ example: 'en', description: 'Bahasa berita' })
    @IsString()
    @IsOptional()
    language?: string;
}


/** ---------------- Response DTO ---------------- */
export class ResponseNewsVm {
    @ApiProperty({ example: '1', description: 'OID bank' })
    oid: string;

    @ApiProperty({ example: 'B001', description: 'News code' })
    title: string;

    @ApiProperty({ example: 'News Mandiri', description: 'News name' })
    content: string;

    @ApiProperty({ example: 'Mandiri', description: 'Short name' })
    summary: string;

    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Created at' })
    createdAt: Date;

    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Updated at', required: false })
    updatedAt?: Date;
}

/** ---------------- Success Response DTO for News ---------------- */
export class SuccessNewsResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: [ResponseNewsVm], description: 'List of banks' })
    data: ResponseNewsVm[] = [];
}


export class SuccessNewsObjectResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: ResponseNewsVm, description: 'News object' })
    data: ResponseNewsVm;
}


export class SuccessNewsPaginatedResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiProperty({ type: PaginationInfo })
    pagination: PaginationInfo;
    @ApiProperty({ type: [ResponseNewsVm] })
    data: ResponseNewsVm[];
}
