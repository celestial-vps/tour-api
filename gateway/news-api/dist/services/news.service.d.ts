import { NewsRepository } from '../repositories/news.repository';
import { CreateNewsDto, FilterNewsDto, UpdateNewsDto } from '../dtos/payload-news-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { NewsMapping, NewsVm } from '../mappings/news-vm';
export declare class NewsService {
    private readonly newsRepository;
    private readonly newsMapping;
    private readonly dataSource;
    constructor(newsRepository: NewsRepository, newsMapping: NewsMapping, dataSource: DataSource);
    create(newsdto: CreateNewsDto, userOid: string): Promise<MessageVm>;
    update(oid: string, newsdto: UpdateNewsDto, userOid: string): Promise<MessageVm>;
    deleted(oid: string, userOid: string): Promise<MessageVm>;
    findAll(): Promise<NewsVm[]>;
    findPage(page: number, pageSize: number, condition: FilterNewsDto): Promise<{
        newss: NewsVm[];
        count: number;
    }>;
    findById(oid: string): Promise<NewsVm>;
}
