import { BannerRepository } from '../repositories/banner.repository';
import { CreateBannerDto, FilterBannerDto, UpdateBannerDto } from '../dtos/payload-banner-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { BannerMapping, BannerVm } from '../mappings/banner-vm';
export declare class BannerService {
    private readonly bannerRepository;
    private readonly bannerMapping;
    private readonly dataSource;
    constructor(bannerRepository: BannerRepository, bannerMapping: BannerMapping, dataSource: DataSource);
    create(bannerdto: CreateBannerDto, userOid: string): Promise<MessageVm>;
    update(oid: string, bannerdto: UpdateBannerDto, userOid: string): Promise<MessageVm>;
    deleted(oid: string, userOid: string): Promise<MessageVm>;
    findAll(): Promise<BannerVm[]>;
    findPage(page: number, pageSize: number, condition: FilterBannerDto): Promise<{
        banners: BannerVm[];
        count: number;
    }>;
    findById(oid: string): Promise<BannerVm>;
}
