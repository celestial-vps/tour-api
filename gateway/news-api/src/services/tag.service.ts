import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { TagRepository } from '../repositories/tag.repository';
import { Tag } from '../models/tag.entity';
import { CreateTagDto, FilterTagDto, UpdateTagDto } from '../dtos/payload-tag-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { TagMapping, TagVm } from '../mappings/tag-vm';

@Injectable()
export class TagService {
  constructor(
    private readonly tagRepository: TagRepository,
    private readonly tagMapping: TagMapping,
    private readonly dataSource: DataSource,
  ) {}

  async create(tagdto: CreateTagDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const tag = new Tag(); 
      tag.name = tagdto.name; 
      tag.createdBy = userOid;
      tag.createdAt = new Date();

      const savedTag = await this.tagRepository.save(tag, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedTag.oid, name: savedTag.name ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error saving tag: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(oid: string, tagdto: UpdateTagDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const tag = await this.tagRepository.findById(oid);
      if (!tag) throw new NotFoundException('Tag data not found');
 
      tag.name = tagdto.name; 
      tag.lastModifiedBy = userOid;
      tag.updatedAt = new Date();

      const savedTag = await this.tagRepository.update(oid, tag, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedTag.oid, name: savedTag.name ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error updating tag: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const tag = await this.tagRepository.findById(oid);
      if (!tag) throw new NotFoundException('Tag data not found');

      await this.tagRepository.delete(oid, queryRunner); // <--- tambahkan await
      await queryRunner.commitTransaction();

      return { value: tag.oid, name: tag.name ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error deleting tag: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<TagVm[]> {
    try {
      const tags = await this.tagRepository.findAll();
      return this.tagMapping.toTagResponses(tags);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching tags: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterTagDto): Promise<{ tags: TagVm[]; count: number }> {
    try {
      const { tags, count } = await this.tagRepository.findByCriteriaPage(page, pageSize, condition);
      return { tags: this.tagMapping.toTagResponses(tags), count };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching paginated tags: ' + error.message);
    }
  }

  async findById(oid: string): Promise<TagVm> {
    try {
      const tag = await this.tagRepository.findById(oid);
      if (!tag) throw new NotFoundException('Tag not found');
      return this.tagMapping.toTagResponse(tag);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching tag: ' + error.message);
    }
  }
}
