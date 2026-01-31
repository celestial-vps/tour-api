import { CourseDomain } from "../domain/course.domain";
export declare class CourseVm {
    oid: string;
    courseCode: string;
    courseName: string;
    credits: number;
    teacher: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare function toCourseResponse(course: CourseDomain): CourseVm;
export declare function toCourseResponses(courses: CourseDomain[]): CourseVm[];
