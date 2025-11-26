import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ImageFileRepository } from '../repositories/image-file.repository';
import { ImageFile } from '../models/image-file.entity';
import { CreateImageFileDto, FilterImageFileDto, UpdateImageFileDto } from '../dtos/payload-image-file-dto';
import { DataSource, getConnection } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { ImageFileMapping, ImageFileVm } from '../mappings/image-file-vm';
import { ConfigService } from '@nestjs/config';
import { ImageOwnerTypeEnum } from '../enums/image-owner-type.enum';

@Injectable()
export class ImageFileService {
    constructor(private readonly imageFileRepository: ImageFileRepository, private readonly imageFileMapping: ImageFileMapping,
        private readonly dataSource: DataSource,
    ) { }

    async create(file: Express.Multer.File, imageFiledto: CreateImageFileDto, userOid: string): Promise<MessageVm> {

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const imageFile = new ImageFile();
            imageFile.fileName = file.originalname;
            imageFile.fileUrl = `/publics/${file.filename}`;
            imageFile.filePath = file.path;
            imageFile.fileMime = file.mimetype;
            imageFile.ownerType = ImageOwnerTypeEnum.NEWS;
            imageFile.createdBy = userOid;
            imageFile.createdAt = new Date();
            const savedImageFile = await this.imageFileRepository.save(imageFile, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new MessageVm();
            messageVm.value = savedImageFile.oid;
            messageVm.name = savedImageFile.fileUrl ?? '';
            return messageVm;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Error saving imageFile: ' + error.message);
        } finally {
            await queryRunner.release();
        }

    }

    async update(oid: string, imageFiledto: UpdateImageFileDto, userOid: string): Promise<MessageVm> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const imageFile = await this.imageFileRepository.findById(oid)
            if (!imageFile) {
                throw new NotFoundException('ImageFile data not found');
            }

            imageFile.fileName = imageFiledto.fileName;
            imageFile.fileUrl = imageFiledto.fileUrl;
            imageFile.filePath = imageFiledto.filePath;
            imageFile.fileMime = imageFiledto.fileMime;
            imageFile.ownerType = ImageOwnerTypeEnum.NEWS;
            const savedImageFile = await this.imageFileRepository.update(oid, imageFile, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new MessageVm();
            messageVm.value = savedImageFile.oid;
            messageVm.name = savedImageFile.fileUrl ?? '';
            return messageVm;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Error update imageFile: ' + error.message);
        } finally {
            await queryRunner.release();
        }
    }

    async deleted(oid: string,userOid:string): Promise<MessageVm> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const imageFile = await this.imageFileRepository.findById(oid)
            if (!imageFile) {
                throw new NotFoundException('ImageFile data not found');
            }
            this.imageFileRepository.delete(oid, queryRunner)
            await queryRunner.commitTransaction();
            const messageVm = new MessageVm();
            messageVm.value = imageFile.oid;
            messageVm.name = imageFile.fileUrl ?? '';
            return messageVm;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Error Delete imageFile: ' + error.message);
        } finally {
            await queryRunner.release();
        }
    }


    async findAll(): Promise<ImageFileVm[]> {
        try {
            const imageFiles = await this.imageFileRepository.findAll();
            return this.imageFileMapping.toImageFileResponses(imageFiles);
        } catch (error) {
            throw new InternalServerErrorException('Error Find imageFile: ' + error.message);
        }
    }

    async findPage(page: number, pageSize: number, condition: FilterImageFileDto):
        Promise<{ imageFiles: ImageFileVm[]; count: number }> {

        try {
            // Get the imageFiles and count from the repository
            const { imageFiles, count } = await this.imageFileRepository.findByCriteriaPage(page, pageSize, condition);

            // Map the imageFiles to ImageFileVm
            const imageFileResponses = this.imageFileMapping.toImageFileResponses(imageFiles);

            // Return the transformed data and count
            return { imageFiles: imageFileResponses, count };

        } catch (error) {
            throw new InternalServerErrorException('Error Find imageFile: ' + error.message);
        }
    }

    async findById(oid: string): Promise<ImageFileVm> {
        try {
            const imageFile = await this.imageFileRepository.findById(oid);
            return this.imageFileMapping.toImageFileResponse(imageFile);
        } catch (error) {
            throw new InternalServerErrorException('Error Find imageFile: ' + error.message);
        }
    }

}
