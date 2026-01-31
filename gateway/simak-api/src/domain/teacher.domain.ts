import { Expose, Transform } from "class-transformer";
import { ObjectIdToString } from "../misc/mapper";

export class TeacherDomain {
    @Expose()
    @Transform((params) =>
        params.obj._id ? String(params.obj._id) : ObjectIdToString(params)
    )
    id: string;

    @Expose()
    userOid: string;

    @Expose()
    nidn: string;

    @Expose()
    name: string;

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
