"use client";

import ArticleCard from "@/app/ui/article-card";
import { useState } from "react";
import { FeedArticleResult } from "../lib/models/feed-article";
import getFeed from "../lib/service/feed";
import { SearchArticleQuery } from "../lib/models/article-query";
import searchArticles from "../lib/service/search";
import SearchBar from "./search-input";
import { useDebouncedCallback } from "use-debounce";


export default function ArticleList({ articleResults } : { articleResults: FeedArticleResult[] }) {
  
  // the next page to fetch is 1, the first page is 0, and has already been fetched
  const [pageToFetch, setPageToFetch] = useState(1);
  const [articleResultsList, setArticleResults] = useState<FeedArticleResult[]>(articleResults)

  const loadMoreArticles = async () => {
    const results = await getFeed(pageToFetch) 
    setArticleResults([...articleResultsList, ...results.results]);
    setPageToFetch(pageToFetch + 1);
  }

  const loadSearchedArticles = useDebouncedCallback(
    async (searchQuery: string) =>{
      const articleQuery: SearchArticleQuery = {
        query: searchQuery,
        page: 0,
        page_size: 10,
      };
      const results = await searchArticles(articleQuery);
      setArticleResults([...results.results]);
      setPageToFetch(1);
    }, 
    1000
  );
  
  return (
    <div>
      <SearchBar setQuery={loadSearchedArticles} />
      <div className="gap-8 columns-3">
        {articleResultsList.map((article) => (
          <div key={article.id} className="mt-4">
            <ArticleCard article={article} />
          </div>
        ))}
        <button onClick={loadMoreArticles}>Load More</button>
      </div>
    </div>
  );
}