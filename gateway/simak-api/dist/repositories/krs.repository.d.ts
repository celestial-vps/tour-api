import { Model } from 'mongoose';
import { Krs, KrsDocument } from '../models/krs';
import { IKrsRepository } from '../repositories/ikrs.repository';
import { FilterKrsDto } from '../dtos/payload-krs-dto';
import { KrsDomain } from '../domain/krs.domain';
export declare class KrsRepository implements IKrsRepository {
    private krsModel;
    constructor(krsModel: Model<KrsDocument>);
    save(krs: Krs): Promise<{
        result: KrsDomain | null;
        err: any;
    }>;
    update(oid: string, krs: KrsDomain): Promise<{
        result: KrsDomain | null;
        err: any;
    }>;
    deleted(krs: KrsDomain, oid: string): Promise<{
        result: KrsDomain | null;
        err: any;
    }>;
    findAll(): Promise<{
        result: KrsDomain[] | null;
        err: any;
    }>;
    advanceFlter(condition: FilterKrsDto): Promise<{
        result: KrsDomain[] | null;
        err: any;
    }>;
    findById(oid: string): Promise<{
        result: KrsDomain | null;
        err: any;
    }>;
    findCountByCriteria(condition: FilterKrsDto): Promise<{
        result: number | 0;
        err: any;
    }>;
    findByCriteriaPage(condition: FilterKrsDto, page: number, pageSize: number): Promise<{
        result: KrsDomain[] | null;
        err: any;
    }>;
}
