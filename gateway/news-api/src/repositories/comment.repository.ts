import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  Like,
  QueryRunner,
  Repository,
} from 'typeorm';
import { Comment } from '../models/comment.entity';
import { FilterCommentDto } from '../dtos/payload-comment-dto';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly repo: Repository<Comment>,
  ) {}

  /* =======================
   * WRITE (TRANSACTIONAL)
   * ======================= */

  async save(comment: Comment, queryRunner: QueryRunner): Promise<Comment> {
    try {
      return await queryRunner.manager.save(Comment, comment);
    } catch (error) {
      throw new InternalServerErrorException(
        'Error saving comment: ' + error.message,
      );
    }
  }

  async update(
    oid: string,
    comment: Partial<Comment>,
    queryRunner: QueryRunner,
  ): Promise<Comment> {
    try {
      const result = await queryRunner.manager.update(
        Comment,
        { oid },
        comment,
      );

      if (result.affected === 0) {
        throw new NotFoundException(`Comment with OID ${oid} not found`);
      }

      return await queryRunner.manager.findOneOrFail(Comment, {
        where: { oid },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error updating comment: ' + error.message,
      );
    }
  }

  async delete(oid: string, queryRunner: QueryRunner): Promise<void> {
    try {
      const result = await queryRunner.manager.softDelete(
        Comment,
        { oid },
      );

      if (result.affected === 0) {
        throw new NotFoundException(`Comment with OID ${oid} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error deleting comment: ' + error.message,
      );
    }
  }

  /* =======================
   * READ (NON TRANSACTION)
   * ======================= */

  async findAll(): Promise<Comment[]> {
    return this.repo.find();
  }

  async findById(oid: string): Promise<Comment> {
    const comment = await this.repo.findOne({
      where: { oid },
      // relations: { branches: true },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with OID ${oid} not found`);
    }

    return comment;
  }

  async findByCriteriaPage(
    page: number,
    pageSize: number,
    condition: FilterCommentDto,
  ): Promise<{ comments: Comment[]; count: number }> {
    const where = this.buildFilter(condition);

    const [comments, count] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { oid: 'ASC' },
    });

    return { comments, count };
  }

  async findCountByCriteria(
    condition: FilterCommentDto,
  ): Promise<number> {
    const where = this.buildFilter(condition);
    return this.repo.count({ where });
  }

  async advanceFilter(
    condition: FilterCommentDto,
  ): Promise<Comment[]> {
    const where = this.buildFilter(condition);

    return this.repo.find({
      where,
      order: { oid: 'ASC' },
    });
  }

  /* =======================
   * PRIVATE HELPER
   * ======================= */

  private buildFilter(
    condition: FilterCommentDto,
  ): FindOptionsWhere<Comment> {
    const where: FindOptionsWhere<Comment> = {};
 

    // if (condition.title) {
    //   where.title = Like(`%${condition.title}%`);
    // }

    return where;
  }
}
