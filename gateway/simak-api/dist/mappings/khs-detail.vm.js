"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KhsDetailVm = void 0;
exports.toKhsDetailResponse = toKhsDetailResponse;
exports.toKhsDetailResponses = toKhsDetailResponses;
class KhsDetailVm {
    oid;
    studyResult;
    course;
    gradeLetter;
    gradePoint;
    createdAt;
    updatedAt;
}
exports.KhsDetailVm = KhsDetailVm;
function toKhsDetailResponse(detail) {
    return {
        oid: detail.id,
        studyResult: String(detail.studyResult),
        course: String(detail.course),
        gradeLetter: detail.gradeLetter,
        gradePoint: detail.gradePoint,
        createdAt: detail.createdAt,
        updatedAt: detail.updatedAt,
    };
}
function toKhsDetailResponses(details) {
    return details.map(toKhsDetailResponse);
}
//# sourceMappingURL=khs-detail.vm.js.map