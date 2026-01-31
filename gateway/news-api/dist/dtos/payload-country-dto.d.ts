export declare class CreateCountryDto {
    countryCode: string;
    countryName: string;
    countryCurrency: string;
}
declare const UpdateCountryDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateCountryDto>>;
export declare class UpdateCountryDto extends UpdateCountryDto_base {
}
export declare class ParamsCountryDto {
    oid: string;
}
export declare class FilterCountryDto {
    countryCode?: string;
    countryName?: string;
    countryCurrency?: string;
    pageIndex?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: string;
}
export {};
