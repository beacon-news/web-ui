"use client";

import { useEffect} from "react";
import { useInView } from "react-intersection-observer";
import Spinner from "./spinner";
import { ScrollToTop } from "./scroll-to-top";
import { TopicResult } from "../lib/models/topic";
import GroupedTopicDisplay, { GroupedTopics } from "./grouped-topic-display";


export default function TopicList({ 
  topicResults, 
  morePresent,
  onListEndReached,
 } : { 
  topicResults: TopicResult[],
  morePresent: boolean,
  onListEndReached: () => void,
}) {
  
  const {ref, inView} = useInView();

  useEffect(() => {
    if (inView) {
      onListEndReached();
    }
  }, [inView])

  // group topics according to the topic query (date range) they belong to
  const groupedTopics: GroupedTopics = {};
  for (const topic of topicResults) {
    if (!topic.query) {
      continue;
    }

    // this will be the group key
    const dateRange = `${topic.query.publish_date.start.toLocaleString()}-${topic.query.publish_date.end.toLocaleString()}`;
    if (!groupedTopics[dateRange]) {
      groupedTopics[dateRange] = {
        query: topic.query,
        articleSum: topic.count!,
        topics: [topic],
      }
    } else {
      groupedTopics[dateRange] = {
        ...groupedTopics[dateRange],
        articleSum: groupedTopics[dateRange].articleSum + topic.count!,
        topics: [...groupedTopics[dateRange].topics, topic],
      };
    }
  }

  // normalize topic article counts
  for (const key in groupedTopics) {
    const topics = groupedTopics[key].topics;
    topics.forEach(topic => topic.normalizedCount = topic.count! / groupedTopics[key].articleSum);
  }


  return (
    <div className="flex flex-col items-center gap-4 mb-24 w-full">
      {
        Object.keys(groupedTopics).map(dateRange => (
          groupedTopics[dateRange].topics.length > 0 &&

          <GroupedTopicDisplay
            key={dateRange}
            groupedTopic={groupedTopics[dateRange]} 
          />
        ))
      }
      <ScrollToTop />

      {/* show loading element if there are more elements to load */}
      {morePresent ? 
        <div className="p-12 flex flex-col items-center gap-4 text-lg text-gray-600">
          <Spinner />
          <div ref={ref} >Loading</div>
        </div>
        :
        (
          // if are no more elements, but there were some, show the end element
          topicResults.length > 0 ?
          <div className="p-12 text-center text-lg text-gray-600">That's it, you reached the end!</div>
          :
          // there are no more articles, and there were also none before.
          <div className="p-12 text-center text-lg text-gray-600">No topics found.</div>
        )
      }
    </div>
  );
}
