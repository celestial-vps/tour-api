import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Base } from './base';

export type StudentDocument = Student & Document;

@Schema()
export class Student extends Base {
  @Prop({ required: true })
  nim: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  studyProgram: string; // prodi

  @Prop({ required: true })
  yearOfEntry: number; // angkatan

  @Prop({ required: true })
  userOid: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
