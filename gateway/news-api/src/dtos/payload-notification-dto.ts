import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsUUID, IsBoolean } from 'class-validator';

export class FilterNotificationDto {
    @IsOptional()
    @IsUUID()
    userId?: string;

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
