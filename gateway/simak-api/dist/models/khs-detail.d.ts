import { Document, Types } from 'mongoose';
import { Base } from './base';
export type KhsDetailDocument = KhsDetail & Document;
export declare class KhsDetail extends Base {
    studyResult: Types.ObjectId;
    course: Types.ObjectId;
    gradeLetter: string;
    gradePoint: number;
}
export declare const KhsDetailSchema: import("mongoose").Schema<KhsDetail, import("mongoose").Model<KhsDetail, any, any, any, Document<unknown, any, KhsDetail, any, {}> & KhsDetail & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, KhsDetail, Document<unknown, {}, import("mongoose").FlatRecord<KhsDetail>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<KhsDetail> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
