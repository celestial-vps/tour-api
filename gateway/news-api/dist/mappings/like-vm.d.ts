import { LikeEntity } from '../models/like.entity';
import { UserMapping, UserVm } from './user-vm';
export declare class LikeVm {
    oid: string;
    articleId: string;
    user: UserVm;
    createdAt: Date;
}
export declare class LikeMapping {
    private readonly userMapping;
    constructor(userMapping: UserMapping);
    toLikeResponse(like: LikeEntity): LikeVm;
    toLikeResponses(likes: LikeEntity[]): LikeVm[];
}
