import { ApiProperty } from '@nestjs/swagger'; 
import { MessageDto } from './message-dto';

export class SuccessResponseMessageDto<T> {
  @ApiProperty({ example: 200 })
  code: number;

  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Success' })
  message: string;

  @ApiProperty({ required: false })
  total?: number;


  @ApiProperty({ type: MessageDto })
  data: MessageDto;
}
