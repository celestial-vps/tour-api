import { UserDomain } from '../domain/user.domain';
import { User } from '../models/user';
export interface IUserRepository {
    save(user: User): Promise<{
        result: UserDomain | null;
        err: any;
    }>;
    update(oid: string, user: UserDomain): Promise<{
        result: UserDomain | null;
        err: any;
    }>;
    deleted(user: UserDomain, oid: string): Promise<{
        result: UserDomain | null;
        err: any;
    }>;
    findAll(): Promise<{
        result: UserDomain[] | null;
        err: any;
    }>;
    findById(oid: string): Promise<{
        result: UserDomain | null;
        err: any;
    }>;
    advanceFilter(condition: any): Promise<{
        result: UserDomain[] | null;
        err: any;
    }>;
    findCountByCriteria(condition: any): Promise<{
        result: number | 0;
        err: any;
    }>;
    findByCriteriaPage(condition: any, page: number, pageSize: number): Promise<{
        result: UserDomain[] | null;
        err: any;
    }>;
}
