import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsEnum, IsUUID, IsInt } from 'class-validator';

export class FilterArticleDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsUUID()
    authorId?: string;

    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @IsOptional()
    @IsEnum(['draft','published','deleted'])
    status?: 'draft' | 'published' | 'deleted';
}

export class CreateArticleDto {
    @ApiProperty({ example: 'Breaking News', description: 'Article title' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'breaking-news', description: 'Slug for URL' })
    @IsString()
    @IsNotEmpty()
    slug: string;

    @ApiProperty({ example: 'Article content here...', description: 'Content of the article' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ example: 'thumbnail.jpg', description: 'Thumbnail image' })
    @IsOptional()
    @IsString()
    thumbnail?: string;

    @ApiProperty({ example: 'uuid-author', description: 'Author ID' })
    @IsUUID()
    authorId: string;

    @ApiProperty({ example: 'uuid-category', description: 'Category ID' })
    @IsUUID()
    categoryId: string;

    @ApiProperty({ example: 'draft', description: 'Status of article' })
    @IsEnum(['draft','published','deleted'])
    status: 'draft' | 'published' | 'deleted';
}

export class UpdateArticleDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsString()
    thumbnail?: string;

    @IsUUID()
    authorId: string;

    @IsUUID()
    categoryId: string;

    @IsEnum(['draft','published','deleted'])
    status: 'draft' | 'published' | 'deleted';
}
