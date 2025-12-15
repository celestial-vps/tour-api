import { TeacherDomain } from "../domain/teacher.domain";

 
export class TeacherVm {
    oid: string;
    nidn: string;
    name: string;
    createdAt: Date;
    updatedAt?: Date;
}

export function toTeacherResponse(teacher: TeacherDomain): TeacherVm {
    return {
        oid: teacher.id,
        nidn: teacher.nidn,
        name: teacher.name,
        createdAt: teacher.createdAt,
        updatedAt: teacher.updatedAt,
    };
}

export function toTeacherResponses(teachers: TeacherDomain[]): TeacherVm[] {
    return teachers.map(toTeacherResponse);
}
