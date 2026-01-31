export declare class FilterStudentDto {
    nim?: string;
    name?: string;
}
export declare class CreateStudentDto {
    nim: string;
    name: string;
    studyProgram: string;
    yearOfEntry: number;
}
export declare class UpdateStudentDto extends CreateStudentDto {
}
