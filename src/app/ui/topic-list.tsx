"use client";

import { useEffect, useState} from "react";
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

  const [groupedTopics, setGroupedTopics] = useState<GroupedTopics>({});

  useEffect(() => {
    // group topics according to the topic batch they belong to
    const newGroupedTopics: GroupedTopics = {};
    for (const topic of topicResults) {
      if (!topic.batch_id || !topic.batch_query) {
        continue;
      }

      if (!newGroupedTopics[topic.batch_id]) {
        newGroupedTopics[topic.batch_id] = {
          query: topic.batch_query,
          articleSum: topic.count!,
          topics: [topic],
        }
      } else {
        newGroupedTopics[topic.batch_id] = {
          ...newGroupedTopics[topic.batch_id],
          articleSum: newGroupedTopics[topic.batch_id].articleSum + topic.count!,
          topics: [...newGroupedTopics[topic.batch_id].topics, topic],
        };
      }
    }

    // normalize topic article counts
    for (const key in newGroupedTopics) {
      const topics = newGroupedTopics[key].topics;
      topics.forEach(topic => topic.normalizedCount = topic.count! / newGroupedTopics[key].articleSum);
    }

    setGroupedTopics(newGroupedTopics);

  }, [topicResults]);

  return (
    <div className="flex flex-col items-center gap-4 mb-24 w-full">
      {
        Object.keys(groupedTopics).map(batchId => (
          groupedTopics[batchId].topics.length > 0 &&

          <GroupedTopicDisplay
            key={batchId}
            groupedTopic={groupedTopics[batchId]} 
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
