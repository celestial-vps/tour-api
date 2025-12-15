import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

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
