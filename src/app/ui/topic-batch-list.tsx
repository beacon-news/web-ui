"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Spinner from "./spinner";
import { ScrollToTop } from "./scroll-to-top";
import { TopicBatchResult } from "../lib/models/topic-batch";
import TopicBatchDisplay from "./topic-batch-display";
import { Results } from "../lib/models/results";


export default function TopicBatchList({ 
  batchResults, 
  loading,
  onListEndReached,
 } : { 
  batchResults: Results<TopicBatchResult>,
  loading: boolean,
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
      {batchResults.total > 0 ?
        <>
          {
            batchResults.results.map(topicBatch => (
              <TopicBatchDisplay
                key={topicBatch.id}
                topicBatchResult={topicBatch}
              />
            ))
          }
          <ScrollToTop />
          
          {/* show loading element if there are more batches to load */}
          {batchResults.total > batchResults.results.length ?
            <div className="mt-6 p-12 flex flex-col items-center gap-4 text-lg text-gray-600">
              <Spinner />
              <div ref={ref}>Loading</div>
            </div>
            :
            <div className="mt-6 p-12 text-center text-lg text-gray-600">That&apos;s all, you reached the end!</div>
          }
        </>
        :
        (loading ?
          <div className="p-12 flex flex-col items-center gap-4 text-lg text-gray-600">
            <Spinner />
            <div ref={ref}>Loading</div>
          </div>
          :
          <div className="p-12 text-center text-lg text-gray-600">No topic batches found.</div>
        )
      } 
    </div>
  );
}
