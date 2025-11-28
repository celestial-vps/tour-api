import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Base } from './base'; 
import { Krs } from './krs';
import { Course } from './course';

export type KrsDetailDocument = KrsDetail & Document;

@Schema()
export class KrsDetail extends Base {
  @Prop({ type: Types.ObjectId, ref: Krs.name, required: true })
  krsOid: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Course.name, required: true })
  course: Types.ObjectId;
}

export const KrsDetailSchema = SchemaFactory.createForClass(KrsDetail);
