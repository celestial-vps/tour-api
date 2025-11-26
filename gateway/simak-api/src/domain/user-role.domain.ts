import { Expose, Transform, Type } from "class-transformer";
import { ObjectIdToString } from "../misc/mapper";

export class UserRoleDomain {
    @Expose()
    @Transform((params) =>
        params.obj._id ? String(params.obj._id) : ObjectIdToString(params)
    )
    id: string;

    @Expose()
    roleName: string; // Non-nullable string field with unique constraint
    @Expose()
    targetType?: string; // Nullable string field
    @Expose()
    isAdministrative: boolean; // Non-nullable boolean field
    @Expose()
    readState: boolean; // Non-nullable boolean field
    @Expose()
    writeState: boolean; // Non-nullable boolean field
    @Expose()
    createState: boolean; // Non-nullable boolean field
    @Expose()
    deleteState: boolean; // Non-nullable boolean field
    @Expose()
    navigateState: boolean;

    @Expose()
    description?: string;

    @Expose()
    createdBy: string;

    @Expose()
    createdAt: Date;

    @Expose()
    lastModifiedBy?: string;

    @Expose()
    updatedAt?: Date;

    @Expose()
    deletedBy?: string;

    @Expose()
    deletedAt?: Date;

}