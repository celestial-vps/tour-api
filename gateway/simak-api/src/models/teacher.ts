import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Base } from './base';

export type TeacherDocument = Teacher & Document;

@Schema()
export class Teacher extends Base {
  @Prop({ required: true })
  nidn: string; // Nomor induk pengajar

  @Prop({ required: true })
  name: string; // Nama dosen / teacher

  @Prop({ required: true })
  userOid: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
