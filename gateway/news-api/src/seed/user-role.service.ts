import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, getConnection } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { ConfigService } from '@nestjs/config';
import { CreateUserRoleDto, FilterUserRoleDto, UpdateUserRoleDto } from '../dtos/payload-user-role-dto';
import { UserRoleMapping, UserRoleVm } from '../mappings/user-role-vm';
import { UserRole } from '../models/user-role.entity';
import { UserRoleRepository } from '../repositories/user-role.repository';

@Injectable()
export class UserRoleService {
    constructor(private readonly userRoleRepository: UserRoleRepository, private readonly userRoleMapping: UserRoleMapping,
        private configService: ConfigService,
        private readonly dataSource: DataSource,
    ) { }


    async create(userRoledto: CreateUserRoleDto, userOid: string): Promise<MessageVm> {
        // const connection = getConnection();
        // const queryRunner = connection.createQueryRunner();
        // await queryRunner.connect();
        // await queryRunner.startTransaction();

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const userRole = new UserRole();
            userRole.roleName = userRoledto.roleName;
            userRole.targetType = userRoledto.targetType;
            userRole.isAdministrative = userRoledto.isAdministrative;
            userRole.readState = userRoledto.readState;
            userRole.writeState = userRoledto.writeState;
            userRole.createState = userRoledto.createState;
            userRole.deleteState = userRoledto.deleteState;
            userRole.navigateState = userRoledto.navigateState;

            userRole.createdAt = new Date();
            userRole.createdBy = userOid;
            const savedUserRole = await this.userRoleRepository.save(userRole, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new MessageVm();
            messageVm.value = savedUserRole.oid;
            messageVm.name = savedUserRole.roleName;
            return messageVm;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Error saving userRole: ' + error.message);
        } finally {
            await queryRunner.release();
        }

    }

    async update(oid: string, userRoledto: UpdateUserRoleDto, userOid: string): Promise<MessageVm> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const userRole = await this.userRoleRepository.findById(oid)
            if (!userRole) {
                throw new NotFoundException('UserRole data not found');
            }

            userRole.roleName = userRoledto.roleName;
            userRole.targetType = userRoledto.targetType;
            userRole.isAdministrative = userRoledto.isAdministrative;
            userRole.readState = userRoledto.readState;
            userRole.writeState = userRoledto.writeState;
            userRole.createState = userRoledto.createState;
            userRole.deleteState = userRoledto.deleteState;
            userRole.navigateState = userRoledto.navigateState;

            const savedUserRole = await this.userRoleRepository.update(oid, userRole, queryRunner);
            await queryRunner.commitTransaction();
            const messageVm = new MessageVm();
            messageVm.value = savedUserRole.oid;
            messageVm.name = savedUserRole.roleName;
            return messageVm;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Error update userRole: ' + error.message);
        } finally {
            await queryRunner.release();
        }
    }

    async deleted(oid: string): Promise<MessageVm> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const userRole = await this.userRoleRepository.findById(oid)
            if (!userRole) {
                throw new NotFoundException('UserRole data not found');
            }
            this.userRoleRepository.delete(oid, queryRunner)
            await queryRunner.commitTransaction();
            const messageVm = new MessageVm();
            messageVm.value = userRole.oid;
            messageVm.name = userRole.roleName;
            return messageVm;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Error Delete userRole: ' + error.message);
        } finally {
            await queryRunner.release();
        }
    }


    async findAll(): Promise<UserRoleVm[]> {
        try {
            const userRoles = await this.userRoleRepository.findAll();
            return this.userRoleMapping.toUserRoleResponses(userRoles);
        } catch (error) {
            throw new InternalServerErrorException('Error Find userRole: ' + error.message);
        }
    }

    async findPage(page: number, pageSize: number, condition: FilterUserRoleDto): Promise<{ userRoles: UserRoleVm[]; count: number }> {

        try {
            // Get the userRoles and count from the repository
            const { userRoles, count } = await this.userRoleRepository.findByCriteriaPage(page, pageSize, condition);

            // Map the userRoles to UserRoleVm
            const userRoleResponses = this.userRoleMapping.toUserRoleResponses(userRoles);

            // Return the transformed data and count
            return { userRoles: userRoleResponses, count };

        } catch (error) {
            throw new InternalServerErrorException('Error Find userRole: ' + error.message);
        }
    }

    async findById(oid: string): Promise<UserRoleVm> {
        try {
            const userRole = await this.userRoleRepository.findById(oid);
            return this.userRoleMapping.toUserRoleResponse(userRole);
        } catch (error) {
            throw new InternalServerErrorException('Error Find userRole: ' + error.message);
        }
    }

}
