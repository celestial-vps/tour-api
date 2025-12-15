import { UserRepository } from '../repositories/user.repository';
import { LoginDto, RegisterDto } from '../dtos/payload-user-dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessageVm } from '../mappings/message.vm';
import { UserTokenVm } from '../mappings/user.vm';
import { UserRoleRepository } from '../repositories/user-role.repository';
export declare class AuthService {
    private readonly userRepository;
    private readonly userRoleRepository;
    private jwtService;
    private configService;
    constructor(userRepository: UserRepository, userRoleRepository: UserRoleRepository, jwtService: JwtService, configService: ConfigService);
    register(userDTO: RegisterDto): Promise<MessageVm>;
    login(userDTO: LoginDto): Promise<UserTokenVm>;
}
