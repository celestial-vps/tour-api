import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
    @ApiProperty({ example: 'value' })
    value: string;

    @ApiProperty({ example: 'name' })
    name: string;
}
