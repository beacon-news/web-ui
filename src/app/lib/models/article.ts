// TODO: change publish_date to camelCase and create a DTO for the snake_case json?

export interface ArticleResult {
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

export interface ArticleResults {
  total: number;
  results: ArticleResult[];
}

export interface ArticleCategory {
  id: string;
  name: string;
}

export interface ArticleTopic {
  id: string;
  topic: string;
}

