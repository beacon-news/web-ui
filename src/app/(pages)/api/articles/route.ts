import { SEARCH_API_URL } from "@/app/config";
import { ArticleResult } from "@/app/lib/models/article";
import { Results } from "@/app/lib/models/results";
import searchArticles from "@/app/lib/service/article-search"
import { urlSearchParamsFromObject } from "@/app/lib/service/utils";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {

  console.log(request);
  
  const p = request.nextUrl.searchParams

  const query = {
    page: p.get("page") || 2,
    page_size: p.get("page_size") || 10,
  };
  const params = urlSearchParamsFromObject(query);

  const res = await fetch(`http://${SEARCH_API_URL}/api/v1/search/articles?${params.toString()}`, {
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
 
  return Response.json({ results })
}