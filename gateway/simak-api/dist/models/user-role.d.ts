import { Base } from './base';
export type UserRoleDocument = UserRole & Document;
export declare class UserRole extends Base {
    roleName: string;
    targetType?: string;
    isAdministrative: boolean;
    readState: boolean;
    writeState: boolean;
    createState: boolean;
    deleteState: boolean;
    navigateState: boolean;
}
export declare const UserRoleSchema: import("mongoose").Schema<UserRole, import("mongoose").Model<UserRole, any, any, any, import("mongoose").Document<unknown, any, UserRole, any, {}> & UserRole & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserRole, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<UserRole>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<UserRole> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
