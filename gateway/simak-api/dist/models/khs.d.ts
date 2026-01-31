import { Document, Types } from 'mongoose';
import { Base } from './base';
export type KhsDocument = Khs & Document;
export declare class Khs extends Base {
    student: Types.ObjectId;
    semester: number;
    academicYear: string;
}
export declare const KhsSchema: import("mongoose").Schema<Khs, import("mongoose").Model<Khs, any, any, any, Document<unknown, any, Khs, any, {}> & Khs & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Khs, Document<unknown, {}, import("mongoose").FlatRecord<Khs>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Khs> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
