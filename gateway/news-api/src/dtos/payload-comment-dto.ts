import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsEnum, IsUUID } from 'class-validator';
import { PaginationInfo } from './base/pagination-info-dto';
import { ApiBaseResponseProps } from './base/api-base-response.decorator';

export class FilterCommentDto {
    @IsOptional()
    @IsUUID()
    articleId?: string;

    @IsOptional()
    @IsUUID()
    userId?: string;

    @IsOptional()
    @IsEnum(['pending', 'approved', 'rejected'])
    status?: 'pending' | 'approved' | 'rejected';
}

export class CreateCommentDto {
    @ApiProperty({ example: 'uuid-article', description: 'ID of the article' })
    @IsUUID()
    articleId: string;

    @ApiProperty({ example: 'uuid-user', description: 'ID of the user' })
    @IsUUID()
    userId: string;

    @ApiProperty({ example: 'This is a comment', description: 'Comment content' })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({ example: 'pending', description: 'Status of the comment' })
    @IsEnum(['pending', 'approved', 'rejected'])
    status: 'pending' | 'approved' | 'rejected';
}

export class UpdateCommentDto {

    @ApiProperty({ example: 'uuid-article', description: 'ID of the article' })
    @IsUUID()
    articleId: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsEnum(['pending', 'approved', 'rejected'])
    status: 'pending' | 'approved' | 'rejected';
}


/** ---------------- Response DTO ---------------- */
export class ResponseCommentVm {
    @ApiProperty({ example: '1', description: 'OID bank' })
    oid: string;

    @ApiProperty({ example: 'B001', description: 'Comment code' })
    articleId: string;
 
    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Created at' })
    createdAt: Date;

    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Updated at', required: false })
    updatedAt?: Date;
}

/** ---------------- Success Response DTO for Comment ---------------- */
export class SuccessCommentResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: [ResponseCommentVm], description: 'List of banks' })
    data: ResponseCommentVm[] = [];
}


export class SuccessCommentObjectResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: ResponseCommentVm, description: 'Comment object' })
    data: ResponseCommentVm;
}


export class SuccessCommentPaginatedResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiProperty({ type: PaginationInfo })
    pagination: PaginationInfo;
    @ApiProperty({ type: [ResponseCommentVm] })
    data: ResponseCommentVm[];
}