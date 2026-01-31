"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KrsDetailVm = void 0;
exports.toKrsDetailResponse = toKrsDetailResponse;
exports.toKrsDetailResponses = toKrsDetailResponses;
class KrsDetailVm {
    oid;
    studyPlan;
    course;
    createdAt;
    updatedAt;
}
exports.KrsDetailVm = KrsDetailVm;
function toKrsDetailResponse(detail) {
    return {
        oid: detail.id,
        studyPlan: String(detail.studyPlan),
        course: String(detail.course),
        createdAt: detail.createdAt,
        updatedAt: detail.updatedAt,
    };
}
function toKrsDetailResponses(details) {
    return details.map(toKrsDetailResponse);
}
//# sourceMappingURL=krs-detaill.vm.js.map