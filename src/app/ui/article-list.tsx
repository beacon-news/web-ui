import ArticleCard from "@/app/ui/article-card";
import { ArticleCategory, ArticleResult, ArticleTopic } from "../lib/models/article";
import { ScrollToTop } from "./scroll-to-top";
import { Results } from "../lib/models/results";


export default function ArticleList({ 
  articleResults,
  onCategoryClicked,
  onTopicClicked,
 } : { 
  articleResults: Results<ArticleResult>,
  onCategoryClicked?: (category: ArticleCategory) => void,
  onTopicClicked?: (topic: ArticleTopic) => void,
}) {
  
  if (articleResults.results.length <= 0) {
    return null;
  }

  return (
      <>
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-flow-row grid-align-center">
          {articleResults.results.map((article) => (
            <ArticleCard 
              key={article.id}
              article={article} 
              onCategoryClicked={onCategoryClicked}
              onTopicClicked={onTopicClicked}
            />
          ))}
        </div>
        <ScrollToTop />
      </>
  );
}