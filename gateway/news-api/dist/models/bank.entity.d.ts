import { BaseEntity } from './base/base';
export declare class Bank extends BaseEntity {
    oid: string;
    bankCode: string;
    bankName?: string;
    shortName?: string;
}
