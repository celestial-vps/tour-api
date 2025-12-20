import { QueryRunner, Repository } from 'typeorm';
import { Bookmark } from '../models/bookmark.entity';
import { FilterBookmarkDto } from '../dtos/payload-bookmark-dto';
export declare class BookmarkRepository {
    private readonly repo;
    constructor(repo: Repository<Bookmark>);
    save(bookmark: Bookmark, queryRunner: QueryRunner): Promise<Bookmark>;
    update(oid: string, bookmark: Partial<Bookmark>, queryRunner: QueryRunner): Promise<Bookmark>;
    delete(oid: string, queryRunner: QueryRunner): Promise<void>;
    findAll(): Promise<Bookmark[]>;
    findById(oid: string): Promise<Bookmark>;
    findByCriteriaPage(page: number, pageSize: number, condition: FilterBookmarkDto): Promise<{
        bookmarks: Bookmark[];
        count: number;
    }>;
    findCountByCriteria(condition: FilterBookmarkDto): Promise<number>;
    advanceFilter(condition: FilterBookmarkDto): Promise<Bookmark[]>;
    private buildFilter;
}
