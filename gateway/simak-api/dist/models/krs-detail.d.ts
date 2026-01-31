import { Document, Types } from 'mongoose';
import { Base } from './base';
export type KrsDetailDocument = KrsDetail & Document;
export declare class KrsDetail extends Base {
    krsOid: Types.ObjectId;
    course: Types.ObjectId;
}
export declare const KrsDetailSchema: import("mongoose").Schema<KrsDetail, import("mongoose").Model<KrsDetail, any, any, any, Document<unknown, any, KrsDetail, any, {}> & KrsDetail & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, KrsDetail, Document<unknown, {}, import("mongoose").FlatRecord<KrsDetail>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<KrsDetail> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
