import { Injectable } from '@nestjs/common'; 
import { NewsCategoryMapping, NewsCategoryVm } from './news-category-vm';
import { UserMapping, UserVm } from './user-vm';
import { Article } from '../models/article.entity';

export class ArticleVm {
  oid: string;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string;
  author: UserVm;
  category: NewsCategoryVm;
  status: string;
  views: number;
  createdAt: Date;
  updatedAt?: Date;
}

@Injectable()
export class ArticleMapping {

  constructor(
    private readonly userMapping: UserMapping,
    private readonly categoryMapping: NewsCategoryMapping,
  ) {}

  toArticleResponse(article: Article): ArticleVm {
    return {
      oid: article.oid,
      title: article.title,
      slug: article.slug,
      content: article.content,
      thumbnail: article.thumbnail ?? '',
      author: this.userMapping.toUserResponse(article.author),
      category: this.categoryMapping.toNewsCategoryResponse(article.newsCategory),
      status: article.status,
      views: article.views,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    };
  }

  toArticleResponses(articles: Article[]): ArticleVm[] {
    return articles.map(article => this.toArticleResponse(article));
  }
}
