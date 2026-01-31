import { KhsDomain } from "../domain/khs.domain";
export declare class KhsVm {
    oid: string;
    student: string;
    semester: number;
    academicYear: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare function toKhsResponse(result: KhsDomain): KhsVm;
export declare function toKhsResponses(results: KhsDomain[]): KhsVm[];
