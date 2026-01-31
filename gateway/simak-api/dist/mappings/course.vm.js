"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseVm = void 0;
exports.toCourseResponse = toCourseResponse;
exports.toCourseResponses = toCourseResponses;
class CourseVm {
    oid;
    courseCode;
    courseName;
    credits;
    teacher;
    createdAt;
    updatedAt;
}
exports.CourseVm = CourseVm;
function toCourseResponse(course) {
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
function toCourseResponses(courses) {
    return courses.map(toCourseResponse);
}
//# sourceMappingURL=course.vm.js.map