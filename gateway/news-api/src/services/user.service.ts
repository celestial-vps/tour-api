import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../models/user.entity';
import { CreateUserDto, FilterUserDto, LoginDto, RegisterDto, UpdateUserDto } from '../dtos/payload-user-dto';
import { DataSource, getConnection } from 'typeorm';
import { MessageVm } from '../mappings/message-vm'; 
import { ConfigService } from '@nestjs/config';
import { UserMapping, UserVm } from '../mappings/user-vm';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository, 
    private readonly userMapping: UserMapping,
    private configService: ConfigService,
    private readonly dataSource: DataSource,
  ) { }


  // getEnvVariable() {
  //   try {
  //     return this.configService.get<number>('port')

  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }

  // }

  async register(dto: RegisterDto, userOid: string): Promise<MessageVm> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const user = new User();
      user.email = dto.email;
      user.name = dto.email;
      user.password = dto.password;
      // user.role = userOid;
      
      const savedUser = await this.userRepository.save(user, queryRunner);
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

  
  async login(userdto: LoginDto, userOid: string): Promise<MessageVm> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const user = new User();
      user.email = userdto.email;
      user.name = userdto.email;
      user.password = userdto.password;
      user.createdBy = userOid;
      const savedUser = await this.userRepository.save(user, queryRunner);
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

  async create(userdto: CreateUserDto, userOid: string): Promise<MessageVm> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const user = new User();
      user.email = userdto.email;
      user.name = userdto.email;
      user.password = userdto.password;
      user.createdBy = userOid;
      const savedUser = await this.userRepository.save(user, queryRunner);
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

  async update(oid: string, userdto: UpdateUserDto): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepository.findById(oid)
      if (!user) {
        throw new NotFoundException('User data not found');
      }

      user.email = userdto.email;
      user.name = userdto.email;
      user.password = userdto.password;
      const savedUser = await this.userRepository.update(oid, user, queryRunner);
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = savedUser.oid;
      messageVm.name = savedUser.email;
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error update user: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async deleted(oid: string,userOid:string): Promise<MessageVm> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepository.findById(oid)
      if (!user) {
        throw new NotFoundException('User data not found');
      }
      this.userRepository.delete(oid, queryRunner)
      await queryRunner.commitTransaction();
      const messageVm = new MessageVm();
      messageVm.value = user.oid;
      messageVm.name = user.email;
      return messageVm;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error Delete user: ' + error.message);
    } finally {
      await queryRunner.release();
    }
  }


  async findAll(): Promise<UserVm[]> {
    try {
      const users = await this.userRepository.findAll();
      return this.userMapping.toUserResponses(users);
    } catch (error) {
      throw new InternalServerErrorException('Error Find user: ' + error.message);
    }
  }

  async findPage(page: number, pageSize: number, condition: FilterUserDto): Promise<{ users: UserVm[]; count: number }> {

    try {
      // Get the users and count from the repository
      const  users = await this.userRepository.findByCriteriaPage(page, pageSize, condition);

      // Map the users to UserVm
      const userResponses = this.userMapping.toUserResponses(users);

      // Return the transformed data and count
      return { users: userResponses, count: 0};

    } catch (error) {
      throw new InternalServerErrorException('Error Find user: ' + error.message);
    }
  }

  async findById(oid: string): Promise<UserVm> {
    try {
      const user = await this.userRepository.findById(oid);
      return this.userMapping.toUserResponse(user);
    } catch (error) {
      throw new InternalServerErrorException('Error Find user: ' + error.message);
    }
  }

}
