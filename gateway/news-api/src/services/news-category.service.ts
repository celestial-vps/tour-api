import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { NewsCategoryRepository } from '../repositories/news-category.repository';
import { NewsCategory } from '../models/news-category.entity';
import { CreateNewsCategoryDto, FilterNewsCategoryDto, UpdateNewsCategoryDto } from '../dtos/payload-news-category-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { NewsCategoryMapping, NewsCategoryVm } from '../mappings/news-category-vm';

@Injectable()
export class NewsCategoryService {
  constructor(
    private readonly newsCategoryRepository: NewsCategoryRepository,
    private readonly newsCategoryMapping: NewsCategoryMapping,
    private readonly dataSource: DataSource,
  ) {}

  async create(newsCategorydto: CreateNewsCategoryDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const newsCategory = new NewsCategory(); 
      newsCategory.categoryName = newsCategorydto.categoryName; 
      newsCategory.createdBy = userOid;
      newsCategory.createdAt = new Date();

      const savedNewsCategory = await this.newsCategoryRepository.save(newsCategory, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedNewsCategory.oid, name: savedNewsCategory.categoryName ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error saving newsCategory: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(oid: string, newsCategorydto: UpdateNewsCategoryDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const newsCategory = await this.newsCategoryRepository.findById(oid);
      if (!newsCategory) throw new NotFoundException('NewsCategory data not found');
 
      newsCategory.categoryName = newsCategorydto.categoryName; 
      newsCategory.lastModifiedBy = userOid;
      newsCategory.updatedAt = new Date();

      const savedNewsCategory = await this.newsCategoryRepository.update(oid, newsCategory, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedNewsCategory.oid, name: savedNewsCategory.categoryName ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error updating newsCategory: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const newsCategory = await this.newsCategoryRepository.findById(oid);
      if (!newsCategory) throw new NotFoundException('NewsCategory data not found');

      await this.newsCategoryRepository.delete(oid, queryRunner); // <--- tambahkan await
      await queryRunner.commitTransaction();

      return { value: newsCategory.oid, name: newsCategory.categoryName ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error deleting newsCategory: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<NewsCategoryVm[]> {
    try {
      const newsCategories = await this.newsCategoryRepository.findAll();
      return this.newsCategoryMapping.toNewsCategoryResponses(newsCategories);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching newsCategories: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterNewsCategoryDto): Promise<{ newsCategories: NewsCategoryVm[]; count: number }> {
    try {
      const { newsCategories, count } = await this.newsCategoryRepository.findByCriteriaPage(page, pageSize, condition);
      return { newsCategories: this.newsCategoryMapping.toNewsCategoryResponses(newsCategories), count };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching paginated newsCategories: ' + error.message);
    }
  }

  async findById(oid: string): Promise<NewsCategoryVm> {
    try {
      const newsCategory = await this.newsCategoryRepository.findById(oid);
      if (!newsCategory) throw new NotFoundException('NewsCategory not found');
      return this.newsCategoryMapping.toNewsCategoryResponse(newsCategory);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching newsCategory: ' + error.message);
    }
  }
}
