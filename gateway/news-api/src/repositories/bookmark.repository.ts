import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, QueryRunner, Repository } from 'typeorm';
import { Bookmark } from '../models/bookmark.entity';
import { CreateBookmarkDto, FilterBookmarkDto, UpdateBookmarkDto } from '../dtos/payload-bookmark-dto';

@Injectable()
export class BookmarkRepository {
    constructor(
        @InjectRepository(Bookmark)
        private readonly bookmarkRepository: Repository<Bookmark>,
    ) { }

    async save(bookmark: Bookmark, queryRunner: QueryRunner): Promise<Bookmark> {
        try {
            const savedBookmark = await queryRunner.manager.save(Bookmark, bookmark);
            return savedBookmark;
        } catch (error) {
            throw new InternalServerErrorException('Error saving bookmark: ' + error.message);
        }
    }

    async update(oid: string, bookmark: Bookmark, queryRunner: QueryRunner): Promise<Bookmark> {
        try {
            await this.bookmarkRepository.update(oid, bookmark)
            return bookmark;
        } catch (error) {
            throw new InternalServerErrorException('Error update bookmark: ' + error.message);
        }
    }

    async delete(oid: string, queryRunner: QueryRunner): Promise<void> {

        try {
            await this.bookmarkRepository.softDelete({ oid })
        } catch (error) {
            throw new InternalServerErrorException('Error saving bookmark: ' + error.message);
        }
    }

    async findAll(): Promise<Bookmark[]> {
        return this.bookmarkRepository.find();
    }


    async findByCriteriaPage(
        page: number,
        pageSize: number,
        condition: FilterBookmarkDto,
    ): Promise<{ bookmarks: Bookmark[]; count: number }> {
        // Initialize the query builder
        const queryBuilder = this.bookmarkRepository.createQueryBuilder('bookmark');

        // Apply filters based on the condition
        // if (condition.bookmarkCode) {
        //     queryBuilder.andWhere('bookmark.bookmarkCode LIKE :bookmarkCode', {
        //         bookmarkCode: `%${condition.bookmarkCode}%`,
        //     });
        // }
        // if (condition.bookmarkName) {
        //     queryBuilder.orWhere('bookmark.bookmarkName LIKE :bookmarkName', {
        //         bookmarkName: `%${condition.bookmarkName}%`,
        //     });
        // }

        // Apply pagination
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);

        // Execute the query and return results
        try {
            const [bookmarks, count] = await queryBuilder.getManyAndCount();
            return { bookmarks, count };
        } catch (error) {
            throw new NotFoundException('Error fetching bookmarks: ' + error.message);
        }
    }

    async findCountByCriteria(
        condition: FilterBookmarkDto,
    ): Promise<number> {
        // Initialize the query builder
        const queryBuilder = this.bookmarkRepository.createQueryBuilder('bookmark');

        // Apply filters based on the condition
        // if (condition.bookmarkCode) {
        //     queryBuilder.andWhere('bookmark.bookmarkCode LIKE :bookmarkCode', {
        //         bookmarkCode: `%${condition.bookmarkCode}%`,
        //     });
        // }
        // if (condition.bookmarkName) {
        //     queryBuilder.orWhere('bookmark.bookmarkName LIKE :bookmarkName', {
        //         bookmarkName: `%${condition.bookmarkName}%`,
        //     });
        // }

        // Count total records matching the condition
        try {
            const count = await queryBuilder.getCount();
            return count;
        } catch (error) {
            throw new Error('Error fetching bookmark count: ' + error.message);
        }
    }

    async advanceFilter(
        condition: FilterBookmarkDto,
    ): Promise<Bookmark[]> {
        // Initialize the query builder
        const queryBuilder = this.bookmarkRepository.createQueryBuilder('bookmark');

        // Apply filters based on the condition
        // if (condition.bookmarkCode) {
        //     queryBuilder.andWhere('bookmark.bookmarkCode LIKE :bookmarkCode', {
        //         bookmarkCode: `%${condition.bookmarkCode}%`,
        //     });
        // }
        // if (condition.bookmarkName) {
        //     queryBuilder.orWhere('bookmark.bookmarkName LIKE :bookmarkName', {
        //         bookmarkName: `%${condition.bookmarkName}%`,
        //     });
        // }

        // Execute the query to retrieve the matching records
        try {
            const bookmarks = await queryBuilder.getMany();
            return bookmarks;
        } catch (error) {
            throw new Error('Error fetching bookmarks: ' + error.message);
        }
    }

    async findById(oid: string): Promise<Bookmark> {
        try {
            // Try to find the bookmark by the given OID
            const bookmark = await this.bookmarkRepository.findOne({ where: { oid } });

            // If no bookmark is found, throw a NotFoundException
            if (!bookmark) {
                throw new NotFoundException(`Bookmark with OID ${oid} not found`);
            }

            return bookmark;
        } catch (error) {
            // You can throw any custom error here or handle the error differently
            throw new Error('Error fetching bookmark: ' + error.message);
        }
    }


}
