import { SEARCH_API_URL } from "../../config";
import { ArticleQuery } from "../models/article-query";
import { FeedArticleResults } from "../models/feed-article";


export default async function getFeed(page: number = 0, pageSize: number = 10): Promise<FeedArticleResults> {

  const feedQuery: ArticleQuery = {
    page: page,
    page_size: pageSize,
  }

  const params = new URLSearchParams(feedQuery as Record<string, string>);

  const res = await fetch(`http://${SEARCH_API_URL}/api/v1/search/articles?${params.toString()}`, {
    method: 'GET',
  })

  if (!res.ok) {
    console.error(res.body);
    throw new Error("Failed to fetch articles...");
  }

  const results = await res.json() as FeedArticleResults;
  // console.log(results);
  
  console.log(`got ${results.results.length} articles, total ${results.total}`)

  return results;
}