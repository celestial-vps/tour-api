import { KrsDetailDomain } from "../domain/krs-detail.domain";

 
export class KrsDetailVm {
    oid: string;
    studyPlan: string;
    course: string;
    createdAt: Date;
    updatedAt?: Date;
}

export function toKrsDetailResponse(detail: KrsDetailDomain): KrsDetailVm {
    return {
        oid: detail.id,
        studyPlan: String(detail.studyPlan),
        course: String(detail.course),
        createdAt: detail.createdAt,
        updatedAt: detail.updatedAt,
    };
}

export function toKrsDetailResponses(details: KrsDetailDomain[]): KrsDetailVm[] {
    return details.map(toKrsDetailResponse);
}
