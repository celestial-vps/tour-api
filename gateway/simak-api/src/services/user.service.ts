// src/user/user.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';


import { FilterUserDto, CreateUserDto, UpdateUserDto } from '../dtos/payload-user-dto';
import { User } from '../models/user'; // Assuming you have this entity
import { IUserService } from '../services/iuser.service';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { UserVm, toUserResponse, toUserResponses } from '../mappings/user.vm';
import { MessageVm, toMessageResponse } from '../mappings/message.vm';
import { UserRepository } from '../repositories/user.repository';
import moment from 'moment';
import { IUserRepository } from '../repositories/iuser.repository';
// src/user/user.service.ts 

@Injectable()
export class UserService implements IUserService {

    constructor(private readonly userRepository: UserRepository,
    ) { }

    async create(createUserDto: CreateUserDto, userOid: string): Promise<{ user: MessageVm | null; err: any; }> {
        const now = new Date();
        try {
            const user = new User();
            user.name = createUserDto.name;
            user.email = createUserDto.email;
            user.password = createUserDto.password;
            user.androidToken = createUserDto.androidToken;
            user.isActive = createUserDto.isActive;
            user.roleOid = createUserDto.roleOid;
            // user.activatedAt = new Date(createUserDto.activatedAt);
            user.activatedAt = createUserDto.activatedAt
                ? new Date(createUserDto.activatedAt)
                : undefined;

            // user.createdBy = "";
            // user.createdAt = now;
            // user.updatedAt = now;

            const { result, err } = await this.userRepository.save(user);
            if (err) {
                return { user: null, err };
            }
            const messageVm: MessageVm = {
                value: result ? result.id.toString() : '',
                name: result ? result.email : '',
            };

            // const userVm = await toMessageResponse(result);
            return { user: messageVm, err: null };  // Return the user response and null for error
        } catch (err) {
            return { user: null, err };  // Return null for user and the error
        }
    }

    // async create(createUserDto: CreateUserDto, userOid: string): Promise<{ user: MessageVm , err: any }> {

    // }

    async update(updateUserDto: UpdateUserDto, oid: string, userOid: string): Promise<{ user: UserVm | null; err: any }> {
        try {
            const lastModifiedBy = userOid; // assuming userOid is in UUID format                
            let { result: resultFind, err: errFind } = await this.userRepository.findById(oid);

            if (errFind != null) {
                return {
                    user: null, err: errFind
                }
            }

            if (errFind != null) {
                return {
                    user: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            // Update user details
            const now = new Date();
            if (resultFind == null) {
                return {
                    user: null, err: {}
                }
            }
            resultFind.name = updateUserDto.name ?? resultFind.name;
            resultFind.email = updateUserDto.email ?? resultFind.email;
            resultFind.password = updateUserDto.password ?? resultFind.password;
            resultFind.androidToken = updateUserDto.androidToken ?? resultFind.androidToken;
            resultFind.isActive = updateUserDto.isActive ?? resultFind.isActive;
            resultFind.roleOid = updateUserDto.roleOid ?? resultFind.roleOid;
            resultFind.activatedAt = updateUserDto.activatedAt
                ? new Date(updateUserDto.activatedAt)
                : resultFind.activatedAt;

            // resultFind.lastModifiedBy = lastModifiedBy;
            // resultFind.updatedAt = now;

            // Save updated user details
            const { result, err } = await this.userRepository.update(oid, resultFind);
            if (errFind != null) {
                return {
                    user: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            // Map to response (assuming you have a mapping function)
            const userVm = await toUserResponse(result);
            return { user: userVm, err: null };
        }
        catch (err) {
            return { user: null, err };
        }
    }

    async deleted(oid: string, userOid: string): Promise<{ user: UserVm | null; err: any }> {
        try {
            const { result: resultFind, err: errFind } = await this.userRepository.findById(oid);
            if (errFind != null) {
                return {
                    user: null, err: errFind
                }
            }

            if (resultFind === null) {
                return {
                    user: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            const { result, err } = await this.userRepository.deleted(resultFind, oid);
            if (err != null) {
                return {
                    user: null, err: err
                }
            }

            const userVm = await toUserResponse(result);
            return { user: userVm, err: null };
        } catch (err) {
            return { user: null, err };
        }

    }

    async findAll(): Promise<{ users: UserVm[] | null; err: any }> {
        try {
            const { result, err } = await this.userRepository.findAll();

            if (err != null) {
                return {
                    users: null, err: err
                }
            }
            const users = toUserResponses(result ?? []);
            return { users, err: null }
        } catch (err) {
            return { users: null, err }
        }
    }

    async findById(oid: string): Promise<{ user: UserVm | null; err: any }> {
        try {
            const { result, err } = await this.userRepository.findById(oid);
            const userVm = await toUserResponse(result);
            return { user: userVm, err: null }
        } catch (err) {
            return { user: null, err }
        }


    }

    async findPage(condition: any, page: number, pageSize: number): Promise<{ users: UserVm[], total: number, err: any }> {
        try {
            const { result: resultCount, err: errCount } = await this.userRepository.findCountByCriteria(condition);
            if (errCount) {
                return { users: [], total: 0, err: errCount }
            }

            const { result, err } = await this.userRepository.findByCriteriaPage(condition, page, pageSize);
            if (err) {
                return { users: [], total: 0, err }
            }
            const userVm = toUserResponses(result ?? []);
            return { users: userVm, total: resultCount, err: err };
        } catch (err) {
            return {
                users: [], total: 0, err
            }
        }

    }
}
