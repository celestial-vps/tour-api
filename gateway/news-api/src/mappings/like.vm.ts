import { Injectable } from '@nestjs/common';
import { Like } from '../models/like.entity'; 
import { UserMapping, UserVm } from './user-vm';

export class LikeVm {
  oid: string;
  articleId: string;
  user: UserVm;
  createdAt: Date;
}

@Injectable()
export class LikeMapping {

  constructor(private readonly userMapping: UserMapping) {}

  toLikeResponse(like: Like): LikeVm {
    return {
      id: like.id,
      articleId: like.article.id,
      user: this.userMapping.toUserResponse(like.user),
      createdAt: like.createdAt,
    };
  }

  toLikeResponses(likes: Like[]): LikeVm[] {
    return likes.map(l => this.toLikeResponse(l));
  }
}
