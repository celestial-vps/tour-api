import { ArticleRepository } from '../repositories/article.repository';
import { CreateArticleDto, FilterArticleDto, UpdateArticleDto } from '../dtos/payload-article-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { ArticleMapping, ArticleVm } from '../mappings/article-vm';
export declare class ArticleService {
    private readonly articleRepository;
    private readonly articleMapping;
    private readonly dataSource;
    constructor(articleRepository: ArticleRepository, articleMapping: ArticleMapping, dataSource: DataSource);
    create(articledto: CreateArticleDto, userOid: string): Promise<MessageVm>;
    update(oid: string, articledto: UpdateArticleDto, userOid: string): Promise<MessageVm>;
    deleted(oid: string, userOid: string): Promise<MessageVm>;
    findAll(): Promise<ArticleVm[]>;
    findPage(page: number, pageSize: number, condition: FilterArticleDto): Promise<{
        articles: ArticleVm[];
        count: number;
    }>;
    findById(oid: string): Promise<ArticleVm>;
}
