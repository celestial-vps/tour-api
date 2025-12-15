"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KrsVm = void 0;
exports.toKrsResponse = toKrsResponse;
exports.toKrsResponses = toKrsResponses;
class KrsVm {
    oid;
    student;
    semester;
    academicYear;
    createdAt;
    updatedAt;
}
exports.KrsVm = KrsVm;
function toKrsResponse(plan) {
    return {
        oid: plan.id,
        student: String(plan.student),
        semester: plan.semester,
        academicYear: plan.academicYear,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
    };
}
function toKrsResponses(plans) {
    return plans.map(toKrsResponse);
}
//# sourceMappingURL=krs.vm.js.map