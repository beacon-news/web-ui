export interface SearchArticleQuery {
  ids?: string[];
  query?: string;
  category_ids?: string[];
  categories?: string;
  source?: string;
  author?: string;
  date_min?: Date;
  date_max?: Date;
  topic_ids?: string[];
  topic?: string;
  page?: number;
  page_size?: number;
  search_type?: SearchArticleQueryType;
  return_attributes?: string[];
}

export enum SearchArticleQueryType {
  text,
  semantic,
  combined,
}