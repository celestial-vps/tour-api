import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Base } from './base';
export type ImageFileDocument = ImageFile & Document;

@Schema()
export class ImageFile  extends Base{
  @Prop({ required: true })
  fileName?: string; // Nullable string field with a default value of null
  @Prop({ required: true })
  filePath?: string; // Nullable string field with a default value of null
  @Prop({ required: true })
  fileMime?: string; // Nullable string field with a default value of null
  @Prop({ required: true })
  fileUrl?: string; // Nullable string field with a default value of null
}
export const ImageFileSchema = SchemaFactory.createForClass(ImageFile);
