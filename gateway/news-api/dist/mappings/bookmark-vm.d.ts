import { Bookmark } from '../models/bookmark.entity';
import { UserMapping, UserVm } from './user-vm';
export declare class BookmarkVm {
    oid: string;
    articleId: string;
    user: UserVm;
    createdAt: Date;
}
export declare class BookmarkMapping {
    private readonly userMapping;
    constructor(userMapping: UserMapping);
    toBookmarkResponse(bookmark: Bookmark): BookmarkVm;
    toBookmarkResponses(bookmarks: Bookmark[]): BookmarkVm[];
}
