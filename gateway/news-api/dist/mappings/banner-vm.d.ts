import { Banner } from '../models/banner.entity';
import { ArticleVm } from './article-vm';
export declare class BannerVm {
    oid: string;
    title: string;
    image: string;
    article?: ArticleVm;
    createdAt: Date;
    updatedAt?: Date;
}
export declare class BannerMapping {
    private readonly bannerMapping;
    constructor(bannerMapping: BannerMapping);
    toBannerResponse(banner: Banner): BannerVm;
    toBannerResponses(banners: Banner[]): BannerVm[];
}
