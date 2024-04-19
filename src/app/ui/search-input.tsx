"use client";

import { useEffect, useState } from "react";
import { Tag } from "./tags";
import { ArticleQuery, SortDirection } from "../lib/models/article-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function SearchBar({
  categories,
  articleQuery,
  setArticleQuery,
  onSearchPressed,
}: { 
  categories: string[],
  articleQuery: ArticleQuery,
  setArticleQuery: (query: ArticleQuery) => void,
  onSearchPressed: () => void,
}) {

  const [optionsOpen, setOptionsOpen] = useState<boolean>(false);

  const [chosenCategories, setChosenCategories] = useState(() => {
    // initialize categories with the ones from the parent
    const opts: { [key: string]: boolean } = {};
    for (const cat of categories) {
      opts[cat] = false;
    }
    return opts
  })

  // update chosen categories with the ones coming from the parent
  // TODO: redundant a bit, because chosenCategories also gets updated when the input changes
  useEffect(() => {
    const newChosenCategories = {...chosenCategories};
    for (const cat of articleQuery.categories?.split(' ') ?? []) {
      newChosenCategories[cat] = true;
    }
    setChosenCategories(newChosenCategories);
  }, [articleQuery.categories]);

  // update topic with the one coming from the parent
  useEffect(() => {
    articleQuery.topic && setTopic(articleQuery.topic);
  }, [articleQuery.topic]);

  const setQuery = (queryString: string) => {
    const newArticleQuery = {
      ...articleQuery,
      query: queryString,
      page: 0,
    };
    setArticleQuery(newArticleQuery); 
  }

  const setSource = (source: string) => {
    setArticleQuery({
      ...articleQuery,
      source: source,
      page: 0,
    });
  }

  const setAuthor = (author: string) => {
    setArticleQuery({
      ...articleQuery,
      author: author,
      page: 0,
    });
  }

  const toggleCategory = (category: string, toggled: boolean) => {
    // update categories object for the tags
    const newCategories = {
      ...chosenCategories,
      [category]: toggled,
    };
    // chosenCategories will also be updated via the parent, a bit redundant...
    setChosenCategories(newCategories);

    // update the query 
    const catString = Object.keys(newCategories)
      .filter(key => newCategories[key] == true)
      .join(' ');

    const newArticleQuery: ArticleQuery = {
      ...articleQuery,
      categories: catString,
      page: 0,
    }
    if (catString === '') {
      delete newArticleQuery.categories;
    }
    setArticleQuery(newArticleQuery);
  }

  const setTopic = (topic: string) => {
    setArticleQuery({
      ...articleQuery,
      topic: topic,
      page: 0,
    });
  }

  const setPublishDateStart = (date: Date | undefined) => {
    setArticleQuery({
      ...articleQuery,
      date_min: date,
      page: 0,
    });
  }

  const setPublishDateEnd = (date: Date | undefined) => {
    setArticleQuery({
      ...articleQuery,
      date_max: date,
      page: 0,
    });
  }

  const setPublishDateSortDirection = (direction: SortDirection) => {
    setArticleQuery({
      ...articleQuery,
      sort_field: "publish_date",
      sort_dir: direction,
      page: 0,
    });
  }

  const setUseSemanticSearch = (useSemanticSearch: boolean) => {
    setArticleQuery({
      ...articleQuery,
      search_type: useSemanticSearch ? "combined" : "text",
      page: 0,
    });
  }

  return (
    <div className="w-full mx-auto md:w-4/5">

      {/* article text query */}
      <div className="w-full flex items-center bg-gray-50 outline outline-1 shadow-md shadow-gray-200 outline-gray-200 rounded-lg px-4 py-2">
        <input 
          type="text" 
          className="w-full outline-none bg-gray-50" 
          placeholder="Search"
          onChange={e => setQuery(e.target.value)}
        />
        <button 
          className={`ml-2 px-2 py-1 text-sm ${optionsOpen ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500"} rounded-md hover:bg-blue-500 hover:text-white`}
          onClick={() => setOptionsOpen(!optionsOpen)}
        >
          Options
        </button>
      </div>

      {optionsOpen && 
        <div className="w-full flex flex-col gap-4 gap-y-6 bg-gray-200 p-4 mt-2 rounded-lg shadow-md shadow-gray-200 outline outline-1 outline-gray-200">

          {/* source */}
          {/* author */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
            <SearchOptionTextInput 
              placeholder="Source (BBC, CNN, ...)" 
              onChange={e => setSource(e.target.value)}
            />
            <SearchOptionTextInput 
              placeholder="Author"
              onChange={e => setAuthor(e.target.value)}
            />
          </div>

          {/* categories */}
          <div className="flex gap-2 flex-wrap">
            <p className="text-sm text-gray-600">Categories: </p>
            <div className="flex flex-row gap-3 flex-wrap">
              {categories.map((cat, index) => (
                <Tag 
                  text={cat} 
                  key={index} 
                  selected={chosenCategories[cat]} 
                  onToggled={(toggled) => toggleCategory(cat, toggled)}
                />
              ))}
            </div> 
          </div>

          {/* topic */}
          <SearchOptionTextInput
            placeholder="Topic (market inflation billion dow ...)"
            defaultValue={articleQuery.topic}
            onChange={e => setTopic(e.target.value)}
          />

          {/* publish date range */}
          <div className="w-full flex flex-col md:flex-row md:items-center md:justify-center">
            <p className="text-sm text-gray-600 md:mx-2">Publish date range:</p>
            <DatePicker 
              className="px-2 py-1 rounded-md text-sm mt-2 md:mt-0 md:mx-2
              outline outline-1 outline-gray-200 bg-gray-50
              focus:outline focus:outline-2 focus:outline-slate-400 shadow-lg shadow-gray-300"
              selected={articleQuery.date_min} 
              placeholderText="Start Date"
              popperPlacement="top"
              onChange={(date: Date) => setPublishDateStart(date)}
            />
            <DatePicker 
              className="px-2 py-1 rounded-md text-sm mt-2 md:mt-0 md:mx-2
              outline outline-1 outline-gray-200 bg-gray-50
              focus:outline focus:outline-2 focus:outline-slate-400 shadow-lg shadow-gray-300"
              selected={articleQuery.date_max} 
              placeholderText="End Date"
              popperPlacement="top"
              onChange={(date: Date) => setPublishDateEnd(date)}
            />
          </div>

          {/* publish date sort direction */}
          {/* semantic search toggle */}
          <div className="flex flex-col md:flex-row md:justify-evenly md:items-center gap-2 md:gap-3">
            <div className="text-sm text-gray-600 p-2 flex gap-x-4">
              <label htmlFor="publish-date-sort">Order by publish date:</label>
              <select
                id="publish-date-sort"
                value={articleQuery.sort_dir || "desc"}
                onChange={(e) => setPublishDateSortDirection(e.target.value as SortDirection)}
              >
                <option value="desc">newest</option>
                <option value="asc">oldest</option>
              </select>
            </div>
            {
              articleQuery.query === undefined || articleQuery.query.trim() === "" ?
              <p className="text-sm text-gray-600 text-center">Enter a search query in order to use semantic search.</p>
              :
              <div>
                <div className="flex items-center justify-center gap-1">
                  <label htmlFor="semantic-search-toggle"
                    className="text-sm text-gray-600 px-2 py-2">
                    Use semantic search
                  </label>
                  <input
                    id="semantic-search-toggle"
                    type="checkbox"
                    className="w-4 h-4"
                    placeholder="Semantic Search Toggle"
                    disabled={articleQuery.query === undefined || articleQuery.query.trim() === ""}
                    defaultChecked={articleQuery.search_type === "combined"}
                    onChange={(e) => setUseSemanticSearch(e.target.checked)}
                  />
                </div>
                <p className="text-xs text-gray-600">Note that only the top results will be shown.</p>
              </div>
            }
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

const SearchOptionTextInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => {
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
