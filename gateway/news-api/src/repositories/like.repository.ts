import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, QueryRunner, Repository } from 'typeorm';
import { Like } from '../models/like.entity';
import { CreateLikeDto, FilterLikeDto, UpdateLikeDto } from '../dtos/payload-like-dto';

@Injectable()
export class LikeRepository {
    constructor(
        @InjectRepository(Like)
        private readonly likeRepository: Repository<Like>,
    ) { }

    async save(like: Like, queryRunner: QueryRunner): Promise<Like> {
        try {
            const savedLike = await queryRunner.manager.save(Like, like);
            return savedLike;
        } catch (error) {
            throw new InternalServerErrorException('Error saving like: ' + error.message);
        }
    }

    async update(oid: string, like: Like, queryRunner: QueryRunner): Promise<Like> {
        try {
            await this.likeRepository.update(oid, like)
            return like;
        } catch (error) {
            throw new InternalServerErrorException('Error update like: ' + error.message);
        }
    }

    async delete(oid: string, queryRunner: QueryRunner): Promise<void> {

        try {
            await this.likeRepository.softDelete({ oid })
        } catch (error) {
            throw new InternalServerErrorException('Error saving like: ' + error.message);
        }
    }

    async findAll(): Promise<Like[]> {
        return this.likeRepository.find();
    }


    async findByCriteriaPage(
        page: number,
        pageSize: number,
        condition: FilterLikeDto,
    ): Promise<{ likes: Like[]; count: number }> {
        // Initialize the query builder
        const queryBuilder = this.likeRepository.createQueryBuilder('like');

        // Apply filters based on the condition
        // if (condition.likeCode) {
        //     queryBuilder.andWhere('like.likeCode LIKE :likeCode', {
        //         likeCode: `%${condition.likeCode}%`,
        //     });
        // }
        // if (condition.likeName) {
        //     queryBuilder.orWhere('like.likeName LIKE :likeName', {
        //         likeName: `%${condition.likeName}%`,
        //     });
        // }

        // Apply pagination
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);

        // Execute the query and return results
        try {
            const [likes, count] = await queryBuilder.getManyAndCount();
            return { likes, count };
        } catch (error) {
            throw new NotFoundException('Error fetching likes: ' + error.message);
        }
    }

    async findCountByCriteria(
        condition: FilterLikeDto,
    ): Promise<number> {
        // Initialize the query builder
        const queryBuilder = this.likeRepository.createQueryBuilder('like');

        // Apply filters based on the condition
        // if (condition.likeCode) {
        //     queryBuilder.andWhere('like.likeCode LIKE :likeCode', {
        //         likeCode: `%${condition.likeCode}%`,
        //     });
        // }
        // if (condition.likeName) {
        //     queryBuilder.orWhere('like.likeName LIKE :likeName', {
        //         likeName: `%${condition.likeName}%`,
        //     });
        // }

        // Count total records matching the condition
        try {
            const count = await queryBuilder.getCount();
            return count;
        } catch (error) {
            throw new Error('Error fetching like count: ' + error.message);
        }
    }

    async advanceFilter(
        condition: FilterLikeDto,
    ): Promise<Like[]> {
        // Initialize the query builder
        const queryBuilder = this.likeRepository.createQueryBuilder('like');

        // Apply filters based on the condition
        // if (condition.likeCode) {
        //     queryBuilder.andWhere('like.likeCode LIKE :likeCode', {
        //         likeCode: `%${condition.likeCode}%`,
        //     });
        // }
        // if (condition.likeName) {
        //     queryBuilder.orWhere('like.likeName LIKE :likeName', {
        //         likeName: `%${condition.likeName}%`,
        //     });
        // }

        // Execute the query to retrieve the matching records
        try {
            const likes = await queryBuilder.getMany();
            return likes;
        } catch (error) {
            throw new Error('Error fetching likes: ' + error.message);
        }
    }

    async findById(oid: string): Promise<Like> {
        try {
            // Try to find the like by the given OID
            const like = await this.likeRepository.findOne({ where: { oid } });

            // If no like is found, throw a NotFoundException
            if (!like) {
                throw new NotFoundException(`Like with OID ${oid} not found`);
            }

            return like;
        } catch (error) {
            // You can throw any custom error here or handle the error differently
            throw new Error('Error fetching like: ' + error.message);
        }
    }


}
