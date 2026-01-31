import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Base } from './base'; 
import { Student } from './student';

export type KhsDocument = Khs & Document;

@Schema()
export class Khs extends Base {
  @Prop({ type: Types.ObjectId, ref: Student.name, required: true })
  student: Types.ObjectId;

  @Prop({ required: true })
  semester: number;

  @Prop({ required: true })
  academicYear: string;
}

export const KhsSchema = SchemaFactory.createForClass(Khs);
