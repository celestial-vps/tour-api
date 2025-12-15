import { StudentDomain } from "../domain/student.domain";
export declare class StudentVm {
    oid: string;
    nim: string;
    name: string;
    studyProgram: string;
    yearOfEntry: number;
    createdAt: Date;
    updatedAt?: Date;
}
export declare function toStudentResponse(student: StudentDomain): StudentVm;
export declare function toStudentResponses(students: StudentDomain[]): StudentVm[];
