import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, QueryRunner, Repository } from 'typeorm';
import { User } from '../models/user.entity';
import { CreateUserDto, FilterUserDto  } from '../dtos/payload-user-dto';

@Injectable()
export class UserRepository {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async save(user: User, queryRunner: QueryRunner): Promise<User> { 
        try {           
            const savedUser = await queryRunner.manager.save(user);            
            return savedUser; 
        } catch (error) {            
            throw new InternalServerErrorException('Error saving user: ' + error.message);
        }  
    }

    async update(oid:string,user: User, queryRunner: QueryRunner): Promise<User> {
        try {                      
            await this.userRepository.update(oid, user)
            return user;
        } catch (error) {
            throw new InternalServerErrorException('Error update user: ' + error.message);
        }  
    }

    async delete(oid: string, queryRunner: QueryRunner): Promise<void> {

        try {                      
            await this.userRepository.softDelete({ oid })            
        } catch (error) {
            throw new InternalServerErrorException('Error saving user: ' + error.message);
        }     
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }


    async findByCriteriaPage(
        page: number,
        pageSize: number,
        condition: FilterUserDto,
    ): Promise<User[]> {
        // Initialize the query builder
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        // Apply filters based on the condition
        if (condition.email) {
            queryBuilder.andWhere('user.email LIKE :email', {
                email: `%${condition.email}%`,
            });
        }
         

        // Apply pagination
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);

        // Execute the query and return results
        try {
            const users = await queryBuilder.getMany();
            return users;
        } catch (error) {
            throw new NotFoundException('Error fetching users: ' + error.message);
        }
    }

    async findCountByCriteria(
        condition: FilterUserDto,
    ): Promise<number> {
        // Initialize the query builder
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        // Apply filters based on the condition
        if (condition.email) {
            queryBuilder.andWhere('user.email LIKE :email', {
                email: `%${condition.email}%`,
            });
        } 

        // Count total records matching the condition
        try {
            const count = await queryBuilder.getCount();
            return count;
        } catch (error) {
            throw new Error('Error fetching user count: ' + error.message);
        }
    }

    async advanceFilter(
        condition: FilterUserDto,
    ): Promise<User[]> {
        // Initialize the query builder
        const queryBuilder = this.userRepository.createQueryBuilder('user');

        // Apply filters based on the condition
        if (condition.email) {
            queryBuilder.andWhere('user.email LIKE :email', {
                email: `%${condition.email}%`,
            });
        } 

        // Execute the query to retrieve the matching records
        try {
            const users = await queryBuilder.getMany();
            return users;
        } catch (error) {
            throw new Error('Error fetching users: ' + error.message);
        }
    }

    async findById(oid: string): Promise<User> {
        try {
            // Try to find the user by the given OID
            const user = await this.userRepository.findOne({ where: { oid },
                relations: ['role'], });

            // If no user is found, throw a NotFoundException
            if (!user) {
                throw new NotFoundException(`User with OID ${oid} not found`);
            }

            return user;
        } catch (error) {
            // You can throw any custom error here or handle the error differently
            throw new Error('Error fetching user: ' + error.message);
        }
    }
}
 