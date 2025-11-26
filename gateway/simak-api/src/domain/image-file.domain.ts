import { Expose, Transform, Type } from "class-transformer";
import { ObjectIdToString } from "../misc/mapper";

export class ImageFileDomain {
    @Expose()
    @Transform((params) =>
        params.obj._id ? String(params.obj._id) : ObjectIdToString(params)
    )
    id: string;

    @Expose()
    fileName?: string; // Nullable string field with a default value of null
    @Expose()
    filePath?: string; // Nullable string field with a default value of null
    @Expose()
    fileMime?: string; // Nullable string field with a default value of null
    @Expose()
    fileUrl?: string;

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