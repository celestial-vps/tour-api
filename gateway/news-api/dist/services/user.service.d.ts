import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto, FilterUserDto, LoginDto, RegisterDto, UpdateUserDto } from '../dtos/payload-user-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { ConfigService } from '@nestjs/config';
import { UserMapping, UserVm } from '../mappings/user-vm';
export declare class UserService {
    private readonly userRepository;
    private readonly userMapping;
    private configService;
    private readonly dataSource;
    constructor(userRepository: UserRepository, userMapping: UserMapping, configService: ConfigService, dataSource: DataSource);
    register(dto: RegisterDto, userOid: string): Promise<MessageVm>;
    login(userdto: LoginDto, userOid: string): Promise<MessageVm>;
    create(userdto: CreateUserDto, userOid: string): Promise<MessageVm>;
    update(oid: string, userdto: UpdateUserDto): Promise<MessageVm>;
    deleted(oid: string, userOid: string): Promise<MessageVm>;
    findAll(): Promise<UserVm[]>;
    findPage(page: number, pageSize: number, condition: FilterUserDto): Promise<{
        users: UserVm[];
        count: number;
    }>;
    findById(oid: string): Promise<UserVm>;
}
