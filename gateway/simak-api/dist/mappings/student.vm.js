"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentVm = void 0;
exports.toStudentResponse = toStudentResponse;
exports.toStudentResponses = toStudentResponses;
class StudentVm {
    oid;
    nim;
    name;
    studyProgram;
    yearOfEntry;
    createdAt;
    updatedAt;
}
exports.StudentVm = StudentVm;
function toStudentResponse(student) {
    return {
        oid: student.id,
        nim: student.nim,
        name: student.name,
        studyProgram: student.studyProgram,
        yearOfEntry: student.yearOfEntry,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
    };
}
function toStudentResponses(students) {
    return students.map(toStudentResponse);
}
//# sourceMappingURL=student.vm.js.map