import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, now } from 'mongoose';
import { UserRole, UserRoleDocument } from '../models/user-role';
import { IUserRoleRepository } from '../repositories/iuser-role.repository';
import { FilterUserRoleDto } from '../dtos/payload-user-role-dto';
import { Mapper } from '../misc/mapper';
import { UserRoleDomain } from '../domain/user-role.domain';

@Injectable()
export class UserRoleRepository implements IUserRoleRepository {
	constructor(
		@InjectModel(UserRole.name) private userRoleModel: Model<UserRoleDocument>,
	) { }

	async save(userRole: UserRole): Promise<{ result: UserRoleDomain| null; err: any }> {
		try {
			const collectionUserRole = new this.userRoleModel(userRole);
			collectionUserRole.createdAt = now();
			const colUserRole =await collectionUserRole.save();
			const data = Mapper.mapToDomain(UserRoleDomain, colUserRole) as UserRoleDomain;
			return { result: data, err: null };
		} catch (err) {
			return { result: null, err };
		}
	}

	async update(oid: string, userRole: UserRoleDomain): Promise<{ result: UserRoleDomain | null; err: any }> {
		try {
			const collectionUserRole = await this.userRoleModel.findByIdAndUpdate(
				{_id:oid},
				userRole,
				{
					new: true,
				},
			);
			const data = Mapper.mapToDomain(UserRoleDomain, collectionUserRole) as UserRoleDomain;
			return { result: data, err: null };
		} catch (err) {
			return { result: null, err }; // Return null for userRole and the error
		}
	}

	async deleted(userRole :UserRoleDomain,oid: string): Promise<{ result: UserRoleDomain | null; err: any }> {
		try {
			const data = await this.userRoleModel.findByIdAndDelete({_id:oid});
			return { result: userRole, err: null };
		} catch (err) {
			return { result: null, err }; // Return null for userRole and the error
		}
	}

	async findAll(): Promise<{ result: UserRoleDomain[] | null; err: any }> {
		try {
			const userRoles = await this.userRoleModel.find(); // Await the find operation
			const data = Mapper.mapToDomain(UserRoleDomain, userRoles) as UserRoleDomain[];
			return { result: data, err: null };
		} catch (err) {
			return { result: null, err }; // Return null for userRoles and the error
		}
	}

	async advanceFlter(condition: FilterUserRoleDto): Promise<{ result: UserRoleDomain[] | null; err: any }> {
		try {
			const query: any = {}; // Initialize an empty query object

			// Build the query based on provided conditions
			if (condition.roleName) {
				query.roleName = { $regex: condition.roleName, $options: 'i' }; // Case-insensitive regex search
			} 

			// Fetch results with pagination
			const userRoles = await this.userRoleModel.find(query)
			const data = Mapper.mapToDomain(UserRoleDomain, userRoles) as UserRoleDomain[];
			return { result: data, err: null };
		} catch (error) {
			return { result: null, err: error };
		}
	}

	async findById(oid: string): Promise<{ result: UserRoleDomain | null; err: any }> {
		try {
			const userRole = await this.userRoleModel.findOne({ _id:oid }); // Await the find operation
			const data = Mapper.mapToDomain(UserRoleDomain, userRole) as UserRoleDomain;
			return { result: data, err: null };
		} catch (err) {
			return { result: null, err }; // Return null for userRole and the error
		}
	}

	async findCountByCriteria(condition: FilterUserRoleDto): Promise<{ result: number | 0; err: any }> {
		try {
			const query: any = {}; // Initialize an empty query object

			// Build the query based on provided conditions
			if (condition.roleName) {
				query.roleName = { $regex: condition.roleName, $options: 'i' }; // Case-insensitive regex search
			} 

			// Count the total number of records matching the condition
			const count = await this.userRoleModel.countDocuments(query);


			return { result: count, err: null };

		} catch (err) {
			return { result: 0, err };
		}

	}

	async findByCriteriaPage(condition: FilterUserRoleDto, page: number, pageSize: number): Promise<{ result: UserRoleDomain[] | null; err: any }> {
		try {
			const query: any = {}; // Initialize an empty query object

			// Build the query based on provided conditions
			if (condition.roleName) {
				query.roleName = { $regex: condition.roleName, $options: 'i' }; // Case-insensitive regex search
			} 

			// Fetch results with pagination
			const userRoles = await this.userRoleModel.find(query)
				.skip((page - 1) * pageSize)
				.limit(pageSize);
			const data = Mapper.mapToDomain(UserRoleDomain, userRoles) as UserRoleDomain[];
			return { result: data, err: null };
		} catch (error) {
			return { result: [], err: error };
		}
	}
}
