import { SortDirection } from "./sort-direction";
import { TopicResult } from "./topic";

export interface TopicQuery {
  ids?: string[];
  batch_ids?: string[];
  topic?: string;
  count_min?: number;
  count_max?: number;
  category_ids?: string[];
  date_min?: Date;
  date_max?: Date;
  page?: number;
  page_size?: number;
  sort_field?: "date_min" | "date_max" | "count";
  sort_dir?: SortDirection;
  return_attributes?: Array<keyof TopicResult>;
}
