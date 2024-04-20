// TODO: change publish_date to camelCase and create a DTO for the snake_case json?

export interface TopicResult {
  id?: string;
  query?: TopicFilterQuery;
  topic?: string,
  count?: number;
  representative_articles: TopicArticle[]; 
}

export interface TopicFilterQuery {
  publish_date: {
    start: Date,
    end: Date
  }
}

// TODO: change author and title to be strings
export interface TopicArticle {
  id: string;
  url: string;
  publish_date: Date;
  author?: string[];
  title: string[];
}

export interface TopicResults {
  total: number;
  results: TopicResult[];
}