"use client";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { TopicQuery } from "@/app/lib/models/topic-query";
import searchTopics from "@/app/lib/service/topic-search";
import TopicSearchBar from "@/app/ui/topic-search-bar";
import TopicList from "@/app/ui/topic-list";
import { Results } from "@/app/lib/models/results";
import { TopicResult } from "@/app/lib/models/topic";
import TopicBatchFilters from "@/app/ui/topic-filter";


export default function Page() {

  const [topicResults, setTopicResults] = useState<Results<TopicResult>>({
    total: 0,
    results: [],
  });

  const [topicQuery, setTopicQuery] = useState<TopicQuery>({
    page: 0,
    page_size: 10,
  });

  const [filteredTopicResults, setFilteredTopicResults] = useState<Results<TopicResult>>({
    total: 0,
    results: [],
  });
  const [topicBatchFilters, setTopicBatchFilters] = useState<Set<string>>(new Set());
  const [topicsGroupedByBatch, setTopicsGroupedByBatch] = useState<{[batchId: string]: TopicResult[]}>({});

  const [loading, setLoading] = useState(true);

  const searchWithQuery = useDebouncedCallback(
      async (prevTopicResults: Results<TopicResult>, query: TopicQuery) => { 

        setLoading(true);

        try {
          const fetched = await searchTopics(query); 

          if (query.page && query.page > 0) {
            // append the topics
            setTopicResults({
              total: fetched.total,
              results: [...prevTopicResults.results, ...fetched.results],
            });
          } else {
            // replace the topics
            setTopicResults(fetched);
          } 
        } finally {
          setLoading(false);
        }
    },
    800,
  );

  // fetch topics on load
  useEffect(() => {
    searchWithQuery(topicResults, topicQuery);
    setTopicQuery({
      ...topicQuery,
      page: topicQuery.page === undefined ? 0 : topicQuery.page + 1,
    });
  }, [])

  const setTopicQueryAndSearch = (query: TopicQuery) => {
    setTopicQuery(query);
    searchWithQuery(topicResults, query);
  }

  const loadNextTopics = () => {
    if (topicResults.total <= topicResults.results.length) {
      // there is nothing more to load
      return;
    }
    searchWithQuery(topicResults, topicQuery);
    setTopicQuery({
      ...topicQuery,
      page: topicQuery.page === undefined ? 0 : topicQuery.page + 1,
    });
  }

  // get topic batch ids for filtering topics based on their batches
  useEffect(() => {
    const grouped = Object.groupBy(topicResults.results, topic => topic.batch_id!);
    setTopicsGroupedByBatch(grouped as {[batchId: string]: TopicResult[]});
    setTopicBatchFilters(new Set(Object.keys(grouped)));
  }, [topicResults]);

  // filter topics based on the selected batches
  useEffect(() => {
    setFilteredTopicResults({
      ...topicResults,
      results: topicResults.results.filter(topic => topicBatchFilters.has(topic.batch_id!)),
    });
  }, [topicBatchFilters]);

  const toggleBatchFilter = (batchId: string) => {
    if (topicBatchFilters.has(batchId)) {
      console.log("remove")
      topicBatchFilters.delete(batchId);
    } else {
      console.log("add")
      topicBatchFilters.add(batchId);
    }
    setTopicBatchFilters(new Set(topicBatchFilters));
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <TopicSearchBar
        topicQuery={topicQuery}
        setTopicQuery={setTopicQueryAndSearch}
        onSearchPressed={() => { searchWithQuery(topicResults, topicQuery); }}
      /> 
      <TopicList 
        loading={loading}
        topicResults={topicResults}
        filteredResults={filteredTopicResults}
        onFetchMorePressed={loadNextTopics}
        onListEndReached={loadNextTopics}
        topicBatchFilters={topicBatchFilters}
        toggleBatchFilter={toggleBatchFilter}
      />
    </div>
  );
}