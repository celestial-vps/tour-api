import { Injectable } from '@nestjs/common';
import { Tag } from '../models/tag.entity';

export class TagVm {
  oid: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt?: Date;
}

@Injectable()
export class TagMapping {

  toTagResponse(tag: Tag): TagVm {
    return {
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    };
  }

  toTagResponses(tags: Tag[]): TagVm[] {
    return tags.map(tag => this.toTagResponse(tag));
  }
}
