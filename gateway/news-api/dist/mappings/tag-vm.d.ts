import { Tag } from '../models/tag.entity';
export declare class TagVm {
    oid: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class TagMapping {
    toTagResponse(tag: Tag): TagVm;
    toTagResponses(tags: Tag[]): TagVm[];
}
