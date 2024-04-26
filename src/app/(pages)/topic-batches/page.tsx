"use client";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Results } from "@/app/lib/models/results";
import { TopicBatchQuery } from "@/app/lib/models/topic-batch-query";
import searchTopicBatches from "@/app/lib/service/topic-batch-search";
import { TopicBatchResult } from "@/app/lib/models/topic-batch";
import TopicBatchList from "@/app/ui/topic-batch-list";


export default function Page() {

  const [topicBatchResults, setTopicBatchResults] = useState<Results<TopicBatchResult>>({
    total: 0,
    results: [],
  });

  const [topicBatchQuery, setTopicBatchQuery] = useState<TopicBatchQuery>({
    page: 0,
    page_size: 20,
  });

  const [initialFetch, setInitialFetch] = useState(true);

  const searchWithQuery = useCallback(
    useDebouncedCallback(
      async (prevResults: Results<TopicBatchResult>, query: TopicBatchQuery) => {

        if (prevResults.total < query.page! * query.page_size!) {
          // there is nothing more to load
          return;
        }

        try {
          const fetched = await searchTopicBatches(query); 
          
          if (query.page && query.page > 0) {
            // append the articles
            setTopicBatchResults({
              total: fetched.total,
              results: [...prevResults.results, ...fetched.results],
            });
          } else {
            // replace the batches
            setTopicBatchResults(fetched);
          } 

          console.log(fetched);

        } catch (error) {
          // TODO: set error handling, propagate it up
          throw error;
        }
    },
    800,
  ), []);

  // fetch first batch on load
  useEffect(() => {
    (async() => {
      await searchWithQuery(topicBatchResults, topicBatchQuery);
      setTopicBatchQuery({
        ...topicBatchQuery,
        page: topicBatchQuery.page === undefined ? 0 : topicBatchQuery.page + 1,
      });
      setInitialFetch(false);
    })();
  }, [])

  useEffect(() => {
    console.log(topicBatchQuery)
  }, [topicBatchQuery])

  const setTopicBatchQueryAndSearch = (query: TopicBatchQuery) => {
    setTopicBatchQuery(query);
    searchWithQuery(topicBatchResults, query);
  }

  const loadNextBatch = () => {
    searchWithQuery(topicBatchResults, topicBatchQuery);
    setTopicBatchQuery({
      ...topicBatchQuery,
      page: topicBatchQuery.page === undefined ? 0 : topicBatchQuery.page + 1,
    });
  }

  const loadNextBatchIfPresent = () => {
    if (topicBatchResults.total > topicBatchResults.results.length) {
      loadNextBatch();
    }
  }


  return (
    <div className="w-full flex flex-col items-center">
      
      {/* <TopicSearchBar
        topicQuery={topicQuery}
        setTopicQuery={setTopicQueryAndSearch}
        onSearchPressed={() => { searchWithQuery(topicResults, topicQuery); }}
      />  */}
      <TopicBatchList
        batchResults={topicBatchResults.results}
        morePresent={initialFetch === true || (topicBatchResults.total < topicBatchResults.results.length)}
        onListEndReached={loadNextBatchIfPresent}
      />
    </div>
  );
}