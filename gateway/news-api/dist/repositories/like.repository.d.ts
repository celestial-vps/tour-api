import { QueryRunner, Repository } from 'typeorm';
import { LikeEntity } from '../models/like.entity';
import { FilterLikeDto } from '../dtos/payload-like-dto';
export declare class LikeRepository {
    private readonly repo;
    constructor(repo: Repository<LikeEntity>);
    save(like: LikeEntity, queryRunner: QueryRunner): Promise<LikeEntity>;
    update(oid: string, payload: Partial<LikeEntity>, queryRunner: QueryRunner): Promise<LikeEntity>;
    delete(oid: string, queryRunner: QueryRunner): Promise<void>;
    findAll(): Promise<LikeEntity[]>;
    findById(oid: string): Promise<LikeEntity>;
    findByCriteriaPage(page: number, pageSize: number, condition: FilterLikeDto): Promise<{
        likes: LikeEntity[];
        count: number;
    }>;
    findCountByCriteria(condition: FilterLikeDto): Promise<number>;
    advanceFilter(condition: FilterLikeDto): Promise<LikeEntity[]>;
    private buildFilter;
}
