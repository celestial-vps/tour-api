import { QueryRunner, Repository } from 'typeorm';
import { Tag } from '../models/tag.entity';
import { FilterTagDto } from '../dtos/payload-tag-dto';
export declare class TagRepository {
    private readonly repo;
    constructor(repo: Repository<Tag>);
    save(tag: Tag, queryRunner: QueryRunner): Promise<Tag>;
    update(oid: string, tag: Partial<Tag>, queryRunner: QueryRunner): Promise<Tag>;
    delete(oid: string, queryRunner: QueryRunner): Promise<void>;
    findAll(): Promise<Tag[]>;
    findById(oid: string): Promise<Tag>;
    findByCriteriaPage(page: number, pageSize: number, condition: FilterTagDto): Promise<{
        tags: Tag[];
        count: number;
    }>;
    findCountByCriteria(condition: FilterTagDto): Promise<number>;
    advanceFilter(condition: FilterTagDto): Promise<Tag[]>;
    private buildFilter;
}
