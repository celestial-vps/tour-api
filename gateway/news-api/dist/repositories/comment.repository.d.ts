import { QueryRunner, Repository } from 'typeorm';
import { Comment } from '../models/comment.entity';
import { FilterCommentDto } from '../dtos/payload-comment.dto';
export declare class CommentRepository {
    private readonly commentRepository;
    constructor(commentRepository: Repository<Comment>);
    save(comment: Comment, queryRunner: QueryRunner): Promise<Comment>;
    update(oid: string, comment: Comment, queryRunner: QueryRunner): Promise<Comment>;
    delete(oid: string, queryRunner: QueryRunner): Promise<void>;
    findAll(): Promise<Comment[]>;
    findByCriteriaPage(page: number, pageSize: number, condition: FilterCommentDto): Promise<{
        comments: Comment[];
        count: number;
    }>;
    findCountByCriteria(condition: FilterCommentDto): Promise<number>;
    advanceFilter(condition: FilterCommentDto): Promise<Comment[]>;
    findById(oid: string): Promise<Comment>;
}
