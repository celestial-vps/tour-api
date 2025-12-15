import { Like } from '../models/like.entity';
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
    toLikeResponse(like: Like): LikeVm;
    toLikeResponses(likes: Like[]): LikeVm[];
}
