import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
 
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { NewsCategory } from '../models/news-category.entity';
import { NewsCategoryRepository } from '../repositories/news-category.repository';
import { NewsCategoryMapping, NewsCategoryVm } from '../mappings/news-category-vm';
import { CreateNewsCategoryDto, FilterNewsCategoryDto, UpdateNewsCategoryDto } from '../dtos/payload-news-category-dto';
 
@Injectable()
export class NewsCategoryService {
  constructor(private readonly newsCategoryRepository: NewsCategoryRepository, private readonly newsCategoryMapping: NewsCategoryMapping, 
    private readonly dataSource: DataSource,
  ) { }
 
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
      const messageVm = new MessageVm();
      messageVm.value = savedNewsCategory.oid;
      messageVm.name = savedNewsCategory.categoryName ?? '';
      return messageVm;
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
      const newsCategory = await this.newsCategoryRepository.findById(oid)
      if (!newsCategory) {
        throw new NotFoundException('NewsCategory data not found');
      }

      newsCategory.categoryName = newsCategorydto.categoryName;
      const savedNewsCategory = await this.newsCategoryRepository.update(oid, newsCategory, queryRunner);
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = savedNewsCategory.oid;
      messageVm.name = savedNewsCategory.categoryName ?? '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error update newsCategory: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string,userOid:string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const newsCategory = await this.newsCategoryRepository.findById(oid)
      if (!newsCategory) {
        throw new NotFoundException('NewsCategory data not found');
      }
      this.newsCategoryRepository.delete(oid, queryRunner)
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = newsCategory.oid;
      messageVm.name = newsCategory.categoryName ?? '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error Delete newsCategory: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<NewsCategoryVm[]> {
    try {
      const newsCategories = await this.newsCategoryRepository.findAll();
      return this.newsCategoryMapping.toNewsCategoryResponses(newsCategories);
    } catch (error) {
      throw new InternalServerErrorException('Error Find newsCategory: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterNewsCategoryDto):
    Promise<{ newsCategories: NewsCategoryVm[]; count: number }> {

    try {
      const { newsCategories, count } = await this.newsCategoryRepository.findByCriteriaPage(page, pageSize, condition);
      const newsCategoryResponses = this.newsCategoryMapping.toNewsCategoryResponses(newsCategories);
      return { newsCategories: newsCategoryResponses, count };
    } catch (error) {
      throw new InternalServerErrorException('Error Find newsCategory: ' + error.message);
    }
  }

  async findById(oid: string): Promise<NewsCategoryVm> {
    try {
      const newsCategory = await this.newsCategoryRepository.findById(oid);
      return this.newsCategoryMapping.toNewsCategoryResponse(newsCategory);
    } catch (error) {
      throw new InternalServerErrorException('Error Find newsCategory: ' + error.message);
    }
  }

}
