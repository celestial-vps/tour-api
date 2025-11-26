// src/userRole/userRole.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';


import { FilterUserRoleDto, CreateUserRoleDto, UpdateUserRoleDto } from '../dtos/payload-user-role-dto';
import { UserRole } from '../models/user-role'; // Assuming you have this entity
import { IUserRoleService } from '../services/iuser-role.service';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { UserRoleVm, toUserRoleResponse, toUserRoleResponses } from '../mappings/user-role.vm';
import { MessageVm, toMessageResponse } from '../mappings/message.vm';
import { UserRoleRepository } from '../repositories/user-role.repository';
import moment from 'moment';
import { IUserRoleRepository } from '../repositories/iuser-role.repository';
// src/userRole/userRole.service.ts 

@Injectable()
export class UserRoleService implements IUserRoleService {

    constructor(private readonly userRoleRepository: UserRoleRepository,
    ) { }

    async create(createUserRoleDto: CreateUserRoleDto, userOid: string): Promise<{ userRole: MessageVm | null; err: any; }> {
        const now = new Date();
        try {
            const userRole = new UserRole();
            userRole.roleName = createUserRoleDto.roleName;
            userRole.targetType = createUserRoleDto.targetType;
            userRole.isAdministrative = createUserRoleDto.isAdministrative;
            userRole.readState = createUserRoleDto.readState;
            userRole.writeState = createUserRoleDto.writeState;
            userRole.createState = createUserRoleDto.createState;
            userRole.deleteState = createUserRoleDto.deleteState;
            userRole.navigateState = createUserRoleDto.navigateState;
            // userRole.createdBy = "";
            // userRole.createdAt = now;
            // userRole.updatedAt = now;

            const { result, err } = await this.userRoleRepository.save(userRole);
            if (err) {
                return { userRole: null, err };
            }
            const messageVm: MessageVm = {
                value: result ? result.id.toString() : '',
                name: result ? result.roleName : '',
            };

            // const userRoleVm = await toMessageResponse(result);
            return { userRole: messageVm, err: null };  // Return the userRole response and null for error
        } catch (err) {
            return { userRole: null, err };  // Return null for userRole and the error
        }
    }

    // async create(createUserRoleDto: CreateUserRoleDto, userOid: string): Promise<{ userRole: MessageVm , err: any }> {

    // }

    async update( oid: string,updateUserRoleDto: UpdateUserRoleDto, userOid: string): Promise<{ userRole: UserRoleVm | null; err: any }> {
        try {
            const lastModifiedBy = userOid; // assuming userOid is in UUID format                
            let { result: resultFind, err: errFind } = await this.userRoleRepository.findById(oid);

            if (errFind != null) {
                return {
                    userRole: null, err: errFind
                }
            }

            if (errFind != null) {
                return {
                    userRole: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            // Update userRole details
            const now = new Date();
            if (resultFind == null) {
                return {
                    userRole: null, err: {}
                }
            }
            resultFind.roleName = updateUserRoleDto.roleName ?? resultFind.roleName;
            resultFind.targetType = updateUserRoleDto.targetType ?? resultFind.targetType;
            resultFind.isAdministrative = updateUserRoleDto.isAdministrative ?? resultFind.isAdministrative;
            resultFind.readState = updateUserRoleDto.readState ?? resultFind.readState;
            resultFind.writeState = updateUserRoleDto.writeState ?? resultFind.writeState;
            resultFind.createState = updateUserRoleDto.createState ?? resultFind.createState;
            resultFind.deleteState = updateUserRoleDto.deleteState ?? resultFind.deleteState;
            resultFind.navigateState = updateUserRoleDto.navigateState ?? resultFind.navigateState;
            // resultFind.lastModifiedBy = lastModifiedBy;
            // resultFind.updatedAt = now;

            // Save updated userRole details
            const { result, err } = await this.userRoleRepository.update(oid, resultFind);
            if (errFind != null) {
                return {
                    userRole: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            // Map to response (assuming you have a mapping function)
            const userRoleVm = await toUserRoleResponse(result);
            return { userRole: userRoleVm, err: null };
        }
        catch (err) {
            return { userRole: null, err };
        }
    }

    async deleted(oid: string, userOid: string): Promise<{ userRole: UserRoleVm | null; err: any }> {
        try {
            const { result: resultFind, err: errFind } = await this.userRoleRepository.findById(oid);
            if (errFind != null) {
                return {
                    userRole: null, err: errFind
                }
            }

            if (resultFind === null) {
                return {
                    userRole: null, err: {
                        message: "Record with id ${oid} not found"
                    }
                }
            }

            const { result, err } = await this.userRoleRepository.deleted(resultFind, oid);
            if (err != null) {
                return {
                    userRole: null, err: err
                }
            }

            const userRoleVm = await toUserRoleResponse(result);
            return { userRole: userRoleVm, err: null };
        } catch (err) {
            return { userRole: null, err };
        }

    }

    async findAll(): Promise<{ userRoles: UserRoleVm[] | null; err: any }> {
        try {
            const { result, err } = await this.userRoleRepository.findAll();

            if (err != null) {
                return {
                    userRoles: null, err: err
                }
            }
            const userRoles = await toUserRoleResponses(result ?? [])
            return { userRoles, err: null }
        } catch (err) {
            return { userRoles: null, err }
        }
    }

    async findById(oid: string): Promise<{ userRole: UserRoleVm | null; err: any }> {
        try {
            const { result, err } = await this.userRoleRepository.findById(oid);
            const userRoleVm = await toUserRoleResponse(result);
            return { userRole: userRoleVm, err: null }
        } catch (err) {
            return { userRole: null, err }
        }


    }

    async findPage(condition: any, page: number, pageSize: number): Promise<{ userRoles: UserRoleVm[], total: number, err: any }> {
        try {
            const { result: resultCount, err: errCount } = await this.userRoleRepository.findCountByCriteria(condition);
            if (errCount) {
                return { userRoles: [], total: 0, err: errCount }
            }

            const { result, err } = await this.userRoleRepository.findByCriteriaPage(condition, page, pageSize);
            if (err) {
                return { userRoles: [], total: 0, err }
            }
            const userRoleVm = await toUserRoleResponses(result ?? [])
            return { userRoles: userRoleVm, total: resultCount, err: err };
        } catch (err) {
            return { userRoles: [], total: 0, err }
        }
    }

}
