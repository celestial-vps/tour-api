import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CommentRepository } from '../repositories/comment.repository';
import { Comment } from '../models/comment.entity';
import { CreateCommentDto, FilterCommentDto, UpdateCommentDto } from '../dtos/payload-comment-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { CommentMapping, CommentVm } from '../mappings/comment-vm';

@Injectable()
export class CommentService {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly commentMapping: CommentMapping,
    private readonly dataSource: DataSource,
  ) {}

  async create(commentdto: CreateCommentDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const comment = new Comment();
      // comment.article = commentdto.article;
      // comment.user = commentdto.user;
      comment.content = commentdto.content;
      comment.createdBy = userOid;
      comment.createdAt = new Date();

      const savedComment = await this.commentRepository.save(comment, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedComment.oid, name: savedComment.content ?? '' } as MessageVm;
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
      const comment = await this.commentRepository.findById(oid);
      if (!comment) throw new NotFoundException('Comment data not found');

      // comment.article = commentdto.article;
      // comment.user = commentdto.user;
      comment.content = commentdto.content;
      comment.lastModifiedBy = userOid;
      comment.updatedAt = new Date();

      const savedComment = await this.commentRepository.update(oid, comment, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedComment.oid, name: savedComment.content ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error updating comment: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const comment = await this.commentRepository.findById(oid);
      if (!comment) throw new NotFoundException('Comment data not found');

      await this.commentRepository.delete(oid, queryRunner); // <--- tambahkan await
      await queryRunner.commitTransaction();

      return { value: comment.oid, name: comment.content ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error deleting comment: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<CommentVm[]> {
    try {
      const comments = await this.commentRepository.findAll();
      return this.commentMapping.toCommentResponses(comments);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching comments: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterCommentDto): Promise<{ comments: CommentVm[]; count: number }> {
    try {
      const { comments, count } = await this.commentRepository.findByCriteriaPage(page, pageSize, condition);
      return { comments: this.commentMapping.toCommentResponses(comments), count };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching paginated comments: ' + error.message);
    }
  }

  async findById(oid: string): Promise<CommentVm> {
    try {
      const comment = await this.commentRepository.findById(oid);
      if (!comment) throw new NotFoundException('Comment not found');
      return this.commentMapping.toCommentResponse(comment);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching comment: ' + error.message);
    }
  }
}
