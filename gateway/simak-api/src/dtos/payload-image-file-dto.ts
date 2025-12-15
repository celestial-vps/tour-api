import { IsString, IsOptional, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; 
import { ImageOwnerTypeEnum } from '../enums/image-owner-type.enum';

export class FilterImageFileDto {
    @ApiPropertyOptional({ example: 'banner.png', description: 'Nama file yang ingin difilter' })
    @IsOptional()
    @IsString()
    fileName?: string;

    @ApiPropertyOptional({ example: 'https://cdn.domain.com/uploads/banner.png', description: 'URL file' })
    @IsOptional()
    @IsString()
    fileUrl?: string;
}


export class CreateImageFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File yang akan diupload',
  })
  file: any; // tetap pakai any agar Swagger generate file input

//   @ApiProperty({ example: 'banner.png', description: 'Nama file upload' })
//   @IsString()
//   @IsNotEmpty()
//   fileName: string;

//   @ApiProperty({ example: 'https://cdn.domain.com/uploads/banner.png', description: 'URL file setelah upload' })
//   @IsString()
//   @IsNotEmpty()
//   fileUrl: string;

//   @ApiProperty({ example: '/uploads/banner.png', description: 'Path file di server' })
//   @IsString()
//   @IsNotEmpty()
//   filePath: string;

//   @ApiProperty({ example: 'image/png', description: 'MIME type file' })
//   @IsString()
//   @IsNotEmpty()
//   fileMime: string;

//   @ApiProperty({
//     description: 'Tipe pemilik file',
//     enum: ImageOwnerTypeEnum,
//     example: ImageOwnerTypeEnum.USER,
//   })
//   @IsString()
//   @IsIn(Object.values(ImageOwnerTypeEnum))
//   ownerType: ImageOwnerTypeEnum;

//   @ApiProperty({ example: 'user-uuid-1234', description: 'UUID user yang mengupload file' })
//   @IsString()
//   @IsNotEmpty()
//   userInserted: string;
}


export class UpdateImageFileDto {
    @ApiProperty({ example: 'uuid-image-1234', description: 'OID file yang akan diupdate' })
    @IsString()
    @IsNotEmpty()
    oid: string;

    @ApiPropertyOptional({ example: 'banner-new.png', description: 'Nama file baru (opsional)' })
    @IsOptional()
    @IsString()
    fileName?: string;

    @ApiPropertyOptional({ example: 'https://cdn.domain.com/uploads/banner-new.png', description: 'URL file baru (opsional)' })
    @IsOptional()
    @IsString()
    fileUrl?: string;

    @ApiPropertyOptional({ example: '/uploads/banner-new.png', description: 'Path file baru' })
    @IsOptional()
    @IsString()
    filePath?: string;

    @ApiPropertyOptional({ example: 'image/jpeg', description: 'MIME type baru' })
    @IsOptional()
    @IsString()
    fileMime?: string;

    @ApiProperty({ description: 'Tipe pemilik file', enum: ImageOwnerTypeEnum, example: ImageOwnerTypeEnum.USER })
    @IsString()
    @IsIn(Object.values(ImageOwnerTypeEnum))
    ownerType: ImageOwnerTypeEnum;

    @ApiPropertyOptional({ example: 'user-uuid-5678', description: 'UUID user yang terakhir mengubah' })
    @IsOptional()
    @IsString()
    lastUserId?: string;
}