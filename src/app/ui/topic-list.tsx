"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Spinner from "./spinner";
import { ScrollToTop } from "./scroll-to-top";
import { TopicResult } from "../lib/models/topic";
import TopicDisplay from "./topic-display";
import { Results } from "../lib/models/results";
import TopicBatchFilters from "./topic-filter";


export default function TopicList({ 
  loading,
  topicResults,  
  filteredResults,
  onFetchMorePressed,
  onListEndReached,
  topicBatchFilters,
  toggleBatchFilter,
 } : { 
  loading: boolean,
  topicResults: Results<TopicResult>,
  filteredResults: Results<TopicResult>,
  onFetchMorePressed: () => void,
  onListEndReached: () => void,
  topicBatchFilters: Set<string>,
  toggleBatchFilter: (batchId: string) => void,
}) {
  
  const {ref, inView} = useInView();

  useEffect(() => {
    if (inView) {
      onListEndReached();
    }
  }, [inView])


  return (
    <div className="mt-12 mb-12 w-full flex flex-col items-center gap-4">
      {topicResults.total > 0 ? 
        <>
          <div className="flex flex-col items-center sm:flex-row sm:justify-between w-full">
            <div className="flex flex-col items-center justify-between">
              <p className="text-md text-gray-500 text-left px-4">
                Fetched top {topicResults.results.length}/{topicResults.total} topics
              </p>
              <p className="text-md text-gray-500 text-left px-4">
                Showing {filteredResults.results.length}/{topicResults.results.length} topics
              </p>
            </div>
            {topicResults.total > topicResults.results.length ?
              <button 
                className="text-md text-gray-500 px-2 py-1 rounded-md bg-gray-300 hover:bg-blue-500 hover:text-white"
                onClick={onFetchMorePressed}
              >Fetch more</button> 
              :
              <p
                className="text-md text-gray-500"
              >No more elements to fetch.</p>
            }
          </div>
          <TopicBatchFilters 
            topicResults={topicResults}
            topicBatchFilters={topicBatchFilters}
            onFilterPressed={toggleBatchFilter}
          />
          {
            <TopicDisplay
              topics={filteredResults.results} 
            />
          }
          <ScrollToTop />

          {/* end of list */}
          {topicResults.total > topicResults.results.length ?
            <div className="p-12 flex flex-col items-center gap-4 text-lg text-gray-600">
              <Spinner />
              <div ref={ref}>Loading</div>
            </div>
            :
            <p className="p-12 text-center text-lg text-gray-600">That&apos;s all, you reached the end!</p>
          }
        </>
        :
        (loading ?
          <div className="p-12 flex flex-col items-center gap-4 text-lg text-gray-600">
            <Spinner />
            <div ref={ref}>Loading</div>
          </div>
          :
          <p className="p-12 text-center text-lg text-gray-600">No topics found.</p>
        )
      }
    </div>
  );
}
