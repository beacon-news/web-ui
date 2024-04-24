import { SEARCH_API_URL } from "../../config";
import { TopicQuery } from "../models/topic-query";
import { TopicResult } from "../models/topic";
import { urlSearchParamsFromObject } from "./utils";
import { Results } from "../models/results";


export default async function searchTopics(query: TopicQuery): Promise<Results<TopicResult>> {

  const params = urlSearchParamsFromObject(query);

  const res = await fetch(`http://${SEARCH_API_URL}/api/v1/search/topics?${params.toString()}`, {
    method: 'GET',
  })

  if (!res.ok) {
    console.error(res.body);
    throw new Error("Failed to fetch topics...");
  }

  const results = await res.json() as Results<TopicResult>;

  // transform the date strings to Date objects
  results.results = results.results.map(topicObj => {
    return {
      ...topicObj,
      batch_query: topicObj.batch_query && {
        publish_date: {
          start: new Date(topicObj.batch_query.publish_date.start),
          end: new Date(topicObj.batch_query.publish_date.end),
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