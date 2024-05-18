"use client";

import { TopicResult } from "../lib/models/topic";
import TopicsBarChart from "./topic-bar-chart";
import TopicDetails from "./topic-details";
import { useState } from "react";
import clsx from "clsx";
import { ChevronDown, ChevronUp } from "./chevrons";
import TopicsLabelView from "./topic-label-view";


export default function TopicDisplay({ 
  topics,
 } : { 
  topics: TopicResult[],
}) {

  const [barChartToggled, setBarChartToggled] = useState(false);
  const [labelViewToggled, setLabelViewToggled] = useState(true);

  return (
    topics.length > 0 &&
    <div 
      className="w-full"
    >
      <div className="flex flex-col gap-4">

        {/* only show visualizations if there are at least 2 topics to compare */}
        {topics.length > 1 ?
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
                <TopicsLabelView 
                  topics={topics}
                />
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
                <TopicsBarChart topics={topics} />
              }
            </div>
          </>
          :
          <p className="text-md text-gray-600">Visualizations are unavailable, because there is only a single topic.</p>
        }

        <div 
          className="mt-8 flex flex-col gap-8">
          {topics.map((topic) => <TopicDetails key={topic.id} topic={topic} />)} 
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