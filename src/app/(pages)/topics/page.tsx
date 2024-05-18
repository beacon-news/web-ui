"use client";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { TopicQuery } from "@/app/lib/models/topic-query";
import searchTopics from "@/app/lib/service/topic-search";
import TopicSearchBar from "@/app/ui/topic-search-bar";
import TopicList from "@/app/ui/topic-list";
import { Results } from "@/app/lib/models/results";
import { TopicResult } from "@/app/lib/models/topic";
import { Group } from "next/dist/shared/lib/router/utils/route-regex";
import { TopicBatchQuery } from "@/app/lib/models/topic-batch-query";
import { TopicBatchArticleQuery } from "@/app/lib/models/topic-batch";


export default function Page() {

  const [topicResults, setTopicResults] = useState<Results<TopicResult>>({
    total: 0,
    results: [],
  });

  const [topicQuery, setTopicQuery] = useState<TopicQuery>({
    page: 0,
    page_size: 10,
  });

  type GroupedTopicBatch = {
    [key: string]: {
      shown: boolean,
      query: TopicBatchArticleQuery,
    }
  }
  const [topicBatches, setTopicBatches] = useState<GroupedTopicBatch>({});

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
    // don't load more if there's nothing more to load
    if (topicResults.total <= topicResults.results.length) {
      return;
    }
    searchWithQuery(topicResults, topicQuery);
    setTopicQuery({
      ...topicQuery,
      page: topicQuery.page === undefined ? 0 : topicQuery.page + 1,
    });
  }

  // console.log(topicBatchIds)
  // const batchIds = Object.groupBy(topicResults.results, topic => topic.batch_id!);
  // const topicList = {
  //   ...topicResults,
  // }

  useEffect(() => {

    const newTopicBatches: GroupedTopicBatch = {};
    for (const topic of topicResults.results) {
      newTopicBatches[topic.batch_id!] = {
        shown: true,
        query: topic.batch_query!,
      }
    }

    setTopicBatches(newTopicBatches);
  }, [topicResults.results])


  return (
    <div className="w-full h-full flex flex-col items-center">
      <TopicSearchBar
        topicQuery={topicQuery}
        setTopicQuery={setTopicQueryAndSearch}
        onSearchPressed={() => { searchWithQuery(topicResults, topicQuery); }}
      /> 
      <div>
        {Object.keys(topicBatches).map(batch => (
          <div 
            key={batch}
          >
            <p>{batch}</p>
            <p>{topicBatches[batch].query.publish_date.start.toString()}</p>
            <p>{topicBatches[batch].query.publish_date.end.toString()}</p>
            <button onClick={}>Toggle</button>
          </div>
        ))}
      </div>
      <TopicList 
        loading={loading}
        topicResults={topicResults}
        // topicResults={{
        //   ...topicResults,
        //   results: topicResults.results.filter(topic => topic.batch_id 
        // }}
        onFetchMorePressed={loadNextTopics}
        onListEndReached={loadNextTopics}
      />
    </div>
  );
}