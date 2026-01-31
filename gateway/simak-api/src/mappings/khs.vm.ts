import { KhsDomain } from "../domain/khs.domain";

 
export class KhsVm {
    oid: string;
    student: string;
    semester: number;
    academicYear: string;
    createdAt: Date;
    updatedAt?: Date;
}

export function toKhsResponse(result: KhsDomain): KhsVm {
    return {
        oid: result.id,
        student: String(result.student),
        semester: result.semester,
        academicYear: result.academicYear,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
    };
}

export function toKhsResponses(results: KhsDomain[]): KhsVm[] {
    return results.map(toKhsResponse);
}
