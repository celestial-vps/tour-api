import { IsString } from 'class-validator';

export class MessageVm {
  @IsString()
  value: string;

  @IsString()
  name: string;
}
