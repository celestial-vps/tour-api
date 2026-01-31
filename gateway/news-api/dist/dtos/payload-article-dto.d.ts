import { PaginationInfo } from './base/pagination-info-dto';
export declare class FilterArticleDto {
    title?: string;
    content?: string;
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
export declare class ResponseArticleVm {
    oid: string;
    title: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class SuccessArticleResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: ResponseArticleVm[];
}
export declare class SuccessArticleObjectResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    total: number;
    data: ResponseArticleVm;
}
export declare class SuccessArticlePaginatedResponseDto {
    resultCode: string;
    httpStatus: number;
    message: string;
    pagination: PaginationInfo;
    data: ResponseArticleVm[];
}
