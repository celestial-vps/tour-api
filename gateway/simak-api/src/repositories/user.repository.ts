import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { User, UserDocument } from '../models/user';
import { IUserRepository } from '../repositories/iuser.repository';
import { FilterUserDto } from '../dtos/payload-user-dto';
import { Mapper } from '../misc/mapper';
import { UserDomain } from '../domain/user.domain';

@Injectable()
export class UserRepository implements IUserRepository {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
	) { }

	async save(user: User): Promise<{ result: UserDomain | null, err: any }> {
		try {
			const collectionUser = new this.userModel(user);
			collectionUser.createdAt = now();
			const colUser = await collectionUser.save();
			const data = Mapper.mapToDomain(UserDomain, colUser) as UserDomain;
			return { result: data, err: null };
		} catch (err) {
			return { result: null, err };
		}
	}

	async update(oid: string, user: UserDomain): Promise<{ result: UserDomain | null; err: any }> {
		try {
			const collectionUser = await this.userModel.findByIdAndUpdate(
				{ _id: oid },
				user,
				{
					new: true,
				},
			);
			const data = Mapper.mapToDomain(UserDomain, collectionUser) as UserDomain;
			return { result: data, err: null };
		} catch (err) {
			return { result: null, err }; // Return null for user and the error
		}
	}

	async deleted(user: UserDomain, oid: string): Promise<{ result: UserDomain | null; err: any }> {
		try {
			const data = await this.userModel.findByIdAndDelete({ _id: oid });
			return { result: user, err: null };
		} catch (err) {
			return { result: null, err }; // Return null for user and the error
		}
	}

	async findAll(): Promise<{ result: UserDomain[] | null; err: any }> {
		try {
			const users = await this.userModel.find(); // Await the find operation
			const data = Mapper.mapToDomain(UserDomain, users) as UserDomain[];
			return { result: data, err: null };
		} catch (err) {
			return { result: null, err }; // Return null for users and the error
		}
	}

	async advanceFilter(condition: FilterUserDto): Promise<{ result: UserDomain[] | null; err: any }> {
		try {
			const query: any = {}; // Initialize an empty query object

			// Build the query based on provided conditions
			if (condition.email) {
				query.email = { $regex: condition.email, $options: 'i' }; // Case-insensitive regex search
			}

			// Fetch results with pagination
			const users = await this.userModel.find(query)
			const data = Mapper.mapToDomain(UserDomain, users) as UserDomain[];
			return { result: data, err: null };
		} catch (error) {
			return { result: null, err: error };
		}
	}

	async findById(oid: string): Promise<{ result: UserDomain | null; err: any }> {
		try {
			const user = await this.userModel.findOne({ _id: oid }); // Await the find operation
			const data = Mapper.mapToDomain(UserDomain, user) as UserDomain;
			return { result: data, err: null };
		} catch (err) {
			return { result: null, err }; // Return null for user and the error
		}
	}

	async findCountByCriteria(condition: FilterUserDto): Promise<{ result: number | 0; err: any }> {
		try {
			const query: any = {}; // Initialize an empty query object

			// Build the query based on provided conditions
			if (condition.email) {
				query.email = { $regex: condition.email, $options: 'i' }; // Case-insensitive regex search
			}
			// Count the total number of records matching the condition
			const count = await this.userModel.countDocuments(query);


			return { result: count, err: null };

		} catch (err) {
			return { result: 0, err };
		}

	}

	async findByCriteriaPage(condition: FilterUserDto, page: number, pageSize: number): Promise<{ result: UserDomain[] | null; err: any }> {
		try {
			const query: any = {}; // Initialize an empty query object

			// Build the query based on provided conditions
			if (condition.email) {
				query.email = { $regex: condition.email, $options: 'i' }; // Case-insensitive regex search
			}

			// Fetch results with pagination
			const users = await this.userModel.find(query)
				.skip((page - 1) * pageSize)
				.limit(pageSize);
			const data = Mapper.mapToDomain(UserDomain, users) as UserDomain[];
			return { result: data ?? null, err: null };
		} catch (error) {
			return { result: [], err: error };
		}
	}
}
