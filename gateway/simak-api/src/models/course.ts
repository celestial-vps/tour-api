import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Base } from './base'; 
import { Teacher } from './teacher';

export type CourseDocument = Course & Document;

@Schema()
export class Course extends Base {
  @Prop({ required: true })
  courseCode: string; // kode_matkul

  @Prop({ required: true })
  courseName: string; // nama_matkul

  @Prop({ required: true })
  credits: number; // sks

  @Prop({ type: Types.ObjectId, ref: Teacher.name, required: true })
  teacher: Types.ObjectId; // dosen pengajar
}

export const CourseSchema = SchemaFactory.createForClass(Course);
