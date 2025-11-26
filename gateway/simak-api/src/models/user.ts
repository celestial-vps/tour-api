
import { Base } from './base';
import { UserRole } from './user-role';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type UserDocument = User & Document;

@Schema()
export class User extends Base {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  email: string; // Non-nullable string field with unique constraint
  @Prop({ required: true })
  password: string; // Non-nullable string field 
  @Prop({ required: true })
  androidToken?: string; // Nullable string field
  @Prop({ required: true })
  expiredTime?: string; // Nullable string field
  @Prop({ required: true })
  isActive?: boolean; // Nullable boolean field
  @Prop({ required: false })
  activatedAt?: Date; // Nullable date field
  @Prop({ required: true })
  roleOid: string; // Non-nullable UUID field
  @Prop({ required: true })
  description?: string; // Nullable text field with a default value of null
  @Prop({ required: true })
  userRole: UserRole;
}
export const UserSchema = SchemaFactory.createForClass(User);

