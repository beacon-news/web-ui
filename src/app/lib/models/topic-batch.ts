// TODO: change publish_date to camelCase and create a DTO for the snake_case json?

export interface TopicBatchArticleQuery {
  publish_date: {
    start: Date,
    end: Date
  }
}

export interface TopicBatchResult {
  id?: string;
  query?: TopicBatchArticleQuery
  article_count?: number;
  create_time?: Date;
}
