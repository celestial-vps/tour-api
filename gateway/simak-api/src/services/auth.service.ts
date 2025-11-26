import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository'; // Import custom UserRepository
import { CreateUserDto, FilterUserDto, LoginDto, RegisterDto } from '../dtos/payload-user-dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MessageVm } from '../mappings/message.vm';
import { toUserTokenResponse, UserTokenVm } from '../mappings/user.vm';
import { User } from '../models/user';
import { UserRoleRepository } from '../repositories/user-role.repository';

@Injectable()
export class AuthService {


    constructor(
        private readonly userRepository: UserRepository,
        private readonly userRoleRepository: UserRoleRepository,

        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async register(userDTO: RegisterDto): Promise<MessageVm> {
        const systemUser = '00000000-0000-0000-0000-000000000000';

        try {
            const user = new User();
            user.email = userDTO.email;
            user.password = userDTO.password;

            const roleId = this.configService.get<string>('ROLEID');
            // const role = await queryRunner.manager.findOne(UserRole, { where: { oid: roleId } });
            const { result, err } = await this.userRoleRepository.findById(roleId ?? '');


            if (!result) {
                throw new InternalServerErrorException('Role not found');
            }
            user.userRole = result;

            const salt = await bcrypt.genSalt(); // 2.
            user.password = await bcrypt.hash(userDTO.password, salt); // 3.

            const savedUser = await this.userRepository.save(user);

            const messageVm = new MessageVm();
            messageVm.value = savedUser.result ? savedUser.result.id : '';
            messageVm.name = savedUser.result ? savedUser.result.email : '';
            return messageVm;
        } catch (error) {
            throw new InternalServerErrorException('Error saving user: ' + error.message);
        }
    }

    async login(userDTO: LoginDto): Promise<UserTokenVm> {

        try {

            const condition = new FilterUserDto();
            condition.email = userDTO.email;


            const users = await this.userRepository.advanceFilter(condition);  // Using custom repository save method
            if (users.result ? users.result.length : 0 == 0) {
                throw new UnauthorizedException('Email not found');
            }
            const passwordMatched = await bcrypt.compare(
                userDTO.password,
                users[0].password,
            );
            if (passwordMatched) {
                // delete users[0].password;
                const payload = {
                    userOid: users[0].oid,
                    username: users[0].email,
                    level: 'application',
                    expiresIn: '1h',  // Expire in 1 hour
                };
                const token = this.jwtService.sign(payload);
                const user = toUserTokenResponse(users[0], token, "")

                return user;
            }

            throw new UnauthorizedException('Email not found');
        } catch (error) {

            throw new InternalServerErrorException('Error saving user: ' + error.message);
        }
    }
}

