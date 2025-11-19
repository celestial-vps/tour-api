
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class FilterBankDto {
    @IsOptional()
    @IsString()
    bankCode?: string;

    @IsString()
    bankName: string;
}
 
export class CreateBankDto {
    @IsString()
    @IsNotEmpty()
    bankCode: string;

    @IsString()
    @IsNotEmpty()
    bankName: string;

    @IsString()
    @IsNotEmpty()
    shortName: string;
}

export class UpdateBankDto {
    @IsString()
    @IsNotEmpty()
    bankCode: string;

    @IsString()
    @IsNotEmpty()
    bankName: string;

    @IsString()
    @IsNotEmpty()
    shortName: string;
}
