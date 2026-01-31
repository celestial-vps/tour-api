import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserRoleRepository } from '../repositories/user-role.repository';
import { UserRole } from '../models/user-role.entity';
import { CreateUserRoleDto, FilterUserRoleDto, UpdateUserRoleDto } from '../dtos/payload-user-role-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { UserRoleMapping, UserRoleVm } from '../mappings/user-role-vm';

@Injectable()
export class UserRoleService {
  constructor(
    private readonly userRoleRepository: UserRoleRepository,
    private readonly userRoleMapping: UserRoleMapping,
    private readonly dataSource: DataSource,
  ) {}

  async create(userRoledto: CreateUserRoleDto, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const userRole = new UserRole();
      userRole.targetType = userRoledto.targetType;
      userRole.roleName = userRoledto.roleName;
      userRole.isAdministrative = userRoledto.isAdministrative;
      userRole.createdBy = userOid;
      userRole.createdAt = new Date();

      const savedUserRole = await this.userRoleRepository.save(userRole, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedUserRole.oid, name: savedUserRole.roleName ?? '' } as MessageVm;
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
      const userRole = await this.userRoleRepository.findById(oid);
      if (!userRole) throw new NotFoundException('UserRole data not found');

      userRole.targetType = userRoledto.targetType;
      userRole.roleName = userRoledto.roleName;
      userRole.isAdministrative = userRoledto.isAdministrative;
      userRole.lastModifiedBy = userOid;
      userRole.updatedAt = new Date();

      const savedUserRole = await this.userRoleRepository.update(oid, userRole, queryRunner);
      await queryRunner.commitTransaction();

      return { value: savedUserRole.oid, name: savedUserRole.roleName ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error updating userRole: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string, userOid: string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const userRole = await this.userRoleRepository.findById(oid);
      if (!userRole) throw new NotFoundException('UserRole data not found');

      await this.userRoleRepository.delete(oid, queryRunner); // <--- tambahkan await
      await queryRunner.commitTransaction();

      return { value: userRole.oid, name: userRole.roleName ?? '' } as MessageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error deleting userRole: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<UserRoleVm[]> {
    try {
      const userRoles = await this.userRoleRepository.findAll();
      return this.userRoleMapping.toUserRoleResponses(userRoles);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching userRoles: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterUserRoleDto): Promise<{ userRoles: UserRoleVm[]; count: number }> {
    try {
      const { userRoles, count } = await this.userRoleRepository.findByCriteriaPage(page, pageSize, condition);
      return { userRoles: this.userRoleMapping.toUserRoleResponses(userRoles), count };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching paginated userRoles: ' + error.message);
    }
  }

  async findById(oid: string): Promise<UserRoleVm> {
    try {
      const userRole = await this.userRoleRepository.findById(oid);
      if (!userRole) throw new NotFoundException('UserRole not found');
      return this.userRoleMapping.toUserRoleResponse(userRole);
    } catch (error) {
      throw new InternalServerErrorException('Error fetching userRole: ' + error.message);
    }
  }
}
