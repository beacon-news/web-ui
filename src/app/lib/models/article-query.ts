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
  sort_field?: string;
  sort_dir?: "asc" | "desc";
  search_type?: "text" | "semantic" | "combined";
  return_attributes?: string[];
}