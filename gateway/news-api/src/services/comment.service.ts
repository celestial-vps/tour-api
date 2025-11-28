import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '../repositories/comment.repository';
import { Comment } from '../models/comment.entity';
import { CreateCommentDto, FilterCommentDto, UpdateCommentDto } from '../dtos/payload-comment-dto';
import { DataSource, getConnection } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { CommentMapping, CommentVm } from '../mappings/comment-vm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommentService {
  constructor(private readonly commentRepository: CommentRepository, private readonly commentMapping: CommentMapping, 
    private readonly dataSource: DataSource,
  ) { } 

  async create(commentdto: CreateCommentDto, userOid: string): Promise<MessageVm> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const comment = new Comment();
      comment.article = commentdto.article;
      comment.user = commentdto.user;
      comment.createdBy = userOid;
      comment.createdAt = new Date();
      const savedComment = await this.commentRepository.save(comment, queryRunner);
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = savedComment.oid;
      messageVm.name = savedComment.user ?? '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error saving comment: ' + error.message);
    } finally {
      await queryRunner.release();
    }

  }

  async update(oid: string, commentdto: UpdateCommentDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const comment = await this.commentRepository.findById(oid)
      if (!comment) {
        throw new NotFoundException('Comment data not found');
      }

      comment.article = commentdto.article;
      comment.user = commentdto.user;
      const savedComment = await this.commentRepository.update(oid, comment, queryRunner);
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = savedComment.oid;
      messageVm.name = savedComment.user ?? '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error update comment: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const comment = await this.commentRepository.findById(oid)
      if (!comment) {
        throw new NotFoundException('Comment data not found');
      }
      this.commentRepository.delete(oid, queryRunner)
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = comment.oid;
      messageVm.name = comment.user ?? '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error Delete comment: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }


  async findAll(): Promise<CommentVm[]> {
    try {
      const comments = await this.commentRepository.findAll();
      return this.commentMapping.toCommentResponses(comments);
    } catch (error) {
      throw new InternalServerErrorException('Error Find comment: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterCommentDto):
    Promise<{ comments: CommentVm[]; count: number }> {

    try { 
      const { comments, count } = await this.commentRepository.findByCriteriaPage(page, pageSize, condition); 
      const commentResponses = this.commentMapping.toCommentResponses(comments); 
      return { comments: commentResponses, count };

    } catch (error) {
      throw new InternalServerErrorException('Error Find comment: ' + error.message);
    }
  }

  async findById(oid: string): Promise<CommentVm> {
    try {
      const comment = await this.commentRepository.findById(oid);
      return this.commentMapping.toCommentResponse(comment);
    } catch (error) {
      throw new InternalServerErrorException('Error Find comment: ' + error.message);
    }
  }

}
