import { QueryRunner, Repository } from 'typeorm';
import { NewsCategory } from '../models/news-category.entity';
import { FilterNewsCategoryDto } from '../dtos/payload-news-category-dto';
export declare class NewsCategoryRepository {
    private readonly newsCategoryRepository;
    constructor(newsCategoryRepository: Repository<NewsCategory>);
    save(newsCategory: NewsCategory, queryRunner: QueryRunner): Promise<NewsCategory>;
    update(oid: string, newsCategory: NewsCategory, queryRunner: QueryRunner): Promise<NewsCategory>;
    delete(oid: string, queryRunner: QueryRunner): Promise<void>;
    findAll(): Promise<NewsCategory[]>;
    findByCriteriaPage(page: number, pageSize: number, condition: FilterNewsCategoryDto): Promise<{
        newsCategories: NewsCategory[];
        count: number;
    }>;
    findCountByCriteria(condition: FilterNewsCategoryDto): Promise<number>;
    advanceFilter(condition: FilterNewsCategoryDto): Promise<NewsCategory[]>;
    findById(oid: string): Promise<NewsCategory>;
}
