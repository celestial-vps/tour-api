import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { BannerRepository } from '../repositories/banner.repository';
import { Banner } from '../models/banner.entity';
import { CreateBannerDto, FilterBannerDto, UpdateBannerDto } from '../dtos/payload-banner-dto';
import { DataSource, getConnection } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { BannerMapping, BannerVm } from '../mappings/banner-vm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BannerService {
  constructor(private readonly bannerRepository: BannerRepository, private readonly bannerMapping: BannerMapping, 
    private readonly dataSource: DataSource,
  ) { } 

  async create(bannerdto: CreateBannerDto, userOid: string): Promise<MessageVm> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const banner = new Banner();
      banner.article = bannerdto.article;
      banner.title = bannerdto.title;
      banner.createdBy = userOid;
      banner.createdAt = new Date();
      const savedBanner = await this.bannerRepository.save(banner, queryRunner);
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = savedBanner.oid;
      messageVm.name = savedBanner.user ?? '';
      return messageVm;
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
      const banner = await this.bannerRepository.findById(oid)
      if (!banner) {
        throw new NotFoundException('Banner data not found');
      }

      banner.article = bannerdto.article;
      banner.user = bannerdto.user;
      const savedBanner = await this.bannerRepository.update(oid, banner, queryRunner);
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = savedBanner.oid;
      messageVm.name = savedBanner.user ?? '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error update banner: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const banner = await this.bannerRepository.findById(oid)
      if (!banner) {
        throw new NotFoundException('Banner data not found');
      }
      this.bannerRepository.delete(oid, queryRunner)
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = banner.oid;
      messageVm.name = banner.user ?? '';
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error Delete banner: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }


  async findAll(): Promise<BannerVm[]> {
    try {
      const banners = await this.bannerRepository.findAll();
      return this.bannerMapping.toBannerResponses(banners);
    } catch (error) {
      throw new InternalServerErrorException('Error Find banner: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterBannerDto):
    Promise<{ banners: BannerVm[]; count: number }> {

    try { 
      const { banners, count } = await this.bannerRepository.findByCriteriaPage(page, pageSize, condition); 
      const bannerResponses = this.bannerMapping.toBannerResponses(banners); 
      return { banners: bannerResponses, count };

    } catch (error) {
      throw new InternalServerErrorException('Error Find banner: ' + error.message);
    }
  }

  async findById(oid: string): Promise<BannerVm> {
    try {
      const banner = await this.bannerRepository.findById(oid);
      return this.bannerMapping.toBannerResponse(banner);
    } catch (error) {
      throw new InternalServerErrorException('Error Find banner: ' + error.message);
    }
  }

}
