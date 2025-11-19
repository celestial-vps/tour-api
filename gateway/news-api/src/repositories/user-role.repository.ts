import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, QueryRunner, Repository } from 'typeorm'; 
import { UserRole } from '../models/user-role.entity'; 
import { FilterUserRoleDto } from '../dtos/payload-user-role-dto';

@Injectable()
export class UserRoleRepository {
    constructor(
        @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>,
    ) { }

    async save(userRole: UserRole, queryRunner: QueryRunner): Promise<UserRole> { 
        try {           
            const savedUserRole = await queryRunner.manager.save(userRole);            
            return savedUserRole; 
        } catch (error) {            
            throw new InternalServerErrorException('Error saving userRole: ' + error.message);
        }  
    }

    async update(oid:string,userRole: UserRole, queryRunner: QueryRunner): Promise<UserRole> {
        try {                      
            await this.userRoleRepository.update(oid, userRole)
            return userRole;
        } catch (error) {
            throw new InternalServerErrorException('Error update userRole: ' + error.message);
        }  
    }

    async delete(oid: string, queryRunner: QueryRunner): Promise<void> {

        try {                      
            await this.userRoleRepository.softDelete({ oid })            
        } catch (error) {
            throw new InternalServerErrorException('Error saving userRole: ' + error.message);
        }     
    }

    async findAll(): Promise<UserRole[]> {
        return this.userRoleRepository.find();
    }


    async findByCriteriaPage(
        page: number,
        pageSize: number,
        condition: FilterUserRoleDto,
    ): Promise<{ userRoles: UserRole[]; count: number }> {
        // Initialize the query builder
        const queryBuilder = this.userRoleRepository.createQueryBuilder('userRole');

        // Apply filters based on the condition
        if (condition.roleName) {
            queryBuilder.andWhere('userRole.roleName LIKE :roleName', {
                roleName: `%${condition.roleName}%`,
            });
        }
        

        // Apply pagination
        const skip = (page - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);

        // Execute the query and return results
        try {
            const [userRoles, count]  = await queryBuilder.getManyAndCount();            
            return { userRoles, count };
        } catch (error) {
            throw new NotFoundException('Error fetching userRoles: ' + error.message);
        }
    }

    async findCountByCriteria(
        condition: FilterUserRoleDto,
    ): Promise<number> {
        // Initialize the query builder
        const queryBuilder = this.userRoleRepository.createQueryBuilder('userRole');

        // Apply filters based on the condition
        if (condition.roleName) {
            queryBuilder.andWhere('userRole.roleName LIKE :roleName', {
                roleName: `%${condition.roleName}%`,
            });
        }
        

        // Count total records matching the condition
        try {
            const count = await queryBuilder.getCount();
            return count;
        } catch (error) {
            throw new Error('Error fetching userRole count: ' + error.message);
        }
    }

    async advanceFilter(
        condition: FilterUserRoleDto,
    ): Promise<UserRole[]> {
        // Initialize the query builder
        const queryBuilder = this.userRoleRepository.createQueryBuilder('userRole');

        // Apply filters based on the condition
        if (condition.roleName) {
            queryBuilder.andWhere('userRole.roleName LIKE :roleName', {
                roleName: `%${condition.roleName}%`,
            });
        }
      

        // Execute the query to retrieve the matching records
        try {
            const userRoles = await queryBuilder.getMany();
            return userRoles;
        } catch (error) {
            throw new Error('Error fetching userRoles: ' + error.message);
        }
    }

    async findById(oid: string): Promise<UserRole> {
        try {
            // Try to find the userRole by the given OID
            const userRole = await this.userRoleRepository.findOne({ where: { oid } });

            // If no userRole is found, throw a NotFoundException
            if (!userRole) {
                throw new NotFoundException(`UserRole with OID ${oid} not found`);
            }

            return userRole;
        } catch (error) {
            // You can throw any custom error here or handle the error differently
            throw new Error('Error fetching userRole: ' + error.message);
        }
    }
}
 