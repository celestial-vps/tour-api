import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsEnum, IsUUID, IsInt } from 'class-validator';
import { ApiBaseResponseProps } from './base/api-base-response.decorator';
import { PaginationInfo } from './base/pagination-info-dto';

export class FilterArticleDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsUUID()
    content?: string;

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


/** ---------------- Response DTO ---------------- */
export class ResponseArticleVm {
    @ApiProperty({ example: '1', description: 'OID bank' })
    oid: string;

    @ApiProperty({ example: 'B001', description: 'Article code' })
    title: string;
 
    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Created at' })
    createdAt: Date;

    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Updated at', required: false })
    updatedAt?: Date;
}

/** ---------------- Success Response DTO for Article ---------------- */
export class SuccessArticleResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: [ResponseArticleVm], description: 'List of banks' })
    data: ResponseArticleVm[] = [];
}


export class SuccessArticleObjectResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: ResponseArticleVm, description: 'Article object' })
    data: ResponseArticleVm;
}


export class SuccessArticlePaginatedResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiProperty({ type: PaginationInfo })
    pagination: PaginationInfo;
    @ApiProperty({ type: [ResponseArticleVm] })
    data: ResponseArticleVm[];
}