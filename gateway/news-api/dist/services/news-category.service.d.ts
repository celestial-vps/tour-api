import { NewsCategoryRepository } from '../repositories/news-category.repository';
import { CreateNewsCategoryDto, FilterNewsCategoryDto, UpdateNewsCategoryDto } from '../dtos/payload-news-category-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { NewsCategoryMapping, NewsCategoryVm } from '../mappings/news-category-vm';
export declare class NewsCategoryService {
    private readonly newsCategoryRepository;
    private readonly newsCategoryMapping;
    private readonly dataSource;
    constructor(newsCategoryRepository: NewsCategoryRepository, newsCategoryMapping: NewsCategoryMapping, dataSource: DataSource);
    create(newsCategorydto: CreateNewsCategoryDto, userOid: string): Promise<MessageVm>;
    update(oid: string, newsCategorydto: UpdateNewsCategoryDto, userOid: string): Promise<MessageVm>;
    deleted(oid: string, userOid: string): Promise<MessageVm>;
    findAll(): Promise<NewsCategoryVm[]>;
    findPage(page: number, pageSize: number, condition: FilterNewsCategoryDto): Promise<{
        newsCategories: NewsCategoryVm[];
        count: number;
    }>;
    findById(oid: string): Promise<NewsCategoryVm>;
}
