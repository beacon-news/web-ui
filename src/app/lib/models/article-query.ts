import { ArticleResult } from "./article";
import { SortDirection } from "./sort-direction";

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
  sort_dir?: SortDirection;
  search_type?: SearchType;
  return_attributes?: Array<keyof ArticleResult>;
}

export type SearchType = "text" | "semantic" | "combined";


// TODO: there is surely a shorter way to do this
export function fromQueryParams(params: URLSearchParams): ArticleQuery {

  const articleQuery: ArticleQuery = {};

  const ids = params.getAll("ids")
  if (ids && ids.length > 0) {
    articleQuery.ids = ids;
  }

  const query = params.get("query")
  if (query) {
    articleQuery.query = query;
  }

  const category_ids = params.getAll("category_ids")
  if (category_ids && category_ids.length > 0) {
    articleQuery.category_ids = category_ids;
  }

  const categories = params.get("categories")
  if (categories) {
    articleQuery.categories = categories;
  }

  const source = params.get("source")
  if (source) {
    articleQuery.source = source;
  }

  const author = params.get("author")
  if (author) {
    articleQuery.author = author;
  }

  const date_min = params.get("date_min");
  if (date_min) {
    articleQuery.date_min = new Date(date_min);
  }

  const date_max = params.get("date_max");
  if (date_max) {
    articleQuery.date_max = new Date(date_max);
  }

  const topic_ids = params.getAll("topic_ids")
  if (topic_ids && topic_ids.length > 0) {
    articleQuery.topic_ids = topic_ids;
  }

  const topic = params.get("topic")
  if (topic) {
    articleQuery.topic = topic;
  }

  const page = params.get("page")
  if (page) {
    articleQuery.page = parseInt(page);
  }

  const page_size = params.get("page_size")
  if (page_size) {
    articleQuery.page_size = parseInt(page_size);
  }

  const sort_field = params.get("sort_field");
  if (sort_field && sort_field === "publish_date") {
    articleQuery.sort_field = sort_field;
  }

  const sort_dir = params.get("sort_dir");
  if (sort_dir && (sort_dir === "asc" || sort_dir === "desc")) {
    articleQuery.sort_dir = sort_dir as SortDirection;
  }

  const search_type = params.get("search_type");
  if (search_type && (search_type === "text" || search_type === "combined")) {
    articleQuery.search_type = search_type as SearchType;
  }

  return articleQuery;
}