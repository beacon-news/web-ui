"use client";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { TopicQuery } from "@/app/lib/models/topic-query";
// import { TopicResults } from "@/app/lib/models/topic";
import searchTopics from "@/app/lib/service/topic-search";
import TopicSearchBar from "@/app/ui/topic-search-bar";
import TopicList from "@/app/ui/topic-list";
import { Results } from "@/app/lib/models/results";
import { TopicResult } from "@/app/lib/models/topic";


export default function Page() {

  // const [topicResults, setTopicResults] = useState<TopicResults>({
  const [topicResults, setTopicResults] = useState<Results<TopicResult>>({
    total: 0,
    results: [],
  });

  // start at -1 so incrementing it when encountering the end of the list gives page '0', the first page to fetch
  const [topicQuery, setTopicQuery] = useState<TopicQuery>({
    page: -1,
    page_size: 20,
  });

  const [moreCanBeFetched, setMoreCanBeFetched] = useState(true);

  const searchWithQuery = useCallback(
    useDebouncedCallback(
      async (prevTopicResults: Results<TopicResult>, query: TopicQuery) => {

        if (prevTopicResults.total < query.page! * query.page_size!) {
          // there is nothing more to load
          setMoreCanBeFetched(false);
          return;
        }

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
          setMoreCanBeFetched(true);

          console.log(fetched);

        } catch (error) {
          // TODO: set error handling, propagate it up
          throw error;
        }
    },
    800,
  ), []);

  // fetch topics on load
  // useEffect(() => {
  //   searchWithQuery(topicResults, topicQuery); 
  // }, [])

  useEffect(() => {
    console.log(topicQuery)
  }, [topicQuery])

  const setTopicQueryAndSearch = (query: TopicQuery) => {
    setTopicQuery(query);
    searchWithQuery(topicResults, query);
  }

  const loadMoreTopics = () => {
    const newQuery: TopicQuery = {
      ...topicQuery,
      page: topicQuery.page === undefined ? 0 : topicQuery.page + 1,
    };
    setTopicQuery(newQuery);
    searchWithQuery(topicResults, newQuery);
  }


  return (
    <div className="w-full flex flex-col items-center">
      <TopicSearchBar
        topicQuery={topicQuery}
        setTopicQuery={setTopicQueryAndSearch}
        onSearchPressed={() => { searchWithQuery(topicResults, topicQuery); }}
      /> 
      <TopicList 
        topicResults={topicResults.results}
        morePresent={moreCanBeFetched}
        onListEndReached={loadMoreTopics}
      />
    </div>
  );
}