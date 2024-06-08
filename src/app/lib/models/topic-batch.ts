// TODO: create a DTO for the snake_case json and a camelCase object for the model?

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
  topic_count?: number;
  create_time?: Date;
}
