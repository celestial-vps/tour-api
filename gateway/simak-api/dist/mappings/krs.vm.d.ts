import { KrsDomain } from "../domain/krs.domain";
export declare class KrsVm {
    oid: string;
    student: string;
    semester: number;
    academicYear: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare function toKrsResponse(plan: KrsDomain): KrsVm;
export declare function toKrsResponses(plans: KrsDomain[]): KrsVm[];
