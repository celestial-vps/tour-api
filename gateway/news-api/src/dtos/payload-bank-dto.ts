import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
// import { PaginationDto } from './pagging-dto';
import { ApiBaseResponseProps } from './base/api-base-response.decorator';
import { PaginationInfo } from './base/pagination-info-dto';
 
/** ---------------- Filter DTO ---------------- */
export class FilterBankDto {
    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'B001', description: 'Bank code', required: false })
    bankCode?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ example: 'Bank Mandiri', description: 'Bank name', required: false })
    bankName?: string;
}

/** ---------------- Create DTO ---------------- */
export class CreateBankDto {
    @ApiProperty({ example: 'B001', description: 'Bank code' })
    @IsString()
    @IsNotEmpty()
    bankCode: string;

    @ApiProperty({ example: 'My Bank', description: 'Bank name' })
    @IsString()
    @IsNotEmpty()
    bankName: string;

    @ApiProperty({ example: 'MB', description: 'Short name of bank' })
    @IsString()
    @IsNotEmpty()
    shortName: string;
}

/** ---------------- Update DTO ---------------- */
export class UpdateBankDto {
    @ApiProperty({ example: 'B001', description: 'Bank code' })
    @IsString()
    @IsNotEmpty()
    bankCode: string;

    @ApiProperty({ example: 'My Bank', description: 'Bank name' })
    @IsString()
    @IsNotEmpty()
    bankName: string;

    @ApiProperty({ example: 'MB', description: 'Short name of bank' })
    @IsString()
    @IsNotEmpty()
    shortName: string;
}

/** ---------------- Response DTO ---------------- */
export class ResponseBankVm {
    @ApiProperty({ example: '1', description: 'OID bank' })
    oid: string;

    @ApiProperty({ example: 'B001', description: 'Bank code' })
    bankCode: string;

    @ApiProperty({ example: 'Bank Mandiri', description: 'Bank name' })
    bankName: string;

    @ApiProperty({ example: 'Mandiri', description: 'Short name' })
    shortName: string;

    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Created at' })
    createdAt: Date;

    @ApiProperty({ example: '2025-12-20T08:00:00.000Z', description: 'Updated at', required: false })
    updatedAt?: Date;
}

/** ---------------- Success Response DTO for Bank ---------------- */
export class SuccessBankResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: [ResponseBankVm], description: 'List of banks' })
    data: ResponseBankVm[] = [];
}


export class SuccessBankObjectResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiBaseResponseProps() total: number;
    @ApiProperty({ type: ResponseBankVm, description: 'Bank object' })
    data: ResponseBankVm;
}


export class SuccessBankPaginatedResponseDto {
    @ApiBaseResponseProps() resultCode: string;
    @ApiBaseResponseProps() httpStatus: number;
    @ApiBaseResponseProps() message: string;
    @ApiProperty({ type: PaginationInfo })
    pagination: PaginationInfo;
    @ApiProperty({ type: [ResponseBankVm] })
    data: ResponseBankVm[];
}