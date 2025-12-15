export declare class FilterStudyPlanDto {
    student?: string;
    semester?: number;
}
export declare class CreateStudyPlanDto {
    student: string;
    semester: number;
    academicYear: string;
}
export declare class UpdateStudyPlanDto extends CreateStudyPlanDto {
}
