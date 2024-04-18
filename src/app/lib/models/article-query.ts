export interface ArticleQuery {
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
  sort_field?: "publish_date";
  sort_dir?: SortDirection,
  search_type?: SearchType;
  return_attributes?: string[];
}

export type SortDirection = "asc" | "desc";
export type SearchType = "text" | "semantic" | "combined";