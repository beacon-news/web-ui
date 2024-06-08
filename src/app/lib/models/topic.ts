// TODO: create a DTO for the snake_case json and a camelCase object for the model?

import { TopicBatchArticleQuery } from "./topic-batch";

export interface TopicResult {
  id?: string;
  batch_id?: string,
  batch_query?: TopicBatchArticleQuery;
  topic?: string,
  count?: number;
  representative_articles: TopicArticle[]; 
}

export interface TopicArticle {
  id: string;
  url: string;
  image?: string;
  publish_date: Date;
  author?: string[];
  title: string[];
}
