import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, IsEnum, IsUUID } from 'class-validator';

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
