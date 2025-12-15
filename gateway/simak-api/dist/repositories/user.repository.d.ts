import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user';
import { IUserRepository } from '../repositories/iuser.repository';
import { FilterUserDto } from '../dtos/payload-user-dto';
import { UserDomain } from '../domain/user.domain';
export declare class UserRepository implements IUserRepository {
    private userModel;
    constructor(userModel: Model<UserDocument>);
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
    advanceFilter(condition: FilterUserDto): Promise<{
        result: UserDomain[] | null;
        err: any;
    }>;
    findById(oid: string): Promise<{
        result: UserDomain | null;
        err: any;
    }>;
    findCountByCriteria(condition: FilterUserDto): Promise<{
        result: number | 0;
        err: any;
    }>;
    findByCriteriaPage(condition: FilterUserDto, page: number, pageSize: number): Promise<{
        result: UserDomain[] | null;
        err: any;
    }>;
}
