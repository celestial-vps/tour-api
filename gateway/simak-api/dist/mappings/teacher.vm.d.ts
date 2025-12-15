import { TeacherDomain } from "../domain/teacher.domain";
export declare class TeacherVm {
    oid: string;
    nidn: string;
    name: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare function toTeacherResponse(teacher: TeacherDomain): TeacherVm;
export declare function toTeacherResponses(teachers: TeacherDomain[]): TeacherVm[];
