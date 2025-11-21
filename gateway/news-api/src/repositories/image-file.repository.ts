import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, QueryRunner, Repository } from 'typeorm'; 
import { ImageFile } from '../models/image-file.entity';
import { FilterImageFileDto } from '../dtos/payload-image-file-dto';

@Injectable()
export class ImageFileRepository {
    constructor(
        @InjectRepository(ImageFile)
        private readonly imageFileRepository: Repository<ImageFile>,
    ) { }

    async save(imageFile: ImageFile, queryRunner: QueryRunner): Promise<ImageFile> {
        try {
            const savedImageFile = await queryRunner.manager.save(ImageFile, imageFile);
            return savedImageFile;
        } catch (error) {
            throw new InternalServerErrorException('Error saving imageFile: ' + error.message);
        }
    }

    async update(oid: string, imageFile: ImageFile, queryRunner: QueryRunner): Promise<ImageFile> {
        try {
            await this.imageFileRepository.update(oid, imageFile)
            return imageFile;
        } catch (error) {
            throw new InternalServerErrorException('Error update imageFile: ' + error.message);
        }
    }

    async delete(oid: string, queryRunner: QueryRunner): Promise<void> {

        try {
            await this.imageFileRepository.softDelete({ oid })
        } catch (error) {
            throw new InternalServerErrorException('Error saving imageFile: ' + error.message);
        }
    }

    async findAll(): Promise<ImageFile[]> {
        return this.imageFileRepository.find();
    }


    async findByCriteriaPage(
        page: number,
        pageSize: number,
        condition: FilterImageFileDto,
    ): Promise<{ imageFiles: ImageFile[]; count: number }> {
        // Initialize the query builder
        const queryBuilder = this.imageFileRepository.createQueryBuilder('imageFile');

        // Apply filters based on the condition
        if (condition.fileName) {
            queryBuilder.andWhere('imageFile.fileName LIKE :fileName', {
                fileName: `%${condition.fileName}%`,
            });
        }
        if (condition.fileUrl) {
            queryBuilder.orWhere('imageFile.fileUrl LIKE :fileUrl', {
                fileUrl: `%${condition.fileUrl}%`,
            });
        }

        // Apply pagination
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);

        // Execute the query and return results
        try {
            const [imageFiles, count] = await queryBuilder.getManyAndCount();
            return { imageFiles, count };
        } catch (error) {
            throw new NotFoundException('Error fetching imageFiles: ' + error.message);
        }
    }

    async findCountByCriteria(
        condition: FilterImageFileDto,
    ): Promise<number> {
        // Initialize the query builder
        const queryBuilder = this.imageFileRepository.createQueryBuilder('imageFile');

        // Apply filters based on the condition
        if (condition.fileName) {
            queryBuilder.andWhere('imageFile.fileName LIKE :fileName', {
                fileName: `%${condition.fileName}%`,
            });
        }
        if (condition.fileUrl) {
            queryBuilder.orWhere('imageFile.fileUrl LIKE :fileUrl', {
                fileUrl: `%${condition.fileUrl}%`,
            });
        }

        // Count total records matching the condition
        try {
            const count = await queryBuilder.getCount();
            return count;
        } catch (error) {
            throw new Error('Error fetching imageFile count: ' + error.message);
        }
    }

    async advanceFilter(
        condition: FilterImageFileDto,
    ): Promise<ImageFile[]> {
        // Initialize the query builder
        const queryBuilder = this.imageFileRepository.createQueryBuilder('imageFile');

        // Apply filters based on the condition
        if (condition.fileName) {
            queryBuilder.andWhere('imageFile.fileName LIKE :fileName', {
                fileName: `%${condition.fileName}%`,
            });
        }
        if (condition.fileUrl) {
            queryBuilder.orWhere('imageFile.fileUrl LIKE :fileUrl', {
                fileUrl: `%${condition.fileUrl}%`,
            });
        }

        // Execute the query to retrieve the matching records
        try {
            const imageFiles = await queryBuilder.getMany();
            return imageFiles;
        } catch (error) {
            throw new Error('Error fetching imageFiles: ' + error.message);
        }
    }

    async findById(oid: string): Promise<ImageFile> {
        try {
            // Try to find the imageFile by the given OID
            const imageFile = await this.imageFileRepository.findOne({ where: { oid } });

            // If no imageFile is found, throw a NotFoundException
            if (!imageFile) {
                throw new NotFoundException(`ImageFile with OID ${oid} not found`);
            }

            return imageFile;
        } catch (error) {
            // You can throw any custom error here or handle the error differently
            throw new Error('Error fetching imageFile: ' + error.message);
        }
    }


}
