"use client";

import ArticleCard from "@/app/ui/article-card";
import { useEffect} from "react";
import { ArticleResult, ArticleResults } from "../lib/models/article";
import { useInView } from "react-intersection-observer";
import Spinner from "./spinner";
import { ScrollToTop } from "./scroll-to-top";


export default function ArticleList({ 
  articleResults, 
  moreArticlesPresent,
  onListEndReached,
  onCategoryClicked,
  onTopicClicked,
 } : { 
  articleResults: ArticleResult[],
  moreArticlesPresent: boolean,
  onListEndReached: () => void,
  onCategoryClicked: (category: string) => void,
  onTopicClicked: (topic: string) => void,
}) {
  
  const {ref, inView} = useInView();

  useEffect(() => {
    if (inView) {
      onListEndReached();
    }
  }, [inView])
  
  return (
    <div className="mb-24">
      {/* <p className="pt-4 px-4 mt-8 text-sm text-gray-400 text-right">Found {articleResults.total} results</p> */}
      <div className="flex flex-col items-center gap-4">

        {/* show the articles */}
        {articleResults.length > 0 &&
          <>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 grid-flow-row grid-align-center">
              {articleResults.map((article) => (
                <div key={article.id} className="mt-4">
                  <ArticleCard 
                    article={article} 
                    onCategoryClicked={onCategoryClicked}
                    onTopicClicked={onTopicClicked}
                  />
                </div>
              ))}
            </div>
            <ScrollToTop />
          </>
        }

        {/* show loading element if there are more articles to load */}
        {moreArticlesPresent ? 
          <div className="p-12 flex flex-col items-center gap-4 text-lg text-gray-600">
            <Spinner />
            <div ref={ref}>Loading</div>
          </div>
          :
          (
            // if are no more articles, but there were some, show the end element
            articleResults.length > 0 ?
            <div className="p-12 text-center text-lg text-gray-600">That's it, you reached the end!</div>
            :
            // there are no more articles, and there were also none before.
            <div className="p-12 text-center text-lg text-gray-600">No articles found.</div>
          )
        }
      </div>
    </div>
  );
}
