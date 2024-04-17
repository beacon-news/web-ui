"use client";

import { useState } from "react";
import Tags, { Tag } from "./tags";
import { SortDirection } from "../lib/models/article-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const cats = [
  "world",
  "business",
  "entertainment",
  "health",
  "science",
  "sports",
  "technology",
  "politics",
  "art",
];



export default function SearchBar({ onInputChanged }: { onInputChanged: (query: string) => void }) {

  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);

  const [optionsCategories, setOptionsCategories] = useState(() => {
    const opts: { [key: string]: boolean } = {};
    for (const cat of cats) {
      opts[cat] = false;
    }
    return opts
  })

  const [publishDateSortDirection, setPublishDateSortDirection] = useState<SortDirection>("desc");

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const toggleCategory = (category: string, toggled: boolean) => {
    setOptionsCategories({
      ...optionsCategories,
      [category]: toggled,
    });
  }

  return (
    <div className="w-full mx-auto md:w-4/5">
      <div className="w-full flex items-center bg-gray-50 outline outline-1 shadow-md shadow-gray-200 outline-gray-200 rounded-lg px-4 py-2">
        <input 
          type="text" 
          className="w-full outline-none bg-gray-50" 
          placeholder="Search"
          onChange={e => onInputChanged(e.target.value)}
        />
        <button 
          className={`ml-2 px-2 py-1 text-sm ${optionsOpen ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500"} rounded-md hover:bg-blue-500 hover:text-white`}
          onClick={() => setOptionsOpen(!optionsOpen)}
        >
          Options
        </button>
      </div>
      {optionsOpen && 
        <div className="w-full flex flex-col gap-4 bg-gray-200 p-4 mt-2 rounded-lg shadow-md shadow-gray-200 outline outline-1 outline-gray-200">

          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
            <SearchOptionTextInput placeholder="Source (BBC, CNN, ...)" />
            <SearchOptionTextInput placeholder="Author" />
          </div>

          <div className="flex gap-2 flex-wrap">
            <p className="text-sm text-gray-600">Categories: </p>
            <div className="flex flex-row gap-3 flex-wrap">
              {cats.map((cat, index) => (
                <Tag 
                  text={cat} 
                  key={index} 
                  selected={optionsCategories[cat]} 
                  onToggled={(toggled) => toggleCategory(cat, toggled)}
                />
              ))}
            </div> 
          </div>

          <SearchOptionTextInput placeholder="Topic (market inflation billion dow ...)" />

          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-center">
            <p className="text-sm text-gray-600 md:mx-2">Publish date range:</p>
            <DatePicker 
              className="px-2 py-1 rounded-md text-sm mt-2 md:mt-0 md:mx-2
              outline outline-1 outline-gray-200 bg-gray-50
              focus:outline focus:outline-2 focus:outline-slate-400 shadow-lg shadow-gray-300"
              selected={startDate} 
              placeholderText="Start Date"
              popperPlacement="top"
              onChange={(date: Date) => setStartDate(date)}
            />
            <DatePicker 
              className="px-2 py-1 rounded-md text-sm mt-2 md:mt-0 md:mx-2
              outline outline-1 outline-gray-200 bg-gray-50
              focus:outline focus:outline-2 focus:outline-slate-400 shadow-lg shadow-gray-300"
              selected={endDate} 
              placeholderText="End Date"
              popperPlacement="top"
              onChange={(date: Date) => setEndDate(date)}
            />
          </div>

          <div className="flex flex-col md:flex-row md:justify-evenly md:items-center gap-2 md:gap-3">
            <div className="text-sm text-gray-600 p-2 flex gap-x-4">
              <label htmlFor="publish-date-sort">Order by publish date:</label>
              <select
                id="publish-date-sort"
                value={publishDateSortDirection}
                onChange={(e) => setPublishDateSortDirection(e.target.value as SortDirection)}
              >
                <option value="desc">newest</option>
                <option value="asc">oldest</option>
              </select>
            </div>
            <div className="flex items-center gap-1">
              <label htmlFor="semantic-search-toggle" className="text-sm text-gray-600 px-2 py-2">Use semantic search</label>
              <input
                id="semantic-search-toggle"
                type="checkbox"
                className="w-4 h-4"
                placeholder="Semantic Search Toggle"
              />
            </div>
          </div>

          <button
            onClick={() => console.log("Perform search logic here")} 
            className="px-4 py-2 text-sm bg-gray-300 text-gray-500 rounded-md hover:bg-blue-500 hover:text-white"
          >
            Search
          </button>
        </div>
      }
    </div>
  );
};

const SearchOptionTextInput: React.FC<React.InputHTMLAttributes<HTMLElement>> = (props) => {
  return (
    <input
      type="text"
      className="w-full outline outline-1 outline-gray-200 rounded-md bg-gray-50 px-2 py-1
      focus:outline focus:outline-2 focus:outline-slate-400 shadow-lg shadow-gray-300"
      placeholder="Author"
      {...props}
    />
  );
}
