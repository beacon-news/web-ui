import { SEARCH_API_URL } from "../../config";
import { ArticleQuery } from "../models/article-query";
import { ArticleResult } from "../models/article";
import { urlSearchParamsFromObject } from "./utils";
import { Results } from "../models/results";


export default async function searchArticles(query: ArticleQuery): Promise<Results<ArticleResult>> {

  const params = urlSearchParamsFromObject(query);

  const res = await fetch(`${SEARCH_API_URL}/api/v1/search/articles?${params.toString()}`, {
    method: 'GET',
  })

  if (!res.ok) {
    console.error(res.body);
    throw new Error("Failed to fetch articles...");
  }

  const results = await res.json() as Results<ArticleResult>;

  results.results = results.results.map((articleObj) => {
    return {
      ...articleObj,
      publish_date: new Date(articleObj.publish_date),
    } as ArticleResult;
  })

  console.log(`got ${results.results.length} articles, total ${results.total}`)
  return results;
}