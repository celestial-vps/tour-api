import { LikeRepository } from '../repositories/like.repository';
import { CreateLikeDto, FilterLikeDto, UpdateLikeDto } from '../dtos/payload-like-dto';
import { DataSource } from 'typeorm';
import { MessageVm } from '../mappings/message-vm';
import { LikeMapping, LikeVm } from '../mappings/like-vm';
export declare class LikeService {
    private readonly likeRepository;
    private readonly likeMapping;
    private readonly dataSource;
    constructor(likeRepository: LikeRepository, likeMapping: LikeMapping, dataSource: DataSource);
    create(likedto: CreateLikeDto, userOid: string): Promise<MessageVm>;
    update(oid: string, likedto: UpdateLikeDto, userOid: string): Promise<MessageVm>;
    deleted(oid: string, userOid: string): Promise<MessageVm>;
    findAll(): Promise<LikeVm[]>;
    findPage(page: number, pageSize: number, condition: FilterLikeDto): Promise<{
        likes: LikeVm[];
        count: number;
    }>;
    findById(oid: string): Promise<LikeVm>;
}
