"use client";

import { TopicBatchQuery, TopicResult } from "../lib/models/topic";
import TopicsBarChart from "./topic-bar-chart";
import TopicDetails from "./topic-details";
import { ButtonHTMLAttributes, useEffect, useState } from "react";
import TopicsLabelView from "./topic-label-view";
import clsx from "clsx";
import { ChevronDown, ChevronUp } from "./chevrons";
import { group } from "console";

export type GroupedTopic = { 
  query: TopicBatchQuery,
  articleSum: number,
  topics: (TopicResult & { normalizedCount?: number })[],
};
export type GroupedTopics = {
  [key: string]: GroupedTopic
};

export default function GroupedTopicDisplay({ 
  groupedTopic,
 } : { 
  groupedTopic: GroupedTopic,
}) {

  const [barChartToggled, setBarChartToggled] = useState(false);
  const [labelViewToggled, setLabelViewToggled] = useState(true);
  const [listViewToggled, setListViewToggled] = useState(false);

  useEffect(() => {
    // show topic details if there is only 1 topic
    if (groupedTopic.topics.length === 1) {
      setListViewToggled(true);
    }
  }, [groupedTopic]);


  return (
    groupedTopic.topics.length > 0 &&
    <div 
      className="w-full my-12"
    >
      <hr className="border-slate-300"></hr>
      <p
        className="text-lg my-4"
      >Topics between 
        <span className="text-gray-600"> {groupedTopic.query?.publish_date.start.toDateString()} </span>
        and 
        <span className="text-gray-600"> {groupedTopic.query?.publish_date.end.toDateString()} </span>
      </p>

      <div className="flex flex-col gap-4">

        {/* only show visualizations if there are at least 2 topics to compare */}
        {groupedTopic.topics.length > 1 ?
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
                <TopicsLabelView groupedTopic={groupedTopic} />
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
                <TopicsBarChart groupedTopic={groupedTopic} />
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
              {groupedTopic.topics.map((topic) => <TopicDetails key={topic.id} topic={topic} />)} 
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