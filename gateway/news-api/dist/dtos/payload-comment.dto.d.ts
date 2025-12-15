export declare class FilterCommentDto {
    articleId?: string;
    userId?: string;
    status?: 'pending' | 'approved' | 'rejected';
}
export declare class CreateCommentDto {
    articleId: string;
    userId: string;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
}
export declare class UpdateCommentDto {
    articleId: string;
    content: string;
    status: 'pending' | 'approved' | 'rejected';
}
