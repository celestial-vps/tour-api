import { Expose, Transform, Type } from "class-transformer";
import { ObjectIdToString } from "../misc/mapper";

export class UserDomain {
    @Expose()
    @Transform((params) =>
        params.obj._id ? String(params.obj._id) : ObjectIdToString(params)
    )
    id: string;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    password: string;

    @Expose()
    birthday?: Date; 
    @Expose()
    memberNumber?: string; 
    @Expose()
    androidToken?: string; 
    @Expose()
    expiredTime?: string; 
    @Expose()
    isActive?: boolean;
    @Expose()
    activatedAt?: Date; 
    @Expose()
    roleOid: string;  
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