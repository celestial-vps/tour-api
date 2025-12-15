import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { ConfigService } from '@nestjs/config';
import { CreateUserRoleDto, FilterUserRoleDto, UpdateUserRoleDto } from '../dtos/payload-user-role-dto';
import { UserRoleMapping, UserRoleVm } from '../mappings/user-role-vm';
import { UserRoleRepository } from '../repositories/user-role.repository';
export declare class UserRoleService {
    private readonly userRoleRepository;
    private readonly userRoleMapping;
    private configService;
    private readonly dataSource;
    constructor(userRoleRepository: UserRoleRepository, userRoleMapping: UserRoleMapping, configService: ConfigService, dataSource: DataSource);
    create(userRoledto: CreateUserRoleDto, userOid: string): Promise<MessageVm>;
    update(oid: string, userRoledto: UpdateUserRoleDto, userOid: string): Promise<MessageVm>;
    deleted(oid: string): Promise<MessageVm>;
    findAll(): Promise<UserRoleVm[]>;
    findPage(page: number, pageSize: number, condition: FilterUserRoleDto): Promise<{
        userRoles: UserRoleVm[];
        count: number;
    }>;
    findById(oid: string): Promise<UserRoleVm>;
}
