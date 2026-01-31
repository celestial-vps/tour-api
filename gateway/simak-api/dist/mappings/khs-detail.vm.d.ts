import { KhsDetailDomain } from "../domain/khs-detail.domain";
export declare class KhsDetailVm {
    oid: string;
    studyResult: string;
    course: string;
    gradeLetter: string;
    gradePoint: number;
    createdAt: Date;
    updatedAt?: Date;
}
export declare function toKhsDetailResponse(detail: KhsDetailDomain): KhsDetailVm;
export declare function toKhsDetailResponses(details: KhsDetailDomain[]): KhsDetailVm[];
