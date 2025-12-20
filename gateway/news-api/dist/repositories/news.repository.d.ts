import { QueryRunner, Repository } from 'typeorm';
import { News } from '../models/news.entity';
import { FilterNewsDto } from '../dtos/payload-news-dto';
export declare class NewsRepository {
    private readonly repo;
    constructor(repo: Repository<News>);
    save(news: News, queryRunner: QueryRunner): Promise<News>;
    update(oid: string, news: Partial<News>, queryRunner: QueryRunner): Promise<News>;
    delete(oid: string, queryRunner: QueryRunner): Promise<void>;
    findAll(): Promise<News[]>;
    findById(oid: string): Promise<News>;
    findByCriteriaPage(page: number, pageSize: number, condition: FilterNewsDto): Promise<{
        newss: News[];
        count: number;
    }>;
    findCountByCriteria(condition: FilterNewsDto): Promise<number>;
    advanceFilter(condition: FilterNewsDto): Promise<News[]>;
    private buildFilter;
}
