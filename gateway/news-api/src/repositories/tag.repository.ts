import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, QueryRunner, Repository } from 'typeorm';
import { Tag } from '../models/tag.entity';
import { CreateTagDto, FilterTagDto, UpdateTagDto } from '../dtos/payload-tag-dto';

@Injectable()
export class TagRepository {
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
    ) { }

    async save(tag: Tag, queryRunner: QueryRunner): Promise<Tag> {
        try {
            const savedTag = await queryRunner.manager.save(Tag, tag);
            return savedTag;
        } catch (error) {
            throw new InternalServerErrorException('Error saving tag: ' + error.message);
        }
    }

    async update(oid: string, tag: Tag, queryRunner: QueryRunner): Promise<Tag> {
        try {
            await this.tagRepository.update(oid, tag)
            return tag;
        } catch (error) {
            throw new InternalServerErrorException('Error update tag: ' + error.message);
        }
    }

    async delete(oid: string, queryRunner: QueryRunner): Promise<void> {

        try {
            await this.tagRepository.softDelete({ oid })
        } catch (error) {
            throw new InternalServerErrorException('Error saving tag: ' + error.message);
        }
    }

    async findAll(): Promise<Tag[]> {
        return this.tagRepository.find();
    }


    async findByCriteriaPage(
        page: number,
        pageSize: number,
        condition: FilterTagDto,
    ): Promise<{ tags: Tag[]; count: number }> {
        // Initialize the query builder
        const queryBuilder = this.tagRepository.createQueryBuilder('tag');

        // Apply filters based on the condition
        // if (condition.tagCode) {
        //     queryBuilder.andWhere('tag.tagCode LIKE :tagCode', {
        //         tagCode: `%${condition.tagCode}%`,
        //     });
        // }
        // if (condition.tagName) {
        //     queryBuilder.orWhere('tag.tagName LIKE :tagName', {
        //         tagName: `%${condition.tagName}%`,
        //     });
        // }

        // Apply pagination
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);

        // Execute the query and return results
        try {
            const [tags, count] = await queryBuilder.getManyAndCount();
            return { tags, count };
        } catch (error) {
            throw new NotFoundException('Error fetching tags: ' + error.message);
        }
    }

    async findCountByCriteria(
        condition: FilterTagDto,
    ): Promise<number> {
        // Initialize the query builder
        const queryBuilder = this.tagRepository.createQueryBuilder('tag');

        // Apply filters based on the condition
        // if (condition.tagCode) {
        //     queryBuilder.andWhere('tag.tagCode LIKE :tagCode', {
        //         tagCode: `%${condition.tagCode}%`,
        //     });
        // }
        // if (condition.tagName) {
        //     queryBuilder.orWhere('tag.tagName LIKE :tagName', {
        //         tagName: `%${condition.tagName}%`,
        //     });
        // }

        // Count total records matching the condition
        try {
            const count = await queryBuilder.getCount();
            return count;
        } catch (error) {
            throw new Error('Error fetching tag count: ' + error.message);
        }
    }

    async advanceFilter(
        condition: FilterTagDto,
    ): Promise<Tag[]> {
        // Initialize the query builder
        const queryBuilder = this.tagRepository.createQueryBuilder('tag');

        // Apply filters based on the condition
        // if (condition.tagCode) {
        //     queryBuilder.andWhere('tag.tagCode LIKE :tagCode', {
        //         tagCode: `%${condition.tagCode}%`,
        //     });
        // }
        // if (condition.tagName) {
        //     queryBuilder.orWhere('tag.tagName LIKE :tagName', {
        //         tagName: `%${condition.tagName}%`,
        //     });
        // }

        // Execute the query to retrieve the matching records
        try {
            const tags = await queryBuilder.getMany();
            return tags;
        } catch (error) {
            throw new Error('Error fetching tags: ' + error.message);
        }
    }

    async findById(oid: string): Promise<Tag> {
        try {
            // Try to find the tag by the given OID
            const tag = await this.tagRepository.findOne({ where: { oid } });

            // If no tag is found, throw a NotFoundException
            if (!tag) {
                throw new NotFoundException(`Tag with OID ${oid} not found`);
            }

            return tag;
        } catch (error) {
            // You can throw any custom error here or handle the error differently
            throw new Error('Error fetching tag: ' + error.message);
        }
    }


}
