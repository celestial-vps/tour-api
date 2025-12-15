import { Base } from './base';
export type BankDocument = Bank & Document;
export declare class Bank extends Base {
    bankCode: string;
    bankName?: string;
    shortName?: string;
}
export declare const BankSchema: import("mongoose").Schema<Bank, import("mongoose").Model<Bank, any, any, any, import("mongoose").Document<unknown, any, Bank, any, {}> & Bank & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Bank, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Bank>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Bank> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
