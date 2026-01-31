import { Injectable } from '@nestjs/common';
import { LikeEntity } from '../models/like.entity'; 
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

  toLikeResponse(like: LikeEntity): LikeVm {
    return {
      oid: like.oid,
      articleId: like.article.oid,
      user: this.userMapping.toUserResponse(like.user),
      createdAt: like.createdAt,
    };
  }

  toLikeResponses(likes: LikeEntity[]): LikeVm[] {
    return likes.map(l => this.toLikeResponse(l));
  }
}
