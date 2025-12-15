import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

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
