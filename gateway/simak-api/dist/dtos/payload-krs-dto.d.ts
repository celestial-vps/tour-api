export declare class FilterKrsDto {
    student?: string;
    semester?: number;
}
export declare class CreateKrsDto {
    student: string;
    semester: number;
    academicYear: string;
}
export declare class UpdateKrsDto extends CreateKrsDto {
}
