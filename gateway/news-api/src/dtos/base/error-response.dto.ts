import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  code: number;

  @ApiProperty({ example: 400 })
  status: number;

  @ApiProperty({ example: 'Bad Request' })
  message: string;

  @ApiProperty({ type: [String], required: false, description: 'Optional error details' })
  data?: string[];
}
