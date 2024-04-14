export interface FeedArticleResult {
  id: string;
  categories: { [key: string]: any }[];
  entities: string[];
  topics: { [key: string]: any }[] | undefined;
  url: string;
  publish_date: Date;
  source: string | undefined;
  image: string | undefined;
  author: string | undefined;
  title: string;
  paragraphs: string[];
}

export interface FeedArticleResults {
  total: number;
  results: FeedArticleResult[];
}