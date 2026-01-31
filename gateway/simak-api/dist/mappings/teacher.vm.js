"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherVm = void 0;
exports.toTeacherResponse = toTeacherResponse;
exports.toTeacherResponses = toTeacherResponses;
class TeacherVm {
    oid;
    nidn;
    name;
    createdAt;
    updatedAt;
}
exports.TeacherVm = TeacherVm;
function toTeacherResponse(teacher) {
    return {
        oid: teacher.id,
        nidn: teacher.nidn,
        name: teacher.name,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt,
    };
}
function toTeacherResponses(teachers) {
    return teachers.map(toTeacherResponse);
}
//# sourceMappingURL=teacher.vm.js.map