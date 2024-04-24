import { SortDirection } from "./sort-direction";
import { TopicBatchResult } from "./topic-batch";

export interface TopicBatchQuery {
  ids?: string[];
  count_min?: number;
  count_max?: number;
  date_min?: Date;
  date_max?: Date;
  page?: number;
  page_size?: number;
  sort_field?: "date_min" | "date_max" | "count_min" | "count_max";
  sort_dir?: SortDirection;
  return_attributes?: Array<keyof TopicBatchResult>;
}
