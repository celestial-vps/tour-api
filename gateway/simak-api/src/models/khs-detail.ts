import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Base } from './base'; 
import { Course } from './course';
import { Khs } from './khs';

export type KhsDetailDocument = KhsDetail & Document;

@Schema()
export class KhsDetail extends Base {
  @Prop({ type: Types.ObjectId, ref: Khs.name, required: true })
  studyResult: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Course.name, required: true })
  course: Types.ObjectId;

  @Prop({ required: true })
  gradeLetter: string; // nilai huruf: A/B/C...

  @Prop({ required: true })
  gradePoint: number; // nilai angka: 4.00, 3.00, dst
}

export const KhsDetailSchema = SchemaFactory.createForClass(KhsDetail);
