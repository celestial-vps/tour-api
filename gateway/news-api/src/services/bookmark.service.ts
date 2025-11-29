import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BookmarkRepository } from '../repositories/bookmark.repository';
import { Bookmark } from '../models/bookmark.entity';
import { CreateBookmarkDto, FilterBookmarkDto, UpdateBookmarkDto } from '../dtos/payload-bookmark-dto';
import { DataSource, getConnection } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { ConfigService } from '@nestjs/config';
import { BookmarkMapping, BookmarkVm } from '../mappings/bookmark-vm';
import { Article } from '../models/article.entity';

@Injectable()
export class BookmarkService {
  constructor(private readonly bookmarkRepository: BookmarkRepository, private readonly bookmarkMapping: BookmarkMapping,
    private readonly dataSource: DataSource,
  ) { }

  async create(bookmarkdto: CreateBookmarkDto, userOid: string): Promise<MessageVm> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const bookmark = new Bookmark();
      bookmark.article = { oid: bookmarkdto.articleId } as Article; //find dulu atau bisa langsung diisi dengan bookmarkdto.articleId jika tipe data sesuai 
      bookmark.createdBy = userOid;
      bookmark.createdAt = new Date();
      const savedBookmark = await this.bookmarkRepository.save(bookmark, queryRunner);
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = savedBookmark.oid;
      messageVm.name = savedBookmark.article ? savedBookmark.article.oid : '';
      return messageVm;
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
      const bookmark = await this.bookmarkRepository.findById(oid)
      if (!bookmark) {
        throw new NotFoundException('Bookmark data not found');
      }

      bookmark.article = { oid: bookmarkdto.articleId } as Article;
      const savedBookmark = await this.bookmarkRepository.update(oid, bookmark, queryRunner);
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = savedBookmark.oid;
      messageVm.name = savedBookmark.article ? savedBookmark.article.oid : '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error update bookmark: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const bookmark = await this.bookmarkRepository.findById(oid)
      if (!bookmark) {
        throw new NotFoundException('Bookmark data not found');
      }
      this.bookmarkRepository.delete(oid, queryRunner)
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = bookmark.oid;
      messageVm.name = bookmark.article ? bookmark.article.oid : '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error Delete bookmark: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }


  async findAll(): Promise<BookmarkVm[]> {
    try {
      const bookmarks = await this.bookmarkRepository.findAll();
      return this.bookmarkMapping.toBookmarkResponses(bookmarks);
    } catch (error) {
      throw new InternalServerErrorException('Error Find bookmark: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterBookmarkDto):
    Promise<{ bookmarks: BookmarkVm[]; count: number }> {

    try {
      const { bookmarks, count } = await this.bookmarkRepository.findByCriteriaPage(page, pageSize, condition);
      const bookmarkResponses = this.bookmarkMapping.toBookmarkResponses(bookmarks);
      return { bookmarks: bookmarkResponses, count };

    } catch (error) {
      throw new InternalServerErrorException('Error Find bookmark: ' + error.message);
    }
  }

  async findById(oid: string): Promise<BookmarkVm> {
    try {
      const bookmark = await this.bookmarkRepository.findById(oid);
      return this.bookmarkMapping.toBookmarkResponse(bookmark);
    } catch (error) {
      throw new InternalServerErrorException('Error Find bookmark: ' + error.message);
    }
  }

}
