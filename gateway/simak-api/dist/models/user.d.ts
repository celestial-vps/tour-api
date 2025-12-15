import { Base } from './base';
import { UserRole } from './user-role';
export type UserDocument = User & Document;
export declare class User extends Base {
    name: string;
    email: string;
    password: string;
    androidToken?: string;
    expiredTime?: string;
    isActive?: boolean;
    activatedAt?: Date;
    roleOid: string;
    description?: string;
    userRole: UserRole;
}
export declare const UserSchema: import("mongoose").Schema<User, import("mongoose").Model<User, any, any, any, import("mongoose").Document<unknown, any, User, any, {}> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<User>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
