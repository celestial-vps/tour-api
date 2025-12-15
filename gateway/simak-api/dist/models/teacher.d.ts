import { Document } from 'mongoose';
import { Base } from './base';
export type TeacherDocument = Teacher & Document;
export declare class Teacher extends Base {
    nidn: string;
    name: string;
    userOid: string;
}
export declare const TeacherSchema: import("mongoose").Schema<Teacher, import("mongoose").Model<Teacher, any, any, any, Document<unknown, any, Teacher, any, {}> & Teacher & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Teacher, Document<unknown, {}, import("mongoose").FlatRecord<Teacher>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Teacher> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
