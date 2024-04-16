"use client";

import ArticleCard from "@/app/ui/article-card";
import { useEffect, useState } from "react";
import { FeedArticleResult } from "../lib/models/feed-article";
import { useInView } from "react-intersection-observer";


export default function ArticleList({ 
  articleResults, 
  onListEndReached,
 } : { 
  articleResults: FeedArticleResult[],
  onListEndReached: () => void,
}) {
  
  const {ref, inView} = useInView();

  useEffect(() => {
    if (inView) {
      onListEndReached();
    }
  }, [inView])
  
  return (
    <div className="flex flex-col justify-center">
    {articleResults.length > 0 ?
      <div>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 grid-flow-row grid-align-center">
          {articleResults.map((article) => (
            <div key={article.id} className="mt-4">
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
        <div ref={ref}>Loading</div>
      </div>
      :
      <div className="p-12 text-center">No articles found.</div>
    }
    </div>
  );
}
