"use client";

import { useState } from "react";
import { ArticleQuery, SortDirection } from "../lib/models/article-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchBar from "./search-bar";
import { TopicQuery } from "../lib/models/topic-query";


export default function TopicSearchBar({
  topicQuery,
  setTopicQuery,
  onSearchPressed,
}: { 
  topicQuery: TopicQuery,
  setTopicQuery: (query: TopicQuery) => void,
  onSearchPressed: () => void,
}) {

  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);

  const setQuery = (queryString: string) => {
    const newTopicQuery: TopicQuery = {
      ...topicQuery,
      topic: queryString,
      page: 0,
    };
    if (queryString === "") {
      delete newTopicQuery.topic;
    }
    setTopicQuery(newTopicQuery); 
  }


  const setPublishDateStart = (date: Date | undefined) => {
    setTopicQuery({
      ...topicQuery,
      date_min: date,
      page: 0,
    });
  }

  const setPublishDateEnd = (date: Date | undefined) => {
    setTopicQuery({
      ...topicQuery,
      date_max: date,
      page: 0,
    });
  }

  const setPublishDateSortDirection = (direction: SortDirection) => {
    setTopicQuery({
      ...topicQuery,
      sort_field: "query.publish_date.end",
      sort_dir: direction,
      page: 0,
    });
  }

  return (
    <div className="w-full mx-auto md:w-4/5">
      {/* topic text query */}
      <SearchBar 
        setQuery={setQuery}
        optionsOpen={optionsOpen}
        optionsClicked={() => setOptionsOpen(!optionsOpen)}
      />

      {optionsOpen && 
        <div className="w-full flex flex-col gap-4 gap-y-6 bg-gray-200 p-4 mt-2 rounded-lg shadow-md shadow-gray-200 outline outline-1 outline-gray-200">

          {/* count range */}
          {/* publish date range */}
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-center">
            <p className="text-sm text-gray-600 md:mx-2">Publish date range:</p>
            <DatePicker 
              className="px-2 py-1 rounded-md text-sm mt-2 md:mt-0 md:mx-2
              outline outline-1 outline-gray-200 bg-gray-50
              focus:outline focus:outline-2 focus:outline-slate-400 shadow-lg shadow-gray-300"
              selected={topicQuery.date_min} 
              placeholderText="Start Date"
              popperPlacement="top"
              onChange={(date: Date) => setPublishDateStart(date)}
            />
            <DatePicker 
              className="px-2 py-1 rounded-md text-sm mt-2 md:mt-0 md:mx-2
              outline outline-1 outline-gray-200 bg-gray-50
              focus:outline focus:outline-2 focus:outline-slate-400 shadow-lg shadow-gray-300"
              selected={topicQuery.date_max} 
              placeholderText="End Date"
              popperPlacement="top"
              onChange={(date: Date) => setPublishDateEnd(date)}
            />
          </div>

          {/* sort field */}
          {/* sort direction */}
          <div className="flex flex-col md:flex-row md:justify-evenly md:items-center gap-2 md:gap-3">
            <div className="text-sm text-gray-600 p-2 flex gap-x-4">
              <label htmlFor="publish-date-sort">Order by publish date:</label>
              <select
                id="publish-date-sort"
                value={topicQuery.sort_dir || "desc"}
                onChange={(e) => setPublishDateSortDirection(e.target.value as SortDirection)}
              >
                <option value="desc">newest</option>
                <option value="asc">oldest</option>
              </select>
            </div>
          </div>

          {/* search button */}
          <button
            className="px-4 py-2 text-sm bg-gray-300 text-gray-500 rounded-md hover:bg-blue-500 hover:text-white"
            onClick={() => onSearchPressed()} 
          >
            Search
          </button>
        </div>
      }
    </div>
  );
};
