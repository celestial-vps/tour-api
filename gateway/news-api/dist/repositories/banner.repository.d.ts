import { QueryRunner, Repository } from 'typeorm';
import { Banner } from '../models/banner.entity';
import { FilterBannerDto } from '../dtos/payload-banner-dto';
export declare class BannerRepository {
    private readonly bannerRepository;
    constructor(bannerRepository: Repository<Banner>);
    save(banner: Banner, queryRunner: QueryRunner): Promise<Banner>;
    update(oid: string, banner: Banner, queryRunner: QueryRunner): Promise<Banner>;
    delete(oid: string, queryRunner: QueryRunner): Promise<void>;
    findAll(): Promise<Banner[]>;
    findByCriteriaPage(page: number, pageSize: number, condition: FilterBannerDto): Promise<{
        banners: Banner[];
        count: number;
    }>;
    findCountByCriteria(condition: FilterBannerDto): Promise<number>;
    advanceFilter(condition: FilterBannerDto): Promise<Banner[]>;
    findById(oid: string): Promise<Banner>;
}
