import { SEARCH_API_URL } from "../../config";
import { ArticleQuery } from "../models/article-query";
import { FeedArticleResult, FeedArticleResults } from "../models/feed-article";

export class SearchError extends Error {}

export default async function searchArticles(query: ArticleQuery): Promise<FeedArticleResults> {

  const params = new URLSearchParams(query as Record<string, string>);

  const res = await fetch(`http://${SEARCH_API_URL}/api/v1/search/articles?${params.toString()}`, {
    method: 'GET',
  })

  if (!res.ok) {
    console.error(res.body);
    throw new SearchError("Failed to fetch articles...");
  }

  const results = await res.json() as FeedArticleResults;

  results.results = results.results.map((articleObj) => {
    return {
      ...articleObj,
      publish_date: new Date(articleObj.publish_date),
    } as FeedArticleResult;
  })

  console.log(`got ${results.results.length} articles, total ${results.total}`)
  return results;
}