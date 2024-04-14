"use client";

import ArticleCard from "@/app/ui/article-card";
import { useState } from "react";
import { FeedArticleResult } from "../lib/models/feed-article";
import getFeed from "../lib/service/feed";


export default function ArticleList({ articleResults } : { articleResults: FeedArticleResult[] }) {
  
  // the next page to fetch is 1, the first page is 0, and has already been fetched
  const [pageToFetch, setPageToFetch] = useState(1);
  const [articleResultsList, setArticleResults] = useState<FeedArticleResult[]>(articleResults)

  const loadMoreArticles = async () => {
    const results = await getFeed(pageToFetch) 
    setArticleResults([...articleResultsList, ...results.results])
    setPageToFetch(pageToFetch + 1)
  }
  
  return (
    <div className="gap-8 columns-3">
      {articleResultsList.map((article) => (
        <div key={article.id} className="mt-4">
          <ArticleCard article={article} />
        </div>
      ))}
      <button onClick={loadMoreArticles}>Load More</button>
    </div>
  );
}