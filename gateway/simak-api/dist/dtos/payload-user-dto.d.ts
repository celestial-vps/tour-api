export declare class FilterUserDto {
    email: string;
}
export declare class RegisterDto {
    email: string;
    password: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    birthday: string;
    memberNumber: string;
    androidToken?: string;
    isActive: boolean;
    roleOid: string;
    activatedAt?: string | null;
}
export declare class UpdateUserDto extends CreateUserDto {
}
