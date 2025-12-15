
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class FilterBankDto {
    @ApiProperty({ example: 'B001', description: 'Bank code' })
    @IsOptional()
    @IsString()
    bankCode?: string;

    @ApiProperty({ example: 'My Bank', description: 'Bank name' })
    @IsString()
    bankName: string;
}

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
