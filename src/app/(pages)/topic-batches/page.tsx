"use client";
import { useEffect, useState } from "react";
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

  const [loading, setLoading] = useState(true);

  const searchWithQuery = useDebouncedCallback(
      async (prevResults: Results<TopicBatchResult>, query: TopicBatchQuery) => {

        setLoading(true);

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
        } finally {
          setLoading(false);
        }
    },
    500,
  );

  // fetch first batch on load
  useEffect(() => {
    searchWithQuery(topicBatchResults, topicBatchQuery);
    setTopicBatchQuery({
      ...topicBatchQuery,
      page: topicBatchQuery.page === undefined ? 0 : topicBatchQuery.page + 1,
    });
  }, []);

  useEffect(() => {
    console.log(topicBatchQuery)
  }, [topicBatchQuery])

  const loadNextBatch = () => {
    // don't load more if there is nothing more to load
    if (topicBatchResults.total <= topicBatchResults.results.length) {
      return;
    }
    searchWithQuery(topicBatchResults, topicBatchQuery);
    setTopicBatchQuery({
      ...topicBatchQuery,
      page: topicBatchQuery.page === undefined ? 0 : topicBatchQuery.page + 1,
    });
  }


  return (
    <div className="w-full h-full flex flex-col items-center">
      <TopicBatchList
        batchResults={topicBatchResults}
        loading={loading}
        onListEndReached={loadNextBatch}
      />
    </div>
  );
}