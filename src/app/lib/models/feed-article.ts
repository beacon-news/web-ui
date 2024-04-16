export interface FeedArticleResult {
  id?: string;
  categories?: ArticleCategory[];
  entities: string[];
  topics?: ArticleTopic[];
  url: string;
  publish_date: Date;
  source?: string;
  image?: string;
  author?: string;
  title: string;
  paragraphs: string[];
}

export interface FeedArticleResults {
  total: number;
  results: FeedArticleResult[];
}

export interface ArticleCategory {
  id: string;
  name: string;
}

export interface ArticleTopic {
  id: string;
  topic: string;
}

