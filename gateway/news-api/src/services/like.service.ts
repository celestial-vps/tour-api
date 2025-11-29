import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { LikeRepository } from '../repositories/like.repository';
import { Like } from '../models/like.entity';
import { CreateLikeDto, FilterLikeDto, UpdateLikeDto } from '../dtos/payload-like-dto';
import { DataSource, getConnection } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { ConfigService } from '@nestjs/config';
import { LikeMapping, LikeVm } from '../mappings/like-vm';
import { Article } from '../models/article.entity';

@Injectable()
export class LikeService {
  constructor(private readonly likeRepository: LikeRepository, private readonly likeMapping: LikeMapping,
    private readonly dataSource: DataSource,
  ) { }

  async create(likedto: CreateLikeDto, userOid: string): Promise<MessageVm> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const like = new Like();
      like.article = { oid: likedto.articleId } as Article;
      // like.user = likedto.user;
      like.createdBy = userOid;
      like.createdAt = new Date();
      const savedLike = await this.likeRepository.save(like, queryRunner);
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = savedLike.oid;
      messageVm.name = savedLike.article ?  savedLike.article.oid : '';
      return messageVm;
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
      const like = await this.likeRepository.findById(oid)
      if (!like) {
        throw new NotFoundException('Like data not found');
      }

      like.article = { oid: likedto.articleId } as Article;
      // like.user = likedto.user;
      const savedLike = await this.likeRepository.update(oid, like, queryRunner);
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = savedLike.oid;
      messageVm.name = savedLike.article ? savedLike.article.oid :  '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error update like: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const like = await this.likeRepository.findById(oid)
      if (!like) {
        throw new NotFoundException('Like data not found');
      }
      this.likeRepository.delete(oid, queryRunner)
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = like.oid;
      messageVm.name = like.article? like.article.oid : '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error Delete like: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }


  async findAll(): Promise<LikeVm[]> {
    try {
      const likes = await this.likeRepository.findAll();
      return this.likeMapping.toLikeResponses(likes);
    } catch (error) {
      throw new InternalServerErrorException('Error Find like: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterLikeDto):
    Promise<{ likes: LikeVm[]; count: number }> {

    try {
      const { likes, count } = await this.likeRepository.findByCriteriaPage(page, pageSize, condition);
      const likeResponses = this.likeMapping.toLikeResponses(likes);
      return { likes: likeResponses, count };

    } catch (error) {
      throw new InternalServerErrorException('Error Find like: ' + error.message);
    }
  }

  async findById(oid: string): Promise<LikeVm> {
    try {
      const like = await this.likeRepository.findById(oid);
      return this.likeMapping.toLikeResponse(like);
    } catch (error) {
      throw new InternalServerErrorException('Error Find like: ' + error.message);
    }
  }

}
