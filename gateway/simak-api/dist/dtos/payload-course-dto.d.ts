export declare class FilterCourseDto {
    courseCode?: string;
    courseName?: string;
}
export declare class CreateCourseDto {
    courseCode: string;
    courseName: string;
    credits: number;
}
export declare class UpdateCourseDto extends CreateCourseDto {
}
