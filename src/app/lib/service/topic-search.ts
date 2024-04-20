import { SEARCH_API_URL } from "../../config";
import { TopicQuery } from "../models/topic-query";
import { TopicResult, TopicResults } from "../models/topic";


export default async function searchTopics(query: TopicQuery): Promise<TopicResults> {

  const params = new URLSearchParams(query as Record<string, string>);

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