import { Expose, Transform, Type } from "class-transformer";
import { ObjectIdToString } from "../misc/mapper";

export class EmployeeDomain {
    @Expose()
    @Transform((params) =>
        params.obj._id ? String(params.obj._id) : ObjectIdToString(params)
    )
    id: string;

    @Expose()
    firstName?: string; // Nullable string field
    @Expose()
    middleName?: string; // Nullable string field
    @Expose()
    lastName?: string; // Nullable string field
    @Expose()
    jobTitle: string; // Non-nullable string field
    @Expose()
    hireDate: string; // Date without time (DateOnly)
    @Expose()
    recruitedDate?: Date; // Date with time, nullable, default to current timestamp

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