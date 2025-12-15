export declare class FilterNewsDto {
    title?: string;
    content?: string;
}
export declare class CreateNewsDto {
    title: string;
    content: string;
    summary?: string;
    author?: string;
    imageOid?: string;
    categoryOid: string;
    status?: string;
    publishedAt?: Date;
    tags?: string;
    views?: number;
    language?: string;
}
export declare class UpdateNewsDto {
    title: string;
    content: string;
    summary?: string;
    author?: string;
    imageOid?: string;
    categoryOid: string;
    status?: string;
    publishedAt?: Date;
    tags?: string;
    views?: number;
    language?: string;
}
