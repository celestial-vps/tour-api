import { Injectable } from '@nestjs/common';
import { Bookmark } from '../models/bookmark.entity'; 
import { UserMapping, UserVm } from './user-vm';

export class BookmarkVm {
  oid: string;
  articleId: string;
  user: UserVm;
  createdAt: Date;
}

@Injectable()
export class BookmarkMapping {

  constructor(private readonly userMapping: UserMapping) {}

  toBookmarkResponse(bookmark: Bookmark): BookmarkVm {
    return {
      oid: bookmark.oid,
      articleId: bookmark.article.oid,
      user: this.userMapping.toUserResponse(bookmark.user),
      createdAt: bookmark.createdAt,
    };
  }

  toBookmarkResponses(bookmarks: Bookmark[]): BookmarkVm[] {
    return bookmarks.map(b => this.toBookmarkResponse(b));
  }
}
