import { QueryRunner, Repository } from 'typeorm';
import { Banner } from '../models/banner.entity';
import { FilterBannerDto } from '../dtos/payload-banner-dto';
export declare class BannerRepository {
    private readonly repo;
    constructor(repo: Repository<Banner>);
    save(banner: Banner, queryRunner: QueryRunner): Promise<Banner>;
    update(oid: string, banner: Partial<Banner>, queryRunner: QueryRunner): Promise<Banner>;
    delete(oid: string, queryRunner: QueryRunner): Promise<void>;
    findAll(): Promise<Banner[]>;
    findById(oid: string): Promise<Banner>;
    findByCriteriaPage(page: number, pageSize: number, condition: FilterBannerDto): Promise<{
        banners: Banner[];
        count: number;
    }>;
    findCountByCriteria(condition: FilterBannerDto): Promise<number>;
    advanceFilter(condition: FilterBannerDto): Promise<Banner[]>;
    private buildFilter;
}
