// src/imageFile/imageFile.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';


import { FilterImageFileDto, CreateImageFileDto, UpdateImageFileDto } from '../dtos/payload-image-file-dto';
import { ImageFile } from '../models/image-file'; // Assuming you have this entity
import { IImageFileService } from '../services/iimage-file.service';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { MessageVm, toMessageResponse } from '../mappings/message.vm';
import { ImageFileRepository } from '../repositories/image-file.repository';
import moment from 'moment';
import { IImageFileRepository } from '../repositories/iimage-file.repository';
import { ImageFileVm, toImageFileResponse, toImageFileResponses } from '../mappings/image-file.vm';
// src/imageFile/imageFile.service.ts 

@Injectable()
export class ImageFileService implements IImageFileService {

    constructor(private readonly imageFileRepository: ImageFileRepository,
    ) { }

    async create(file: Express.Multer.File, createImageFileDto: CreateImageFileDto, userOid: string): Promise<{ imageFile: MessageVm | null; err: any; }> {
        const now = new Date();
        try {
            const imageFile = new ImageFile();
            imageFile.fileName = file.originalname;
            imageFile.fileUrl = `/publics/${file.filename}`;
            imageFile.filePath = file.path;
            imageFile.fileMime = file.mimetype;
            // imageFile.createdBy = "";
            // imageFile.createdAt = now;
            // imageFile.updatedAt = now;

            const { result, err } = await this.imageFileRepository.save(imageFile);
            if (err) {
                return { imageFile: null, err };
            }
            const messageVm: MessageVm = {
                value: result ? result.id.toString() : '',
                name: result ? (result.fileName ?? '') : '',
            };

            // const imageFileVm = await toMessageResponse(result);
            return { imageFile: messageVm, err: null };  // Return the imageFile response and null for error
        } catch (err) {
            return { imageFile: null, err };  // Return null for imageFile and the error
        }
    }

    // async create(createImageFileDto: CreateImageFileDto, userOid: string): Promise<{ imageFile: MessageVm , err: any }> {

    // }

    async update( oid: string,updateImageFileDto: UpdateImageFileDto, userOid: string): Promise<{ imageFile: ImageFileVm | null; err: any }> {
        try {
            const lastModifiedBy = userOid; // assuming userOid is in UUID format                
            let { result: resultFind, err: errFind } = await this.imageFileRepository.findById(oid);

            if (errFind != null) {
                return {
                    imageFile: null, err: errFind
                }
            }

            if (errFind != null) {
                return {
                    imageFile: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            // Update imageFile details
            const now = new Date();
            if (resultFind == null) {
                return {
                    imageFile: null, err: {}
                }
            }
            resultFind.fileName = updateImageFileDto.fileName ?? resultFind.fileName;
            resultFind.fileUrl = updateImageFileDto.fileUrl ?? resultFind.fileUrl;
            resultFind.filePath = updateImageFileDto.filePath ?? resultFind.filePath;
            resultFind.fileMime = updateImageFileDto.fileMime ?? resultFind.fileMime;
            // resultFind.lastModifiedBy = lastModifiedBy;
            // resultFind.updatedAt = now;

            // Save updated imageFile details
            const { result, err } = await this.imageFileRepository.update(oid, resultFind);
            if (errFind != null) {
                return {
                    imageFile: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            // Map to response (assuming you have a mapping function)
            const imageFileVm = result ? toImageFileResponse(result) : null;
            return { imageFile: imageFileVm, err: null };
        }
        catch (err) {
            return { imageFile: null, err };
        }
    }

    async deleted(oid: string, userOid: string): Promise<{ imageFile: ImageFileVm | null; err: any }> {
        try {
            const { result: resultFind, err: errFind } = await this.imageFileRepository.findById(oid);
            if (errFind != null) {
                return {
                    imageFile: null, err: errFind
                }
            }

            if (resultFind === null) {
                return {
                    imageFile: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            const { result, err } = await this.imageFileRepository.deleted(resultFind, oid);
            if (err != null) {
                return {
                    imageFile: null, err: err
                }
            }

            const imageFileVm = result ? toImageFileResponse(result) : null;
            return { imageFile: imageFileVm, err: null };
        } catch (err) {
            return { imageFile: null, err };
        }

    }

    async findAll(): Promise<{ imageFiles: ImageFileVm[] | null; err: any }> {
        try {
            const { result, err } = await this.imageFileRepository.findAll();

            if (err != null) {
                return {
                    imageFiles: null, err: err
                }
            }
            const imageFiles = result ? toImageFileResponses(result) : null;
            return { imageFiles, err: null }
        } catch (err) {
            return { imageFiles: null, err }
        }
    }

    async findById(oid: string): Promise<{ imageFile: ImageFileVm | null; err: any }> {
        try {
            const { result, err } = await this.imageFileRepository.findById(oid);
            const imageFileVm = result ? toImageFileResponse(result) : null;
            return { imageFile: imageFileVm, err: null }
        } catch (err) {
            return { imageFile: null, err }
        }


    }

    async findPage(condition: any, page: number, pageSize: number): Promise<{ imageFiles: ImageFileVm[], total: number, err: any }> {
        try {
            const { result: resultCount, err: errCount } = await this.imageFileRepository.findCountByCriteria(condition);
            if (errCount) {
                return { imageFiles: [], total: 0, err: errCount }
            }

            const { result, err } = await this.imageFileRepository.findByCriteriaPage(condition, page, pageSize);
            if (err) {
                return { imageFiles: [], total: 0, err }
            }
            const imageFileVm = result ? toImageFileResponses(result) : [];
            return { imageFiles: imageFileVm, total: resultCount, err: err };
        } catch (err) {
            return { imageFiles: [], total: 0, err }
        }
    }

}
