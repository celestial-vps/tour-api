export declare class FilterArticleDto {
    title?: string;
    authorId?: string;
    categoryId?: string;
    status?: 'draft' | 'published' | 'deleted';
}
export declare class CreateArticleDto {
    title: string;
    slug: string;
    content: string;
    thumbnail?: string;
    authorId: string;
    categoryId: string;
    status: 'draft' | 'published' | 'deleted';
}
export declare class UpdateArticleDto {
    title: string;
    slug: string;
    content: string;
    thumbnail?: string;
    authorId: string;
    categoryId: string;
    status: 'draft' | 'published' | 'deleted';
}
