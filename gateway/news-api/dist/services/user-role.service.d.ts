import { UserRoleRepository } from '../repositories/user-role.repository';
import { CreateUserRoleDto, FilterUserRoleDto, UpdateUserRoleDto } from '../dtos/payload-user-role-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { UserRoleMapping, UserRoleVm } from '../mappings/user-role-vm';
export declare class UserRoleService {
    private readonly userRoleRepository;
    private readonly userRoleMapping;
    private readonly dataSource;
    constructor(userRoleRepository: UserRoleRepository, userRoleMapping: UserRoleMapping, dataSource: DataSource);
    create(userRoledto: CreateUserRoleDto, userOid: string): Promise<MessageVm>;
    update(oid: string, userRoledto: UpdateUserRoleDto, userOid: string): Promise<MessageVm>;
    deleted(oid: string, userOid: string): Promise<MessageVm>;
    findAll(): Promise<UserRoleVm[]>;
    findPage(page: number, pageSize: number, condition: FilterUserRoleDto): Promise<{
        userRoles: UserRoleVm[];
        count: number;
    }>;
    findById(oid: string): Promise<UserRoleVm>;
}
