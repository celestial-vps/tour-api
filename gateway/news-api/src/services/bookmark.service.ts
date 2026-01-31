import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BookmarkRepository } from '../repositories/bookmark.repository';
import { Bookmark } from '../models/bookmark.entity';
import { CreateBookmarkDto, FilterBookmarkDto, UpdateBookmarkDto } from '../dtos/payload-bookmark-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { BookmarkMapping, BookmarkVm } from '../mappings/bookmark-vm';

@Injectable()
export class BookmarkService {
  constructor(
    private readonly bookmarkRepository: BookmarkRepository,
    private readonly bookmarkMapping: BookmarkMapping,
    private readonly dataSource: DataSource,
  ) {}

  async create(bookmarkdto: CreateBookmarkDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const bookmark = new Bookmark();
      // bookmark.user = bookmarkdto.user;
      // bookmark.article = bookmarkdto.article; 
      bookmark.createdBy = userOid;
      bookmark.createdAt = new Date();

      const savedBookmark = await this.bookmarkRepository.save(bookmark, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedBookmark.oid, name: savedBookmark.oid ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error saving bookmark: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(oid: string, bookmarkdto: UpdateBookmarkDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const bookmark = await this.bookmarkRepository.findById(oid);
      if (!bookmark) throw new NotFoundException('Bookmark data not found');

      // bookmark.user = bookmarkdto.user;
      // bookmark.article = bookmarkdto.article; 
      bookmark.lastModifiedBy = userOid;
      bookmark.updatedAt = new Date();

      const savedBookmark = await this.bookmarkRepository.update(oid, bookmark, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedBookmark.oid, name: savedBookmark.oid ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error updating bookmark: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const bookmark = await this.bookmarkRepository.findById(oid);
      if (!bookmark) throw new NotFoundException('Bookmark data not found');

      await this.bookmarkRepository.delete(oid, queryRunner); // <--- tambahkan await
      await queryRunner.commitTransaction();

      return { value: bookmark.oid, name: bookmark.oid ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error deleting bookmark: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<BookmarkVm[]> {
    try {
      const bookmarks = await this.bookmarkRepository.findAll();
      return this.bookmarkMapping.toBookmarkResponses(bookmarks);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching bookmarks: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterBookmarkDto): Promise<{ bookmarks: BookmarkVm[]; count: number }> {
    try {
      const { bookmarks, count } = await this.bookmarkRepository.findByCriteriaPage(page, pageSize, condition);
      return { bookmarks: this.bookmarkMapping.toBookmarkResponses(bookmarks), count };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching paginated bookmarks: ' + error.message);
    }
  }

  async findById(oid: string): Promise<BookmarkVm> {
    try {
      const bookmark = await this.bookmarkRepository.findById(oid);
      if (!bookmark) throw new NotFoundException('Bookmark not found');
      return this.bookmarkMapping.toBookmarkResponse(bookmark);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching bookmark: ' + error.message);
    }
  }
}
