import { Expose, Transform, Type } from "class-transformer";
import { ObjectIdToString } from "../misc/mapper";

export class BankDomain {
    @Expose()
    @Transform((params) =>
        params.obj._id ? String(params.obj._id) : ObjectIdToString(params)
    )
    id: string;

    @Expose()
    bankCode: string;

    @Expose()
    bankName: string;

    @Expose()
    shortName: string;

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