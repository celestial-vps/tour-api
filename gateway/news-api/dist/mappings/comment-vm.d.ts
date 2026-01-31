import { Comment } from '../models/comment.entity';
import { UserMapping, UserVm } from './user-vm';
export declare class CommentVm {
    oid: string;
    articleId: string;
    user: UserVm;
    content: string;
    status: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class CommentMapping {
    private readonly userMapping;
    constructor(userMapping: UserMapping);
    toCommentResponse(comment: Comment): CommentVm;
    toCommentResponses(comments: Comment[]): CommentVm[];
}
