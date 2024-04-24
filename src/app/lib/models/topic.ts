// TODO: change publish_date to camelCase and create a DTO for the snake_case json?

import { TopicBatchArticleQuery } from "./topic-batch";

export interface TopicResult {
  id?: string;
  batch_id?: string,
  batch_query?: TopicBatchArticleQuery;
  topic?: string,
  count?: number;
  representative_articles: TopicArticle[]; 
}

// TODO: change author and title to be strings
export interface TopicArticle {
  id: string;
  url: string;
  image?: string;
  publish_date: Date;
  author?: string[];
  title: string[];
}
