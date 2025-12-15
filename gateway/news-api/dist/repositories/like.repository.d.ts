import { QueryRunner, Repository } from 'typeorm';
import { Like } from '../models/like.entity';
import { FilterLikeDto } from '../dtos/payload-like-dto';
export declare class LikeRepository {
    private readonly likeRepository;
    constructor(likeRepository: Repository<Like>);
    save(like: Like, queryRunner: QueryRunner): Promise<Like>;
    update(oid: string, like: Like, queryRunner: QueryRunner): Promise<Like>;
    delete(oid: string, queryRunner: QueryRunner): Promise<void>;
    findAll(): Promise<Like[]>;
    findByCriteriaPage(page: number, pageSize: number, condition: FilterLikeDto): Promise<{
        likes: Like[];
        count: number;
    }>;
    findCountByCriteria(condition: FilterLikeDto): Promise<number>;
    advanceFilter(condition: FilterLikeDto): Promise<Like[]>;
    findById(oid: string): Promise<Like>;
}
