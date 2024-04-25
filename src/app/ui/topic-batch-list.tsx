"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Spinner from "./spinner";
import { ScrollToTop } from "./scroll-to-top";
import { TopicBatchResult } from "../lib/models/topic-batch";
import TopicBatchDisplay from "./topic-batch-display";


export default function TopicBatchList({ 
  batchResults, 
  morePresent,
  onListEndReached,
 } : { 
  batchResults: TopicBatchResult[],
  morePresent: boolean,
  onListEndReached: () => void,
}) {
  
  const {ref, inView} = useInView();

  useEffect(() => {
    if (inView) {
      onListEndReached();
    }
  }, [inView])

  return (
    <div className="flex flex-col items-center gap-4 mb-24 w-full">
      {
        batchResults.map(topicBatch => (
          <TopicBatchDisplay
            key={topicBatch.id}
            topicBatchResult={topicBatch}
          />
        ))
      }
      <ScrollToTop />

      {/* show loading element if there are more elements to load */}
      {morePresent ? 
        <div className="p-12 flex flex-col items-center gap-4 text-lg text-gray-600">
          <Spinner />
          <div ref={ref}>Loading</div>
        </div>
        :
        (
          // if are no more elements, but there were some, show the end element
          batchResults.length > 0 ?
          <div className="p-12 text-center text-lg text-gray-600">That's all, you reached the end!</div>
          :
          // there are no more articles, and there were also none before.
          <div className="p-12 text-center text-lg text-gray-600">No topic batches found.</div>
        )
      }
    </div>
  );
}
