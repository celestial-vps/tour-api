import { CourseDomain } from "../domain/course.domain";

 
export class CourseVm {
    oid: string;
    courseCode: string;
    courseName: string;
    credits: number;
    teacher: string; // ObjectId
    createdAt: Date;
    updatedAt?: Date;
}

export function toCourseResponse(course: CourseDomain): CourseVm {
    return {
        oid: course.id,
        courseCode: course.courseCode,
        courseName: course.courseName,
        credits: course.credits,
        teacher: String(course.teacher),
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
    };
}

export function toCourseResponses(courses: CourseDomain[]): CourseVm[] {
    return courses.map(toCourseResponse);
}
