"use client";

import { TopicResult } from "../lib/models/topic";
import TopicsBarChart from "./topic-bar-chart";
import TopicDetails from "./topic-details";
import { useCallback, useEffect, useState } from "react";
import TopicsLabelView from "./topic-label-view";
import clsx from "clsx";
import { ChevronDown, ChevronUp } from "./chevrons";
import { TopicBatchArticleQuery, TopicBatchResult } from "../lib/models/topic-batch";
import TopicsBatchLabelView from "./topic-batch-label-view";
import searchTopics from "../lib/service/topic-search";
import { TopicQuery } from "../lib/models/topic-query";
import { Results } from "../lib/models/results";



export default function TopicBatchDisplay({ 
  topicBatchResult,
 } : { 
  topicBatchResult: TopicBatchResult,
}) {

  const [barChartToggled, setBarChartToggled] = useState(false);
  const [labelViewToggled, setLabelViewToggled] = useState(false);
  const [listViewToggled, setListViewToggled] = useState(false);

  const [topicResults, setTopicResults] = useState<Results<TopicResult>>({
    total: 0,
    results: [],
  });

  const [topicQuery, setTopicQuery] = useState<TopicQuery>({
    page: 0,
    page_size: 10,
  });

  const searchTopicsWithQuery = useCallback(
    async (prevTopicResults: Results<TopicResult>, query: TopicQuery) => {

      if (prevTopicResults.total < query.page! * query.page_size!) {
        // there is nothing more to load
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
          // replace the topics if it's the first page
          setTopicResults(fetched);
        } 

        console.log(fetched);

      } catch (error) {
        // TODO: set error handling, propagate it up
        throw error;
      }
    }, 
  []);

  const loadMoreTopics = () => {
    searchTopicsWithQuery(topicResults, topicQuery);
    setTopicQuery({
      ...topicQuery,
      page: topicQuery.page === undefined ? 0 : topicQuery.page + 1,
    })
  }

  useEffect(() => {
    // only fetch articles if at least one visualization is toggled
    if (labelViewToggled || barChartToggled || listViewToggled) {
      loadMoreTopics();
    }
  }, [labelViewToggled, barChartToggled, listViewToggled]);


  return (
    <div 
      className="w-full my-12"
    >
      <hr className="border-slate-300"></hr>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center my-4">
        <p
          className="text-lg"
        >Topics between 
          <span className="text-gray-600"> {topicBatchResult.query?.publish_date.start.toDateString()} </span>
          and 
          <span className="text-gray-600"> {topicBatchResult.query?.publish_date.end.toDateString()} </span>
        </p>
        {topicResults.total > 0 ? 
          <div className="flex flex-col gap-2">
            <p 
              className="text-md text-gray-600"
            >Fetched top {topicResults.results.length}/{topicResults.total} topics</p>
            {topicResults.total > topicResults.results.length &&
              <button
                className="text-sm px-2 py-1 rounded-md text-white bg-gray-400 hover:bg-blue-500 "
                onClick={loadMoreTopics}
              >fetch more</button>
            }
          </div>
          :
          <p className="text-md text-gray-600">{topicBatchResult.topic_count} topics</p>
        }
      </div>

      <div className="flex flex-col gap-4">
        {topicResults.results.length !== 1 ? 
          <>
            <div>
              <ToggleButton 
                text="View topic labels" 
                toggled={labelViewToggled}
                className={clsx(
                  "px-4 py-2 text-md flex flex-row items-center justify-between hover:text-blue-500 hover:opacity-90",
                  labelViewToggled && "text-blue-500"
                )}
                onToggle={() => setLabelViewToggled(!labelViewToggled)}
              />

              {labelViewToggled &&
                <TopicsBatchLabelView topics={topicResults.results} />
              }
            </div>

            <div>
              <ToggleButton 
                text="View topics bar chart" 
                toggled={barChartToggled}
                className={clsx(
                  "px-4 py-2 text-md flex flex-row items-center justify-between hover:text-blue-500 hover:opacity-90",
                  barChartToggled && "text-blue-500"
                )}
                onToggle={() => setBarChartToggled(!barChartToggled)}
              />

              {barChartToggled &&
                <TopicsBarChart topics={topicResults.results} />
              }
            </div>
          </>
          :
          <p className="text-md text-gray-600">Visualizations are unavailable, because there is only a single topic.</p>
        }

        <div>
          <ToggleButton 
            text="Topic details" 
            toggled={listViewToggled}
            className={clsx(
              "px-4 py-2 text-md flex flex-row items-center justify-between hover:text-blue-500 hover:opacity-90",
              listViewToggled && "text-blue-500"
            )}
            onToggle={() => setListViewToggled(!listViewToggled)} 
          />

          {listViewToggled &&
            <div 
              className="mt-8 flex flex-col gap-8">
              {topicResults.results.map((topic) => <TopicDetails key={topic.id} topic={topic} />)} 
            </div>
          }
        </div>
      </div>
    </div>
  );
}


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string,
  toggled: boolean,
  onToggle: () => void,
}

const ToggleButton: React.FC<ButtonProps> = ({
  text,
  toggled,
  onToggle,
  ...rest
}) => {
  return (
    <button
      className={clsx(
        "px-4 py-2 text-md flex flex-row items-center justify-between bg-slate-600 text-white rounded-md hover:bg-blue-500",
        toggled && "bg-blue-500"
      )}
      {...rest}
      onClick={onToggle}
    >
      {text && <p>{text}</p>}
      {toggled ? 
        <ChevronUp className="w-4 h-4 ml-2"/>
        : 
        <ChevronDown className="w-4 h-4 ml-2"/>
      }
    </button> 
  );
}