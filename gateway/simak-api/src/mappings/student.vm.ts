import { StudentDomain } from "../domain/student.domain";

 
 
export class StudentVm {
    oid: string;
    nim: string;
    name: string;
    studyProgram: string;
    yearOfEntry: number;
    createdAt: Date;
    updatedAt?: Date;
}

export function toStudentResponse(student: StudentDomain): StudentVm {
    return {
        oid: student.id,
        nim: student.nim,
        name: student.name,
        studyProgram: student.studyProgram,
        yearOfEntry: student.yearOfEntry,
        createdAt: student.createdAt,
        updatedAt: student.updatedAt,
    };
}

export function toStudentResponses(students: StudentDomain[]): StudentVm[] {
    return students.map(toStudentResponse);
}
