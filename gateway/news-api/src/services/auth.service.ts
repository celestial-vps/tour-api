import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository'; // Import custom UserRepository
import { CreateUserDto, FilterUserDto, LoginDto, RegisterDto } from '../dtos/payload-user-dto';
import { User } from '../models/user.entity';
import * as bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { UserRole } from '../models/user-role.entity';
import { JwtService } from '@nestjs/jwt';
import { UserMapping, UserTokenVm } from '../mappings/user-vm';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepository: UserRepository,  // Inject UserRepository directly
        private readonly dataSource: DataSource,
        private jwtService: JwtService,
        private readonly userMapping: UserMapping
    ) { }

    async register(userDTO: RegisterDto): Promise<MessageVm> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const user = new User();
            user.email = userDTO.email;
            user.name = userDTO.email;
            const role = await queryRunner.manager.findOne(UserRole, { where: { oid: "8efdd987-4d2b-401c-aa34-16605870bdab" } });

            if (!role) {
                throw new InternalServerErrorException('Role not found');
            }
            user.role = role;

            const salt = await bcrypt.genSalt(); // 2.
            user.password = await bcrypt.hash(userDTO.password, salt); // 3.

            const savedUser = await this.userRepository.save(user, queryRunner);  // Using custom repository save method
            // delete savedUser.password;

            await queryRunner.commitTransaction();
            const messageVm = new MessageVm();
            messageVm.value = savedUser.oid;
            messageVm.name = savedUser.email;
            return messageVm;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Error saving user: ' + error.message);
        } finally {
            await queryRunner.release();
        }


    }

    async login(userDTO: LoginDto): Promise<UserTokenVm> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {

            const condition = new FilterUserDto();
            condition.email = userDTO.email;


            const users = await this.userRepository.advanceFilter(condition);  // Using custom repository save method
            if (users.length == 0) {
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
                const user = await this.userMapping.toUserTokenResponse(users[0], token, "")

                return user;
            }
            await queryRunner.commitTransaction();
            throw new UnauthorizedException('Email not found');
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('Error saving user: ' + error.message);
        } finally {
            await queryRunner.release();
        }


    }
}

