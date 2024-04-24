import { SEARCH_API_URL } from "../../config";
import { Results } from "../models/results";
import { TopicBatchResult } from "../models/topic-batch";
import { TopicBatchQuery } from "../models/topic-batch-query";
import { urlSearchParamsFromObject } from "./utils";


export default async function searchTopicBatches(query: TopicBatchQuery): Promise<Results<TopicBatchResult>> {

  const params = urlSearchParamsFromObject(query);

  const res = await fetch(`http://${SEARCH_API_URL}/api/v1/search/topic-batches?${params.toString()}`, {
    method: 'GET',
  })

  if (!res.ok) {
    console.error(res.body);
    throw new Error("Failed to fetch topic batches...");
  }

  const results = await res.json() as Results<TopicBatchResult>;

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
    }
  })

  console.log(`got ${results.results.length} topic batches, total ${results.total}`)
  return results;
}