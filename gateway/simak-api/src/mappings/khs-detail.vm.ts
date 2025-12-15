import { KhsDetailDomain } from "../domain/khs-detail.domain";

 

export class KhsDetailVm {
    oid: string;
    studyResult: string;
    course: string;
    gradeLetter: string;
    gradePoint: number;
    createdAt: Date;
    updatedAt?: Date;
}

export function toKhsDetailResponse(detail: KhsDetailDomain): KhsDetailVm {
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

export function toKhsDetailResponses(details: KhsDetailDomain[]): KhsDetailVm[] {
    return details.map(toKhsDetailResponse);
}
