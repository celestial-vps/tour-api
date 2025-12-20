import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsUUID, IsBoolean } from 'class-validator';
import { ApiBaseResponseProps } from './base/api-base-response.decorator';
import { PaginationInfo } from './base/pagination-info-dto';

export class FilterNotificationDto {
    @IsOptional()
    @IsUUID()
    title?: string;

    @IsOptional()
    @IsBoolean()
    isRead?: boolean;
}

export class CreateNotificationDto {
    @ApiProperty({ example: 'uuid-user', description: 'User ID' })
    @IsUUID()
    userId: string;

    @ApiProperty({ example: 'New Article', description: 'Notification title' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'A new article has been published', description: 'Notification message' })
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsOptional()
    @IsBoolean()
    isRead?: boolean;
}

export class UpdateNotificationDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsBoolean()
    isRead: boolean;
}



/** ---------------- Response DTO ---------------- */
export class ResponseNotificationVm {
    @ApiProperty({ example: '1', description: 'OID bank' })
    oid: string;

    @ApiProperty({ example: 'B001', description: 'Notification code' })
    title: string;

    @ApiProperty({ example: 'Notification Mandiri', description: 'Notification name' })
    message: string;

    @ApiProperty({ example: 'Mandiri', description: 'Short name' })
    isRead: string;

    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Created at' })
    createdAt: Date;

    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Updated at', required: false })
    updatedAt?: Date;
}

/** ---------------- Success Response DTO for Notification ---------------- */
export class SuccessNotificationResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: [ResponseNotificationVm], description: 'List of banks' })
    data: ResponseNotificationVm[] = [];
}


export class SuccessNotificationObjectResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: ResponseNotificationVm, description: 'Notification object' })
    data: ResponseNotificationVm;
}


export class SuccessNotificationPaginatedResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiProperty({ type: PaginationInfo })
    pagination: PaginationInfo;
    @ApiProperty({ type: [ResponseNotificationVm] })
    data: ResponseNotificationVm[];
}