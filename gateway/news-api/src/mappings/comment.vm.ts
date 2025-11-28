import { Injectable } from '@nestjs/common';
import { Comment } from '../models/comment.entity'; 
import { UserMapping, UserVm } from './user-vm';

export class CommentVm {
  oid: string;
  articleId: string;
  user: UserVm;
  content: string;
  status: string;
  createdAt: Date;
  updatedAt?: Date;
}

@Injectable()
export class CommentMapping {

  constructor(private readonly userMapping: UserMapping) {}

  toCommentResponse(comment: Comment): CommentVm {
    return {
      id: comment.id,
      articleId: comment.article.id,
      user: this.userMapping.toUserResponse(comment.user),
      content: comment.content,
      status: comment.status,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }

  toCommentResponses(comments: Comment[]): CommentVm[] {
    return comments.map(c => this.toCommentResponse(c));
  }
}
