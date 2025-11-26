import { Prop } from "@nestjs/mongoose";



const isMssql = process.env.NODE_ENV === 'local-mssql';

export abstract class Base {

    @Prop({ type: String })
    createdBy: string; // UUID field

    @Prop({ type: String })
    lastModifiedBy?: string; // Nullable UUID field

    @Prop({ type: String })
    deletedBy?: string; // Nullable UUID field

    @Prop({ type: String })
    deletedAt?: Date; // Timestamp field for soft delete

    @Prop({ type: String })
    createdAt: Date; // Timestamp field for creation time

    @Prop({ type: String })
    updatedAt?: Date;


}