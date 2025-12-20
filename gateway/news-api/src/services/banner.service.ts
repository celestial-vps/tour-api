import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BannerRepository } from '../repositories/banner.repository';
import { Banner } from '../models/banner.entity';
import { CreateBannerDto, FilterBannerDto, UpdateBannerDto } from '../dtos/payload-banner-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { BannerMapping, BannerVm } from '../mappings/banner-vm';

@Injectable()
export class BannerService {
  constructor(
    private readonly bannerRepository: BannerRepository,
    private readonly bannerMapping: BannerMapping,
    private readonly dataSource: DataSource,
  ) {}

  async create(bannerdto: CreateBannerDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const banner = new Banner(); 
      banner.title = bannerdto.title; 
      banner.createdBy = userOid;
      banner.createdAt = new Date();

      const savedBanner = await this.bannerRepository.save(banner, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedBanner.oid, name: savedBanner.title ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error saving banner: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async update(oid: string, bannerdto: UpdateBannerDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const banner = await this.bannerRepository.findById(oid);
      if (!banner) throw new NotFoundException('Banner data not found');
 
      banner.title = bannerdto.title; 
      banner.lastModifiedBy = userOid;
      banner.updatedAt = new Date();

      const savedBanner = await this.bannerRepository.update(oid, banner, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedBanner.oid, name: savedBanner.title ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error updating banner: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const banner = await this.bannerRepository.findById(oid);
      if (!banner) throw new NotFoundException('Banner data not found');

      await this.bannerRepository.delete(oid, queryRunner); // <--- tambahkan await
      await queryRunner.commitTransaction();

      return { value: banner.oid, name: banner.title ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error deleting banner: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<BannerVm[]> {
    try {
      const banners = await this.bannerRepository.findAll();
      return this.bannerMapping.toBannerResponses(banners);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching banners: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterBannerDto): Promise<{ banners: BannerVm[]; count: number }> {
    try {
      const { banners, count } = await this.bannerRepository.findByCriteriaPage(page, pageSize, condition);
      return { banners: this.bannerMapping.toBannerResponses(banners), count };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching paginated banners: ' + error.message);
    }
  }

  async findById(oid: string): Promise<BannerVm> {
    try {
      const banner = await this.bannerRepository.findById(oid);
      if (!banner) throw new NotFoundException('Banner not found');
      return this.bannerMapping.toBannerResponse(banner);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching banner: ' + error.message);
    }
  }
}
