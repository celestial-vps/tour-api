import { Injectable } from '@nestjs/common';
import { Banner } from '../models/banner.entity';
import { ArticleVm, ArticleMapping } from './article-vm';

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

  constructor(private readonly bannerMapping: BannerMapping) { }

  toBannerResponse(banner: Banner): BannerVm {
    return {
      oid: banner.oid,
      title: banner.title,
      image: banner.image,
      // article: banner.article ? this.bannerMapping.toArticleResponse(banner.article) : undefined,
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt,
    };
  }

  toBannerResponses(banners: Banner[]): BannerVm[] {
    return banners.map(b => this.toBannerResponse(b));
  }
}
