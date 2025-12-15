import { Document, Types } from 'mongoose';
import { Base } from './base';
export type CourseDocument = Course & Document;
export declare class Course extends Base {
    courseCode: string;
    courseName: string;
    credits: number;
    teacher: Types.ObjectId;
}
export declare const CourseSchema: import("mongoose").Schema<Course, import("mongoose").Model<Course, any, any, any, Document<unknown, any, Course, any, {}> & Course & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Course, Document<unknown, {}, import("mongoose").FlatRecord<Course>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Course> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
