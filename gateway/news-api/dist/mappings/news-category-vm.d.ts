import { NewsCategory } from '../models/news-category.entity';
export declare class NewsCategoryVm {
    oid: string;
    categoryName: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class NewsCategoryMapping {
    toNewsCategoryResponse(newsCategory: NewsCategory): NewsCategoryVm;
    toNewsCategoryResponses(newsCategories: NewsCategory[]): NewsCategoryVm[];
}
