import { QueryRunner, Repository } from 'typeorm';
import { Article } from '../models/article.entity';
import { FilterArticleDto } from '../dtos/payload-article-dto';
export declare class ArticleRepository {
    private readonly articleRepository;
    constructor(articleRepository: Repository<Article>);
    save(article: Article, queryRunner: QueryRunner): Promise<Article>;
    update(oid: string, article: Article, queryRunner: QueryRunner): Promise<Article>;
    delete(oid: string, queryRunner: QueryRunner): Promise<void>;
    findAll(): Promise<Article[]>;
    findByCriteriaPage(page: number, pageSize: number, condition: FilterArticleDto): Promise<{
        articles: Article[];
        count: number;
    }>;
    findCountByCriteria(condition: FilterArticleDto): Promise<number>;
    advanceFilter(condition: FilterArticleDto): Promise<Article[]>;
    findById(oid: string): Promise<Article>;
}
