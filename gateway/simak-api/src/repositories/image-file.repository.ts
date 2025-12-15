import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { ImageFile, ImageFileDocument } from '../models/image-file';
import { IImageFileRepository } from '../repositories/iimage-file.repository';
import { FilterImageFileDto } from '../dtos/payload-image-file-dto';
import { Mapper } from '../misc/mapper';
import { ImageFileDomain } from '../domain/image-file.domain';

@Injectable()
export class ImageFileRepository implements IImageFileRepository {
	constructor(
		@InjectModel(ImageFile.name) private imageFileModel: Model<ImageFileDocument>,
	) { }

	async save(imageFile: ImageFile): Promise<{ result: ImageFileDomain| null; err: any }> {
		try {
			const collectionImageFile = new this.imageFileModel(imageFile);
			collectionImageFile.createdAt = now();
			const colImageFile =await collectionImageFile.save();
			const data = Mapper.mapToDomain(ImageFileDomain, colImageFile) as ImageFileDomain;
			return { result: data, err: null };
		} catch (err) {
			return { result: null, err };
		}
	}

	async update(oid: string, imageFile: ImageFileDomain): Promise<{ result: ImageFileDomain | null; err: any }> {
		try {
			const collectionImageFile = await this.imageFileModel.findByIdAndUpdate(
				{_id:oid},
				imageFile,
				{
					new: true,
				},
			);
			const data = Mapper.mapToDomain(ImageFileDomain, collectionImageFile) as ImageFileDomain;
			return { result: data, err: null };
		} catch (err) {
			return { result: null, err }; // Return null for imageFile and the error
		}
	}

	async deleted(imageFile :ImageFileDomain,oid: string): Promise<{ result: ImageFileDomain | null; err: any }> {
		try {
			const data = await this.imageFileModel.findByIdAndDelete({_id:oid});
			return { result: imageFile, err: null };
		} catch (err) {
			return { result: null, err }; // Return null for imageFile and the error
		}
	}

	async findAll(): Promise<{ result: ImageFileDomain[] | null; err: any }> {
		try {
			const imageFiles = await this.imageFileModel.find(); // Await the find operation
			const data = Mapper.mapToDomain(ImageFileDomain, imageFiles) as ImageFileDomain[];
			return { result: data, err: null };
		} catch (err) {
			return { result: null, err }; // Return null for imageFiles and the error
		}
	}

	async advanceFlter(condition: FilterImageFileDto): Promise<{ result: ImageFileDomain[] | null; err: any }> {
		try {
			const query: any = {}; // Initialize an empty query object

			// Build the query based on provided conditions
			if (condition.fileName) {
				query.fileName = { $regex: condition.fileName, $options: 'i' }; // Case-insensitive regex search
			}
		

			// Fetch results with pagination
			const imageFiles = await this.imageFileModel.find(query)
			const data = Mapper.mapToDomain(ImageFileDomain, imageFiles) as ImageFileDomain[];
			return { result: data, err: null };
		} catch (error) {
			return { result: null, err: error };
		}
	}

	async findById(oid: string): Promise<{ result: ImageFileDomain | null; err: any }> {
		try {
			const imageFile = await this.imageFileModel.findOne({ _id:oid }); // Await the find operation
			const data = Mapper.mapToDomain(ImageFileDomain, imageFile) as ImageFileDomain;
			return { result: data, err: null };
		} catch (err) {
			return { result: null, err }; // Return null for imageFile and the error
		}
	}

	async findCountByCriteria(condition: FilterImageFileDto): Promise<{ result: number | 0; err: any }> {
		try {
			const query: any = {}; // Initialize an empty query object

			// Build the query based on provided conditions
			if (condition.fileName) {
				query.fileName = { $regex: condition.fileName, $options: 'i' }; // Case-insensitive regex search
			}

			// Count the total number of records matching the condition
			const count = await this.imageFileModel.countDocuments(query);


			return { result: count, err: null };

		} catch (err) {
			return { result: 0, err };
		}

	}

	async findByCriteriaPage(condition: FilterImageFileDto, page: number, pageSize: number): Promise<{ result: ImageFileDomain[] | null; err: any }> {
		try {
			const query: any = {}; // Initialize an empty query object

			// Build the query based on provided conditions
			if (condition.fileName) {
				query.fileName = { $regex: condition.fileName, $options: 'i' }; // Case-insensitive regex search
			}

			// Fetch results with pagination
			const imageFiles = await this.imageFileModel.find(query)
				.skip((page - 1) * pageSize)
				.limit(pageSize);
			const data = Mapper.mapToDomain(ImageFileDomain, imageFiles) as ImageFileDomain[];
			return { result: data, err: null };
		} catch (error) {
			return { result: [], err: error };
		}
	}
}
