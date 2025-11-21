import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsDateString, IsInt, IsIn, IsUUID, IsNumber } from 'class-validator';

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
