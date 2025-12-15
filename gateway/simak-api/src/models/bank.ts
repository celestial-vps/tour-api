import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base } from './base';
export type BankDocument = Bank & Document;

@Schema()
export class Bank extends Base{  
  @Prop({ required: true })
  bankCode: string;
  @Prop({ required: true })
  bankName?: string;
  @Prop({ required: true })
  shortName?: string;
 

}
export const BankSchema = SchemaFactory.createForClass(Bank);
