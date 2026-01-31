import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { ApiBaseResponseProps } from './base/api-base-response.decorator';
import { PaginationInfo } from './base/pagination-info-dto';

export class FilterLikeDto {
    @IsUUID()
    articleId?: string;

    @IsUUID()
    userId?: string;
}

export class CreateLikeDto {
    @ApiProperty({ example: 'uuid-article', description: 'Article ID' })
    @IsUUID()
    articleId: string;

    @ApiProperty({ example: 'uuid-user', description: 'User ID' })
    @IsUUID()
    userId: string;
}

export class UpdateLikeDto {
    @ApiProperty({ example: 'uuid-article', description: 'Article ID' })
    @IsUUID()
    articleId: string;

    @ApiProperty({ example: 'uuid-user', description: 'User ID' })
    @IsUUID()
    userId: string;
}


/** ---------------- Response DTO ---------------- */
export class ResponseLikeVm {
    @ApiProperty({ example: '1', description: 'OID bank' })
    oid: string;

    @ApiProperty({ example: 'B001', description: 'Like code' })
    articleId: string;

    @ApiProperty({ example: 'Mandiri', description: 'Short name' })
    shortName: string;

    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Created at' })
    createdAt: Date;

    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Updated at', required: false })
    updatedAt?: Date;
}

/** ---------------- Success Response DTO for Like ---------------- */
export class SuccessLikeResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: [ResponseLikeVm], description: 'List of banks' })
    data: ResponseLikeVm[] = [];
}


export class SuccessLikeObjectResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: ResponseLikeVm, description: 'Like object' })
    data: ResponseLikeVm;
}


export class SuccessLikePaginatedResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiProperty({ type: PaginationInfo })
    pagination: PaginationInfo;
    @ApiProperty({ type: [ResponseLikeVm] })
    data: ResponseLikeVm[];
}