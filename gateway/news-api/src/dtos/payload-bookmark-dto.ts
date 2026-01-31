import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { ApiBaseResponseProps } from './base/api-base-response.decorator';
import { PaginationInfo } from './base/pagination-info-dto';

export class FilterBookmarkDto {
    @IsUUID()
    articleId?: string;

    @IsUUID()
    userId?: string;
}

export class CreateBookmarkDto {
    @ApiProperty({ example: 'uuid-user', description: 'User ID' })
    @IsUUID()
    userId: string;

    @ApiProperty({ example: 'uuid-article', description: 'Article ID' })
    @IsUUID()
    articleId: string;
}

export class UpdateBookmarkDto {
    @IsUUID()
    userId: string;

    @IsUUID()
    articleId: string;
}


/** ---------------- Response DTO ---------------- */
export class ResponseBookmarkVm {
    @ApiProperty({ example: '1', description: 'OID bank' })
    oid: string;

    @ApiProperty({ example: 'B001', description: 'Bookmark code' })
    articleId: string;

    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Created at' })
    createdAt: Date;

    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Updated at', required: false })
    updatedAt?: Date;
}

/** ---------------- Success Response DTO for Bookmark ---------------- */
export class SuccessBookmarkResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: [ResponseBookmarkVm], description: 'List of banks' })
    data: ResponseBookmarkVm[] = [];
}


export class SuccessBookmarkObjectResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: ResponseBookmarkVm, description: 'Bookmark object' })
    data: ResponseBookmarkVm;
}


export class SuccessBookmarkPaginatedResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiProperty({ type: PaginationInfo })
    pagination: PaginationInfo;
    @ApiProperty({ type: [ResponseBookmarkVm] })
    data: ResponseBookmarkVm[];
}