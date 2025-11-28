import { Expose, Transform } from "class-transformer";
import { ObjectIdToString } from "../misc/mapper";

export class KhsDetailDomain {
    @Expose()
    @Transform((params) =>
        params.obj._id ? String(params.obj._id) : ObjectIdToString(params)
    )
    id: string;

    @Expose()
    studyResult: string;

    @Expose()
    course: string;

    @Expose()
    gradeLetter: string;

    @Expose()
    gradePoint: number;

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
