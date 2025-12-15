import { UserRoleDomain } from '../domain/user-role.domain';
import { UserRole } from '../models/user-role';
export interface IUserRoleRepository {
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
    findById(oid: string): Promise<{
        result: UserRoleDomain | null;
        err: any;
    }>;
    advanceFlter(condition: any): Promise<{
        result: UserRoleDomain[] | null;
        err: any;
    }>;
    findCountByCriteria(condition: any): Promise<{
        result: number | 0;
        err: any;
    }>;
    findByCriteriaPage(condition: any, page: number, pageSize: number): Promise<{
        result: UserRoleDomain[] | null;
        err: any;
    }>;
}
