import { KrsDomain } from '../domain/krs.domain';
import { Krs } from '../models/krs';

export interface IKrsRepository {
    save(krs: Krs): Promise<{ result: KrsDomain | null ; err: any }>
    update(oid: string, krs: KrsDomain): Promise<{ result: KrsDomain | null; err: any }>;
    deleted(krs: KrsDomain, oid: string): Promise<{ result: KrsDomain | null; err: any }>;
    findAll(): Promise<{ result: KrsDomain[] | null; err: any }>;
    findById(oid: string): Promise<{ result: KrsDomain | null; err: any }>;
    advanceFlter(condition: any): Promise<{ result: KrsDomain[] | null; err: any }>;
    findCountByCriteria(condition: any): Promise<{ result: number | 0; err: any }>;
    findByCriteriaPage(condition: any, page: number, pageSize: number): Promise<{ result: KrsDomain[] | null; err: any }>;
}
