export declare class FilterStudyResultDto {
    student?: string;
    semester?: number;
}
export declare class CreateStudyResultDto {
    student: string;
    semester: number;
    academicYear: string;
}
export declare class UpdateStudyResultDto extends CreateStudyResultDto {
}
