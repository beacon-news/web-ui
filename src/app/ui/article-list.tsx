"use client";

import ArticleCard from "@/app/ui/article-card";
import { useEffect} from "react";
import { ArticleResult } from "../lib/models/article";
import { useInView } from "react-intersection-observer";
import Spinner from "./spinner";
import { ScrollToTop } from "./scroll-to-top";
import { Results } from "../lib/models/results";


export default function ArticleList({ 
  articleCountText,
  articleResults, 
  loading,
  // moreArticlesPresent,
  onListEndReached,
  onCategoryClicked,
  onTopicClicked,
 } : { 
  articleCountText: string | undefined,
  articleResults: Results<ArticleResult>,
  loading: boolean,
  // moreArticlesPresent: boolean,
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
      <div className="mt-6 flex flex-col items-center">
        {articleResults.total > 0 ?
          <>
            {articleCountText &&  
              <p className="text-sm text-gray-400 text-right w-full px-4">{articleCountText}</p>
            }

            {/* show the articles */}
            {articleResults.results.length > 0 &&
              <>
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 grid-flow-row grid-align-center">
                  {articleResults.results.map((article) => (
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
            {articleResults.total > articleResults.results.length ?
              <div className="p-12 flex flex-col items-center gap-4 text-lg text-gray-600">
                <Spinner />
                <div ref={ref}>Loading</div>
              </div>
              :
              <div className="p-12 text-center text-lg text-gray-600">That's it, you reached the end!</div>
            }
          </>
          :
          (loading ?
            <div className="p-12 flex flex-col items-center gap-4 text-lg text-gray-600">
              <Spinner />
              <div ref={ref}>Loading</div>
            </div>
            :
            <p className="p-12 text-center text-lg text-gray-600">No articles found.</p>
          )
        }
      </div>
    </div>
  );
}
