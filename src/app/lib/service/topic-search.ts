import { SEARCH_API_URL } from "../../config";
import { TopicQuery } from "../models/topic-query";
import { TopicResult, TopicResults } from "../models/topic";
import { urlSearchParamsFromObject } from "./utils";


export default async function searchTopics(query: TopicQuery): Promise<TopicResults> {

  // map 'DTO' keys to accepted parameters
  const queryObject: Omit<TopicQuery, 'date_min' | 'date_max' | 'page' | 'page_size'> & {
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

  const res = await fetch(`http://${SEARCH_API_URL}/api/v1/search/topics?${params.toString()}`, {
    method: 'GET',
  })

  if (!res.ok) {
    console.error(res.body);
    throw new Error("Failed to fetch topics...");
  }

  const results = await res.json() as TopicResults;

  // transform the date strings to Date objects
  results.results = results.results.map(topicObj => {
    return {
      ...topicObj,
      query: topicObj.query && {
        publish_date: {
          start: new Date(topicObj.query.publish_date.start),
          end: new Date(topicObj.query.publish_date.end),
        }
      },
      representative_articles: topicObj.representative_articles.map(art => {
        return {
          ...art,
          publish_date: new Date(art.publish_date),
        } 
      })
    }
  })

  console.log(`got ${results.results.length} topics, total ${results.total}`)
  return results;
}