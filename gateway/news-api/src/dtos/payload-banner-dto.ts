import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';
import { PaginationInfo } from './base/pagination-info-dto';
import { ApiBaseResponseProps } from './base/api-base-response.decorator';

export class FilterBannerDto {
    @IsOptional()
    @IsString()
    title?: string;
}

export class CreateBannerDto {
    @ApiProperty({ example: 'Big Sale', description: 'Banner title' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'banner.jpg', description: 'Banner image' })
    @IsString()
    @IsNotEmpty()
    image: string;

    @ApiProperty({ example: 'uuid-article', description: 'Optional article ID' })
    @IsOptional()
    @IsUUID()
    articleId?: string;
}

export class UpdateBannerDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    image: string;

    @IsOptional()
    @IsUUID()
    articleId?: string;
}


/** ---------------- Response DTO ---------------- */
export class ResponseBannerVm {
    @ApiProperty({ example: '1', description: 'OID bank' })
    oid: string;

    @ApiProperty({ example: 'B001', description: 'Banner code' })
    title: string;
 
    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Created at' })
    createdAt: Date;

    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Updated at', required: false })
    updatedAt?: Date;
}

/** ---------------- Success Response DTO for Banner ---------------- */
export class SuccessBannerResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: [ResponseBannerVm], description: 'List of banks' })
    data: ResponseBannerVm[] = [];
}


export class SuccessBannerObjectResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: ResponseBannerVm, description: 'Banner object' })
    data: ResponseBannerVm;
}


export class SuccessBannerPaginatedResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiProperty({ type: PaginationInfo })
    pagination: PaginationInfo;
    @ApiProperty({ type: [ResponseBannerVm] })
    data: ResponseBannerVm[];
}