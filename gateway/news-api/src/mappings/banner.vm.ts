import { Injectable } from '@nestjs/common';
import { Banner } from '../models/banner.entity';
import { ArticleVm, ArticleMapping } from './article.vm';

export class BannerVm {
  oid: string;
  title: string;
  image: string;
  article?: ArticleVm;
  createdAt: Date;
  updatedAt?: Date;
}

@Injectable()
export class BannerMapping {

  constructor(private readonly articleMapping: ArticleMapping) {}

  toBannerResponse(banner: Banner): BannerVm {
    return {
      id: banner.id,
      title: banner.title,
      image: banner.image,
      article: banner.article ? this.articleMapping.toArticleResponse(banner.article) : undefined,
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt,
    };
  }

  toBannerResponses(banners: Banner[]): BannerVm[] {
    return banners.map(b => this.toBannerResponse(b));
  }
}
