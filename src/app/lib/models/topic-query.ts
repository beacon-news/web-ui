export interface TopicQuery {
  ids?: string[];
  topic?: string;
  count_min?: number;
  count_max?: number;
  category_ids?: string[];
  date_min?: Date;
  date_max?: Date;
  page?: number;
  page_size?: number;
  sort_field?: "query.publish_date.start" | "query.publish_date.end" | "count";
  sort_dir?: SortDirection,
  return_attributes?: string[];
}

export type SortDirection = "asc" | "desc";