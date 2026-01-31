import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiBaseResponseProps } from './base/api-base-response.decorator';
import { PaginationInfo } from './base/pagination-info-dto';

export class FilterTagDto {
    @IsOptional()
    @IsString()
    name?: string;
}

export class CreateTagDto {
    @ApiProperty({ example: 'Football', description: 'Tag name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'football', description: 'Slug for URL' })
    @IsString()
    @IsNotEmpty()
    slug: string;
}

export class UpdateTagDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    slug: string;
}



/** ---------------- Response DTO ---------------- */
export class ResponseTagVm {
    @ApiProperty({ example: '1', description: 'OID bank' })
    oid: string;

    @ApiProperty({ example: 'Tag Mandiri', description: 'Tag name' })
    name: string;

    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Created at' })
    createdAt: Date;

    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Updated at', required: false })
    updatedAt?: Date;
}

/** ---------------- Success Response DTO for Tag ---------------- */
export class SuccessTagResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: [ResponseTagVm], description: 'List of banks' })
    data: ResponseTagVm[] = [];
}


export class SuccessTagObjectResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: ResponseTagVm, description: 'Tag object' })
    data: ResponseTagVm;
}


export class SuccessTagPaginatedResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiProperty({ type: PaginationInfo })
    pagination: PaginationInfo;
    @ApiProperty({ type: [ResponseTagVm] })
    data: ResponseTagVm[];
}