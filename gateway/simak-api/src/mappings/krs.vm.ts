import { KrsDomain } from "../domain/krs.domain";

 
export class KrsVm {
    oid: string;
    student: string;
    semester: number;
    academicYear: string;
    createdAt: Date;
    updatedAt?: Date;
}

export function toKrsResponse(plan: KrsDomain): KrsVm {
    return {
        oid: plan.id,
        student: String(plan.student),
        semester: plan.semester,
        academicYear: plan.academicYear,
        createdAt: plan.createdAt,
        updatedAt: plan.updatedAt,
    };
}

export function toKrsResponses(plans: KrsDomain[]): KrsVm[] {
    return plans.map(toKrsResponse);
}
