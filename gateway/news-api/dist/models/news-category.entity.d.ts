import { BaseEntity } from './base/base';
import { News } from './news.entity';
export declare class NewsCategory extends BaseEntity {
    oid: string;
    categoryName?: string;
    newss: News[];
}
