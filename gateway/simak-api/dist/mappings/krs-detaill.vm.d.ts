import { KrsDetailDomain } from "../domain/krs-detail.domain";
export declare class KrsDetailVm {
    oid: string;
    studyPlan: string;
    course: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare function toKrsDetailResponse(detail: KrsDetailDomain): KrsDetailVm;
export declare function toKrsDetailResponses(details: KrsDetailDomain[]): KrsDetailVm[];
