import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { LikeRepository } from '../repositories/like.repository';
import { LikeEntity } from '../models/like.entity';
import { CreateLikeDto, FilterLikeDto, UpdateLikeDto } from '../dtos/payload-like-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { LikeMapping, LikeVm } from '../mappings/like-vm';

@Injectable()
export class LikeService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly likeMapping: LikeMapping,
    private readonly dataSource: DataSource,
  ) {}

  async create(likedto: CreateLikeDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const like = new LikeEntity();
      // like.article = likedto.article;
      // like.user = likedto.user; 
      like.createdBy = userOid;
      like.createdAt = new Date();

      const savedLike = await this.likeRepository.save(like, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedLike.oid, name: savedLike.oid ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error saving like: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(oid: string, likedto: UpdateLikeDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const like = await this.likeRepository.findById(oid);
      if (!like) throw new NotFoundException('Like data not found');

      // like.article = likedto.article;
      // like.user = likedto.user; 
      like.lastModifiedBy = userOid;
      like.updatedAt = new Date();

      const savedLike = await this.likeRepository.update(oid, like, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedLike.oid, name: savedLike.oid ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error updating like: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const like = await this.likeRepository.findById(oid);
      if (!like) throw new NotFoundException('Like data not found');

      await this.likeRepository.delete(oid, queryRunner); // <--- tambahkan await
      await queryRunner.commitTransaction();

      return { value: like.oid, name: like.oid ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error deleting like: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<LikeVm[]> {
    try {
      const likes = await this.likeRepository.findAll();
      return this.likeMapping.toLikeResponses(likes);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching likes: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterLikeDto): Promise<{ likes: LikeVm[]; count: number }> {
    try {
      const { likes, count } = await this.likeRepository.findByCriteriaPage(page, pageSize, condition);
      return { likes: this.likeMapping.toLikeResponses(likes), count };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching paginated likes: ' + error.message);
    }
  }

  async findById(oid: string): Promise<LikeVm> {
    try {
      const like = await this.likeRepository.findById(oid);
      if (!like) throw new NotFoundException('Like not found');
      return this.likeMapping.toLikeResponse(like);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching like: ' + error.message);
    }
  }
}
