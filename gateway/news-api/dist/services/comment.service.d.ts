import { CommentRepository } from '../repositories/comment.repository';
import { CreateCommentDto, FilterCommentDto, UpdateCommentDto } from '../dtos/payload-comment-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { CommentMapping, CommentVm } from '../mappings/comment-vm';
export declare class CommentService {
    private readonly commentRepository;
    private readonly commentMapping;
    private readonly dataSource;
    constructor(commentRepository: CommentRepository, commentMapping: CommentMapping, dataSource: DataSource);
    create(commentdto: CreateCommentDto, userOid: string): Promise<MessageVm>;
    update(oid: string, commentdto: UpdateCommentDto, userOid: string): Promise<MessageVm>;
    deleted(oid: string, userOid: string): Promise<MessageVm>;
    findAll(): Promise<CommentVm[]>;
    findPage(page: number, pageSize: number, condition: FilterCommentDto): Promise<{
        comments: CommentVm[];
        count: number;
    }>;
    findById(oid: string): Promise<CommentVm>;
}
