"use client";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { TopicQuery } from "@/app/lib/models/topic-query";
// import { TopicResults } from "@/app/lib/models/topic";
import searchTopics from "@/app/lib/service/topic-search";
import TopicSearchBar from "@/app/ui/topic-search-bar";
import TopicList from "@/app/ui/topic-list";
import { Results } from "@/app/lib/models/results";
import { TopicResult } from "@/app/lib/models/topic";


export default function Page() {

  const [topicResults, setTopicResults] = useState<Results<TopicResult>>({
    total: 0,
    results: [],
  });

  const [topicQuery, setTopicQuery] = useState<TopicQuery>({
    page: 0,
    page_size: 10,
  });

  const [loading, setLoading] = useState(true);

  const searchWithQuery = useDebouncedCallback(
      async (prevTopicResults: Results<TopicResult>, query: TopicQuery) => { 

        if (prevTopicResults.total < query.page! * query.page_size!) {
          // there is nothing more to load
          setLoading(false);
          return;
        }

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

          console.log(fetched);

        } catch (error) {
          // TODO: set error handling, propagate it up
          throw error;
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

  useEffect(() => {
    console.log(topicQuery)
  }, [topicQuery])

  const setTopicQueryAndSearch = (query: TopicQuery) => {
    setTopicQuery(query);
    searchWithQuery(topicResults, query);
  }

  const loadNextTopics = () => {
    // wait until the previous request is done
    if (loading) {
      return;
    }
    searchWithQuery(topicResults, topicQuery);
    setTopicQuery({
      ...topicQuery,
      page: topicQuery.page === undefined ? 0 : topicQuery.page + 1,
    });
  }

  return (
    <div className="w-full flex flex-col items-center">
      <TopicSearchBar
        topicQuery={topicQuery}
        setTopicQuery={setTopicQueryAndSearch}
        onSearchPressed={() => { searchWithQuery(topicResults, topicQuery); }}
      /> 
      <TopicList 
        loading={loading}
        topicResults={topicResults}
        onFetchMorePressed={loadNextTopics}
        onListEndReached={loadNextTopics}
      />
    </div>
  );
}