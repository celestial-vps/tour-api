import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, QueryRunner, Repository } from 'typeorm';
import { Comment } from '../models/comment.entity';
import { CreateCommentDto, FilterCommentDto, UpdateCommentDto } from '../dtos/payload-comment.dto';

@Injectable()
export class CommentRepository {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    ) { }

    async save(comment: Comment, queryRunner: QueryRunner): Promise<Comment> {
        try {
            const savedComment = await queryRunner.manager.save(Comment, comment);
            return savedComment;
        } catch (error) {
            throw new InternalServerErrorException('Error saving comment: ' + error.message);
        }
    }

    async update(oid: string, comment: Comment, queryRunner: QueryRunner): Promise<Comment> {
        try {
            await this.commentRepository.update(oid, comment)
            return comment;
        } catch (error) {
            throw new InternalServerErrorException('Error update comment: ' + error.message);
        }
    }

    async delete(oid: string, queryRunner: QueryRunner): Promise<void> {

        try {
            await this.commentRepository.softDelete({ oid })
        } catch (error) {
            throw new InternalServerErrorException('Error saving comment: ' + error.message);
        }
    }

    async findAll(): Promise<Comment[]> {
        return this.commentRepository.find();
    }


    async findByCriteriaPage(
        page: number,
        pageSize: number,
        condition: FilterCommentDto,
    ): Promise<{ comments: Comment[]; count: number }> {
        // Initialize the query builder
        const queryBuilder = this.commentRepository.createQueryBuilder('comment');

        // Apply filters based on the condition
        // if (condition.commentCode) {
        //     queryBuilder.andWhere('comment.commentCode LIKE :commentCode', {
        //         commentCode: `%${condition.commentCode}%`,
        //     });
        // }
        // if (condition.commentName) {
        //     queryBuilder.orWhere('comment.commentName LIKE :commentName', {
        //         commentName: `%${condition.commentName}%`,
        //     });
        // }

        // Apply pagination
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);

        // Execute the query and return results
        try {
            const [comments, count] = await queryBuilder.getManyAndCount();
            return { comments, count };
        } catch (error) {
            throw new NotFoundException('Error fetching comments: ' + error.message);
        }
    }

    async findCountByCriteria(
        condition: FilterCommentDto,
    ): Promise<number> {
        // Initialize the query builder
        const queryBuilder = this.commentRepository.createQueryBuilder('comment');

        // Apply filters based on the condition
        // if (condition.commentCode) {
        //     queryBuilder.andWhere('comment.commentCode LIKE :commentCode', {
        //         commentCode: `%${condition.commentCode}%`,
        //     });
        // }
        // if (condition.commentName) {
        //     queryBuilder.orWhere('comment.commentName LIKE :commentName', {
        //         commentName: `%${condition.commentName}%`,
        //     });
        // }

        // Count total records matching the condition
        try {
            const count = await queryBuilder.getCount();
            return count;
        } catch (error) {
            throw new Error('Error fetching comment count: ' + error.message);
        }
    }

    async advanceFilter(
        condition: FilterCommentDto,
    ): Promise<Comment[]> {
        // Initialize the query builder
        const queryBuilder = this.commentRepository.createQueryBuilder('comment');

        // Apply filters based on the condition
        // if (condition.commentCode) {
        //     queryBuilder.andWhere('comment.commentCode LIKE :commentCode', {
        //         commentCode: `%${condition.commentCode}%`,
        //     });
        // }
        // if (condition.commentName) {
        //     queryBuilder.orWhere('comment.commentName LIKE :commentName', {
        //         commentName: `%${condition.commentName}%`,
        //     });
        // }

        // Execute the query to retrieve the matching records
        try {
            const comments = await queryBuilder.getMany();
            return comments;
        } catch (error) {
            throw new Error('Error fetching comments: ' + error.message);
        }
    }

    async findById(oid: string): Promise<Comment> {
        try {
            // Try to find the comment by the given OID
            const comment = await this.commentRepository.findOne({ where: { oid } });

            // If no comment is found, throw a NotFoundException
            if (!comment) {
                throw new NotFoundException(`Comment with OID ${oid} not found`);
            }

            return comment;
        } catch (error) {
            // You can throw any custom error here or handle the error differently
            throw new Error('Error fetching comment: ' + error.message);
        }
    }


}
