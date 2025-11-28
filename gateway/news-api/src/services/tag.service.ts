import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { TagRepository } from '../repositories/tag.repository';
import { Tag } from '../models/tag.entity';
import { CreateTagDto, FilterTagDto, UpdateTagDto } from '../dtos/payload-tag-dto';
import { DataSource, getConnection } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { TagMapping, TagVm } from '../mappings/tag-vm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TagService {
  constructor(private readonly tagRepository: TagRepository, private readonly tagMapping: TagMapping, 
    private readonly dataSource: DataSource,
  ) { } 

  async create(tagdto: CreateTagDto, slugOid: string): Promise<MessageVm> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const tag = new Tag();
      tag.name = tagdto.name;
      tag.slug = tagdto.slug;
      tag.createdBy = slugOid;
      tag.createdAt = new Date();
      const savedTag = await this.tagRepository.save(tag, queryRunner);
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = savedTag.oid;
      messageVm.name = savedTag.slug ?? '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error saving tag: ' + error.message);
    } finally {
      await queryRunner.release();
    }

  }

  async update(oid: string, tagdto: UpdateTagDto, slugOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const tag = await this.tagRepository.findById(oid)
      if (!tag) {
        throw new NotFoundException('Tag data not found');
      }

      tag.name = tagdto.name;
      tag.slug = tagdto.slug;
      const savedTag = await this.tagRepository.update(oid, tag, queryRunner);
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = savedTag.oid;
      messageVm.name = savedTag.slug ?? '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error update tag: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string, slugOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const tag = await this.tagRepository.findById(oid)
      if (!tag) {
        throw new NotFoundException('Tag data not found');
      }
      this.tagRepository.delete(oid, queryRunner)
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = tag.oid;
      messageVm.name = tag.slug ?? '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error Delete tag: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }


  async findAll(): Promise<TagVm[]> {
    try {
      const tags = await this.tagRepository.findAll();
      return this.tagMapping.toTagResponses(tags);
    } catch (error) {
      throw new InternalServerErrorException('Error Find tag: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterTagDto):
    Promise<{ tags: TagVm[]; count: number }> {

    try { 
      const { tags, count } = await this.tagRepository.findByCriteriaPage(page, pageSize, condition); 
      const tagResponses = this.tagMapping.toTagResponses(tags); 
      return { tags: tagResponses, count };

    } catch (error) {
      throw new InternalServerErrorException('Error Find tag: ' + error.message);
    }
  }

  async findById(oid: string): Promise<TagVm> {
    try {
      const tag = await this.tagRepository.findById(oid);
      return this.tagMapping.toTagResponse(tag);
    } catch (error) {
      throw new InternalServerErrorException('Error Find tag: ' + error.message);
    }
  }

}
