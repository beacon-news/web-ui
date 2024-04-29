"use client";

import { useEffect} from "react";
import { ArticleCategory, ArticleResult, ArticleTopic } from "../lib/models/article";
import { useInView } from "react-intersection-observer";
import Spinner from "./spinner";
import { Results } from "../lib/models/results";
import ArticleList from "./article-list";


export default function ArticlesDisplay({ 
  articleCountText,
  articleResults,
  loading,
  onListEndReached,
  onCategoryClicked,
  onTopicClicked,
 } : { 
  articleCountText: string | undefined,
  articleResults: Results<ArticleResult>,
  loading: boolean,
  onListEndReached: () => void,
  onCategoryClicked?: (category: ArticleCategory) => void,
  onTopicClicked?: (topic: ArticleTopic) => void,
}) {
  
  const {ref, inView} = useInView();

  useEffect(() => {
    if (inView) {
      onListEndReached();
    }
  }, [inView])
  
  return (
    <div className="mb-12">
      <div className="mt-2 flex flex-col items-center">
        {articleResults.total > 0 ?
          <>
            {articleCountText &&  
              <p className="text-sm text-gray-400 text-right w-full px-4">{articleCountText}</p>
            }

            <ArticleList
              articleResults={articleResults}
              onCategoryClicked={onCategoryClicked}
              onTopicClicked={onTopicClicked}
            />

            {/* show loading element if there are more articles to load */}
            {articleResults.total > articleResults.results.length ?
              <div className="mt-6 p-12 flex flex-col items-center gap-4 text-lg text-gray-600">
                <Spinner />
                <div ref={ref}>Loading</div>
              </div>
              :
              <div className="mt-6 p-12 text-center text-lg text-gray-600">That&apos;s all, you reached the end!</div>
            }
          </>
          :
          (loading ?
            <div className="mt-6 p-12 flex flex-col items-center gap-4 text-lg text-gray-600">
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
