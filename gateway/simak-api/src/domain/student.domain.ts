import { Expose, Transform } from "class-transformer";
import { ObjectIdToString } from "../misc/mapper";

export class StudentDomain {
    @Expose()
    @Transform((params) =>
        params.obj._id ? String(params.obj._id) : ObjectIdToString(params)
    )
    id: string;

    @Expose()
    nim: string;

    @Expose()
    name: string;

    @Expose()
    studyProgram: string;

    @Expose()
    yearOfEntry: number;

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
