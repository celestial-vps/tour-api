import { Model } from 'mongoose';
import { UserRoleDocument } from '../../models/user-role';
export declare class UserRoleSeeder {
    private readonly userRoleModel;
    constructor(userRoleModel: Model<UserRoleDocument>);
    seed(): Promise<void>;
}
