import { UserRepository } from '../repositories/user.repository';
import { LoginDto, RegisterDto } from '../dtos/payload-user-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { JwtService } from '@nestjs/jwt';
import { UserMapping, UserTokenVm } from '../mappings/user-vm';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly userRepository;
    private readonly dataSource;
    private jwtService;
    private readonly userMapping;
    private configService;
    constructor(userRepository: UserRepository, dataSource: DataSource, jwtService: JwtService, userMapping: UserMapping, configService: ConfigService);
    register(userDTO: RegisterDto): Promise<MessageVm>;
    login(userDTO: LoginDto): Promise<UserTokenVm>;
}
