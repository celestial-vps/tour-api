import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

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
