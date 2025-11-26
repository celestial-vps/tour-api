
import { Base } from './base';
import { User } from './user'; // Adjust the path to your User entity
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type UserRoleDocument = UserRole & Document;


@Schema()
export class UserRole extends Base{
  @Prop({ required: true })
  roleName: string; // Non-nullable string field with unique constraint
  @Prop({ required: true })
  targetType?: string; // Nullable string field
  @Prop({ required: true })
  isAdministrative: boolean; // Non-nullable boolean field
  @Prop({ required: true })
  readState: boolean; // Non-nullable boolean field
  @Prop({ required: true })
  writeState: boolean; // Non-nullable boolean field
  @Prop({ required: true })
  createState: boolean; // Non-nullable boolean field
  @Prop({ required: true })
  deleteState: boolean; // Non-nullable boolean field
  @Prop({ required: true })
  navigateState: boolean; 
}


export const UserRoleSchema = SchemaFactory.createForClass(UserRole);

// 🔹 Baru tambahkan unique compound index
UserRoleSchema.index(
  { roleName: 1, targetType: 1 },
  { unique: true }
);
