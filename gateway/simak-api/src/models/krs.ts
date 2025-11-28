import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Base } from './base'; 
import { Student } from './student';

export type KrsDocument = Krs & Document;

@Schema()
export class Krs extends Base {
  @Prop({ type: Types.ObjectId, ref: Student.name, required: true })
  student: Types.ObjectId;

  @Prop({ required: true })
  semester: number;

  @Prop({ required: true })
  academicYear: string; // contoh: 2024/2025
}

export const KrsSchema = SchemaFactory.createForClass(Krs);
