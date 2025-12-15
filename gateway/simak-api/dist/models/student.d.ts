import { Document } from 'mongoose';
import { Base } from './base';
export type StudentDocument = Student & Document;
export declare class Student extends Base {
    nim: string;
    name: string;
    studyProgram: string;
    yearOfEntry: number;
    userOid: string;
}
export declare const StudentSchema: import("mongoose").Schema<Student, import("mongoose").Model<Student, any, any, any, Document<unknown, any, Student, any, {}> & Student & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Student, Document<unknown, {}, import("mongoose").FlatRecord<Student>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Student> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
