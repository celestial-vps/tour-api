import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, QueryRunner, Repository } from 'typeorm';
import { Banner } from '../models/banner.entity';
import { CreateBannerDto, FilterBannerDto, UpdateBannerDto } from '../dtos/payload-banner-dto';

@Injectable()
export class BannerRepository {
    constructor(
        @InjectRepository(Banner)
        private readonly bannerRepository: Repository<Banner>,
    ) { }

    async save(banner: Banner, queryRunner: QueryRunner): Promise<Banner> {
        try {
            const savedBanner = await queryRunner.manager.save(Banner, banner);
            return savedBanner;
        } catch (error) {
            throw new InternalServerErrorException('Error saving banner: ' + error.message);
        }
    }

    async update(oid: string, banner: Banner, queryRunner: QueryRunner): Promise<Banner> {
        try {
            await this.bannerRepository.update(oid, banner)
            return banner;
        } catch (error) {
            throw new InternalServerErrorException('Error update banner: ' + error.message);
        }
    }

    async delete(oid: string, queryRunner: QueryRunner): Promise<void> {

        try {
            await this.bannerRepository.softDelete({ oid })
        } catch (error) {
            throw new InternalServerErrorException('Error saving banner: ' + error.message);
        }
    }

    async findAll(): Promise<Banner[]> {
        return this.bannerRepository.find();
    }


    async findByCriteriaPage(
        page: number,
        pageSize: number,
        condition: FilterBannerDto,
    ): Promise<{ banners: Banner[]; count: number }> {
        // Initialize the query builder
        const queryBuilder = this.bannerRepository.createQueryBuilder('banner');

        // Apply filters based on the condition
        if (condition.title) {
            queryBuilder.andWhere('banner.title LIKE :title', {
                title: `%${condition.title}%`,
            });
        } 

        // Apply pagination
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);

        // Execute the query and return results
        try {
            const [banners, count] = await queryBuilder.getManyAndCount();
            return { banners, count };
        } catch (error) {
            throw new NotFoundException('Error fetching banners: ' + error.message);
        }
    }

    async findCountByCriteria(
        condition: FilterBannerDto,
    ): Promise<number> {
        // Initialize the query builder
        const queryBuilder = this.bannerRepository.createQueryBuilder('banner');

        // Apply filters based on the condition
        if (condition.title) {
            queryBuilder.andWhere('banner.title LIKE :title', {
                title: `%${condition.title}%`,
            });
        } 

        // Count total records matching the condition
        try {
            const count = await queryBuilder.getCount();
            return count;
        } catch (error) {
            throw new Error('Error fetching banner count: ' + error.message);
        }
    }

    async advanceFilter(
        condition: FilterBannerDto,
    ): Promise<Banner[]> {
        // Initialize the query builder
        const queryBuilder = this.bannerRepository.createQueryBuilder('banner');

        // Apply filters based on the condition
        if (condition.title) {
            queryBuilder.andWhere('banner.title LIKE :title', {
                title: `%${condition.title}%`,
            });
        } 
        // Execute the query to retrieve the matching records
        try {
            const banners = await queryBuilder.getMany();
            return banners;
        } catch (error) {
            throw new Error('Error fetching banners: ' + error.message);
        }
    }

    async findById(oid: string): Promise<Banner> {
        try {
            // Try to find the banner by the given OID
            const banner = await this.bannerRepository.findOne({ where: { oid } });

            // If no banner is found, throw a NotFoundException
            if (!banner) {
                throw new NotFoundException(`Banner with OID ${oid} not found`);
            }

            return banner;
        } catch (error) {
            // You can throw any custom error here or handle the error differently
            throw new Error('Error fetching banner: ' + error.message);
        }
    }


}
