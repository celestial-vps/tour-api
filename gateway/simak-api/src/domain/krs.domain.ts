import { Expose, Transform } from "class-transformer";
import { ObjectIdToString } from "../misc/mapper";

export class KrsDomain {
    @Expose()
    @Transform((params) =>
        params.obj._id ? String(params.obj._id) : ObjectIdToString(params)
    )
    id: string;

    @Expose()
    student: string;

    @Expose()
    semester: number;

    @Expose()
    academicYear: string;

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
