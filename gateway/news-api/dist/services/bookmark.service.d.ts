import { BookmarkRepository } from '../repositories/bookmark.repository';
import { CreateBookmarkDto, FilterBookmarkDto, UpdateBookmarkDto } from '../dtos/payload-bookmark-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { BookmarkMapping, BookmarkVm } from '../mappings/bookmark-vm';
export declare class BookmarkService {
    private readonly bookmarkRepository;
    private readonly bookmarkMapping;
    private readonly dataSource;
    constructor(bookmarkRepository: BookmarkRepository, bookmarkMapping: BookmarkMapping, dataSource: DataSource);
    create(bookmarkdto: CreateBookmarkDto, userOid: string): Promise<MessageVm>;
    update(oid: string, bookmarkdto: UpdateBookmarkDto, userOid: string): Promise<MessageVm>;
    deleted(oid: string, userOid: string): Promise<MessageVm>;
    findAll(): Promise<BookmarkVm[]>;
    findPage(page: number, pageSize: number, condition: FilterBookmarkDto): Promise<{
        bookmarks: BookmarkVm[];
        count: number;
    }>;
    findById(oid: string): Promise<BookmarkVm>;
}
