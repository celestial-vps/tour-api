import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

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
