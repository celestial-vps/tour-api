"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KhsVm = void 0;
exports.toKhsResponse = toKhsResponse;
exports.toKhsResponses = toKhsResponses;
class KhsVm {
    oid;
    student;
    semester;
    academicYear;
    createdAt;
    updatedAt;
}
exports.KhsVm = KhsVm;
function toKhsResponse(result) {
    return {
        oid: result.id,
        student: String(result.student),
        semester: result.semester,
        academicYear: result.academicYear,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
    };
}
function toKhsResponses(results) {
    return results.map(toKhsResponse);
}
//# sourceMappingURL=khs.vm.js.map