"use client";

import ArticleCard from "@/app/ui/article-card";
import { useEffect} from "react";
import { FeedArticleResult } from "../lib/models/feed-article";
import { useInView } from "react-intersection-observer";
import Spinner from "./spinner";


export default function ArticleList({ 
  articleResults, 
  moreArticlesPresent,
  onListEndReached,
 } : { 
  articleResults: FeedArticleResult[],
  moreArticlesPresent: boolean,
  onListEndReached: () => void,
}) {
  
  const {ref, inView} = useInView();

  useEffect(() => {
    if (inView) {
      onListEndReached();
    }
  }, [inView])
  
  return (
    <div className="flex flex-col items-center gap-4 mb-24">

      {/* show the articles */}
      {articleResults.length > 0 &&
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 grid-flow-row grid-align-center">
          {articleResults.map((article) => (
            <div key={article.id} className="mt-4">
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      }

      {/* show loading element if there are more articles to load */}
      {moreArticlesPresent ? 
        <div className="p-12 flex flex-col items-center gap-4 text-lg text-gray-600">
          <Spinner />
          <div ref={ref} >Loading</div>
        </div>
        :
        (
          // if are no more articles, but there were some, show the end element
          articleResults.length > 0 ?
          <div className="p-12 text-center text-lg text-gray-600">That's it, you've reached the end!</div>
          :
          // there are no more articles, and there were also none before.
          <div className="p-12 text-center text-lg text-gray-600">No articles found.</div>
        )
      }
    </div>
  );
}
