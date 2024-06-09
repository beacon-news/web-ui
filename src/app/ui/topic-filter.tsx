"use client";

import { TopicResult } from "../lib/models/topic";
import { Results } from "../lib/models/results";
import { useState } from "react";

// done in a hurry, don't expect to see beautiful code here...
export default function TopicBatchFilters({ 
  topicResults,  
  topicBatchFilters,
  onFilterPressed,
 } : { 
  topicResults: Results<TopicResult>,
  topicBatchFilters: Set<string>,
  onFilterPressed: (batchId: string) => void,
}) {

  const [listToggled, setListToggled] = useState<boolean>(false);
  const groupedTopics = Object.groupBy(topicResults.results, topic => topic.batch_id!);
  
  return (
    <div className="flex flex-col gap-y-1 text-gray-500 w-full">
      <div className="flex flex-col items-center sm:flex-row sm:justify-between w-full">
        <p className="px-2 ">Filter topics by date: </p>
        <button 
        className="text-md text-gray-500 px-2 py-1 rounded-md bg-gray-300 hover:bg-blue-500 hover:text-white"
        onClick={() => setListToggled(!listToggled)}>{listToggled ? "Close" : "Show"} date filters</button>
      </div>
      {listToggled &&
        <ul className="mt-2 p-2 flex flex-col items-center gap-y-1">
          {Object.keys(groupedTopics).map(key => (
            <div key={key}
              className="flex gap-x-2 hover:cursor-pointer" 
              onClick={_ => onFilterPressed(key)}
            >
              <input 
                value={key} 
                checked={topicBatchFilters.has(key)}
                type="checkbox" 
              />
              <p>
                {groupedTopics[key]?.[0].batch_query!.publish_date.start.toDateString()} - {groupedTopics[key]?.[0].batch_query!.publish_date.end.toDateString()}
              </p>
            </div>
          ))}
        </ul>
      }
    </div>
  );
}
