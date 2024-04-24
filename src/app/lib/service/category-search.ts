import { SEARCH_API_URL } from "../../config";
import { CategoryResult } from "../models/category";
import { Results } from "../models/results";
import { urlSearchParamsFromObject } from "./utils";


interface CategoryQuery {
  ids?: string[];
  query?: string;
  page?: number;
  page_size?: number;
}

async function searchCategories(query: CategoryQuery): Promise<Results<CategoryResult>> {

  const queryObject: Omit<CategoryQuery, 'page' | 'page_size'> & {
    page: string | undefined,
    page_size: string | undefined,
  } = {
    ...query,
    page: query.page?.toString(),
    page_size: query.page_size?.toString(), 
  }

  const params = urlSearchParamsFromObject(queryObject);

  const res = await fetch(`http://${SEARCH_API_URL}/api/v1/search/categories?${params.toString()}`, {
    method: 'GET',
  })

  if (!res.ok) {
    console.error(res.body);
    throw new Error("Failed to fetch categories...");
  }

  const results = await res.json() as Results<CategoryResult>;

  console.log(`got ${results.results.length} categories, total ${results.total}`)
  return results;
}

export default async function fetchCategories(): Promise<Results<CategoryResult>> {

  // TODO: actually fetch all categories using paginated requests, instead of just 30
  const query: CategoryQuery = {
    page: 0,
    page_size: 30,
  };
  const params = new URLSearchParams(query as Record<string, string>);

  let results = await searchCategories(query);

  let categoryResults: Results<CategoryResult> = {
    total: results.total,
    results: results.results,
  };

  while (categoryResults.results.length < categoryResults.total) {
    query.page = query.page! + 1;
    results = await searchCategories(query);
    categoryResults.results = categoryResults.results.concat(results.results);
  }

  return categoryResults;
}