import { Base } from './base';
export type ImageFileDocument = ImageFile & Document;
export declare class ImageFile extends Base {
    fileName?: string;
    filePath?: string;
    fileMime?: string;
    fileUrl?: string;
}
export declare const ImageFileSchema: import("mongoose").Schema<ImageFile, import("mongoose").Model<ImageFile, any, any, any, import("mongoose").Document<unknown, any, ImageFile, any, {}> & ImageFile & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ImageFile, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<ImageFile>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ImageFile> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
