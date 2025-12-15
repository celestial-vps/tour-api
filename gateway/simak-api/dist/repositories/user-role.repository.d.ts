import { Model } from 'mongoose';
import { UserRole, UserRoleDocument } from '../models/user-role';
import { IUserRoleRepository } from '../repositories/iuser-role.repository';
import { FilterUserRoleDto } from '../dtos/payload-user-role-dto';
import { UserRoleDomain } from '../domain/user-role.domain';
export declare class UserRoleRepository implements IUserRoleRepository {
    private userRoleModel;
    constructor(userRoleModel: Model<UserRoleDocument>);
    save(userRole: UserRole): Promise<{
        result: UserRoleDomain | null;
        err: any;
    }>;
    update(oid: string, userRole: UserRoleDomain): Promise<{
        result: UserRoleDomain | null;
        err: any;
    }>;
    deleted(userRole: UserRoleDomain, oid: string): Promise<{
        result: UserRoleDomain | null;
        err: any;
    }>;
    findAll(): Promise<{
        result: UserRoleDomain[] | null;
        err: any;
    }>;
    advanceFlter(condition: FilterUserRoleDto): Promise<{
        result: UserRoleDomain[] | null;
        err: any;
    }>;
    findById(oid: string): Promise<{
        result: UserRoleDomain | null;
        err: any;
    }>;
    findCountByCriteria(condition: FilterUserRoleDto): Promise<{
        result: number | 0;
        err: any;
    }>;
    findByCriteriaPage(condition: FilterUserRoleDto, page: number, pageSize: number): Promise<{
        result: UserRoleDomain[] | null;
        err: any;
    }>;
}
