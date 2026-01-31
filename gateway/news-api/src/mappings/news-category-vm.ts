import { Injectable } from '@nestjs/common'; 
import { NewsCategory } from '../models/news-category.entity';

export class NewsCategoryVm {
    oid: string;
    categoryName: string; 
    createdAt: Date;
    updatedAt?: Date;
}

@Injectable()
export class NewsCategoryMapping {

    toNewsCategoryResponse(newsCategory: NewsCategory): NewsCategoryVm {
        return {
            oid: newsCategory.oid,
            categoryName: newsCategory.categoryName ?? '',           
            createdAt: newsCategory.createdAt,
            updatedAt: newsCategory.updatedAt,
        };
    }

    toNewsCategoryResponses(newsCategories: NewsCategory[]): NewsCategoryVm[] {
        return newsCategories.map(newsCategory => this.toNewsCategoryResponse(newsCategory));
    }

}
