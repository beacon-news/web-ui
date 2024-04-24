"use client";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { TopicQuery } from "@/app/lib/models/topic-query";
import { Results } from "@/app/lib/models/results";
import { TopicBatchQuery } from "@/app/lib/models/topic-batch-query";
import searchTopicBatches from "@/app/lib/service/topic-batch-search";
import { TopicBatchResult } from "@/app/lib/models/topic-batch";


export default function Page() {

  const [topicBatchResults, setTopicBatchResults] = useState<Results<TopicBatchResult>>({
    total: 0,
    results: [],
  });

  // start at -1 so incrementing it when encountering the end of the list gives page '0', the first page to fetch
  const [topicBatchQuery, setTopicBatchQuery] = useState<TopicBatchQuery>({
    page: -1,
    page_size: 20,
  });

  const [moreCanBeFetched, setMoreCanBeFetched] = useState(true);

  const searchWithQuery = useCallback(
    useDebouncedCallback(
      async (prevResults: Results<TopicBatchResult>, query: TopicBatchQuery) => {

        if (prevResults.total < query.page! * query.page_size!) {
          // there is nothing more to load
          setMoreCanBeFetched(false);
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
          setMoreCanBeFetched(true);

          console.log(fetched);

        } catch (error) {
          // TODO: set error handling, propagate it up
          throw error;
        }
    },
    800,
  ), []);

  // fetch batches on load
  useEffect(() => {
    searchWithQuery(topicBatchResults, topicBatchQuery); 
  }, [])

  useEffect(() => {
    console.log(topicBatchQuery)
  }, [topicBatchQuery])

  const setTopicBatchQueryAndSearch = (query: TopicBatchQuery) => {
    setTopicBatchQuery(query);
    searchWithQuery(topicBatchResults, query);
  }

  const loadMoreBatches = () => {
    const newQuery: TopicBatchQuery = {
      ...topicBatchQuery,
      page: topicBatchQuery.page === undefined ? 0 : topicBatchQuery.page + 1,
    };
    setTopicBatchQuery(newQuery);
    searchWithQuery(topicBatchResults, newQuery);
  }


  return (
    <div className="w-full flex flex-col items-center">
      {/* <TopicSearchBar
        topicQuery={topicQuery}
        setTopicQuery={setTopicQueryAndSearch}
        onSearchPressed={() => { searchWithQuery(topicResults, topicQuery); }}
      /> 
      <TopicList 
        topicResults={topicResults.results}
        morePresent={moreCanBeFetched}
        onListEndReached={loadMoreTopics}
      /> */}
    </div>
  );
}