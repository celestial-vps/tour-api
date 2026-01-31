import { Document, Types } from 'mongoose';
import { Base } from './base';
export type KrsDocument = Krs & Document;
export declare class Krs extends Base {
    student: Types.ObjectId;
    semester: number;
    academicYear: string;
}
export declare const KrsSchema: import("mongoose").Schema<Krs, import("mongoose").Model<Krs, any, any, any, Document<unknown, any, Krs, any, {}> & Krs & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Krs, Document<unknown, {}, import("mongoose").FlatRecord<Krs>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Krs> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
