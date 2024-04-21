import { SEARCH_API_URL } from "../../config";
import { ArticleQuery } from "../models/article-query";
import { ArticleResult, ArticleResults } from "../models/article";
import { urlSearchParamsFromObject } from "./utils";


export default async function searchArticles(query: ArticleQuery): Promise<ArticleResults> {

  // map 'DTO' keys to accepted parameters
  // TODO: array parameters are not handled correctly

  const queryObject: Omit<ArticleQuery, 'date_min' | 'date_max' | 'page' | 'page_size'> & {
    date_min: string | undefined,
    date_max: string | undefined,
    page: string | undefined,
    page_size: string | undefined,
  } = {
    ...query,
    date_min: query.date_min?.toISOString(),
    date_max: query.date_max?.toISOString(),
    page: query.page?.toString(),
    page_size: query.page_size?.toString(), 
  }
  const params = urlSearchParamsFromObject(queryObject);

  const res = await fetch(`http://${SEARCH_API_URL}/api/v1/search/articles?${params.toString()}`, {
    method: 'GET',
  })

  if (!res.ok) {
    console.error(res.body);
    throw new Error("Failed to fetch articles...");
  }

  const results = await res.json() as ArticleResults;

  results.results = results.results.map((articleObj) => {
    return {
      ...articleObj,
      publish_date: new Date(articleObj.publish_date),
    } as ArticleResult;
  })

  console.log(`got ${results.results.length} articles, total ${results.total}`)
  return results;
}