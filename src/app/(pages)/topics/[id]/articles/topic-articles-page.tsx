"use client";
import { ArticleQuery } from "@/app/lib/models/article-query";
import searchArticles from "@/app/lib/service/article-search";
import ArticlesDisplay from "@/app/ui/articles-display";
import { useCallback, useState } from "react";
import { Results } from "@/app/lib/models/results";
import { ArticleResult } from "@/app/lib/models/article";
import { TopicResult } from "@/app/lib/models/topic";
import ArticleCard from "@/app/ui/article-card";


export default function TopicArticlesPage({
  topic, 
  representativeArticles,
  initialArticles,
  initialArticleQuery,
}: {
  topic: TopicResult,
  representativeArticles: Results<ArticleResult>,
  initialArticles: Results<ArticleResult>,
  initialArticleQuery: ArticleQuery,
}) {

  const [articleResults, setArticleResults] = useState<Results<ArticleResult>>(initialArticles);
  const [articleQuery, setArticleQuery] = useState<ArticleQuery>(initialArticleQuery);
  const [loading, setLoading] = useState(false);
  
  const searchWithQuery = useCallback(
      async (prevResults: Results<ArticleResult>, query: ArticleQuery) => {
        try {
          setLoading(true);

          const fetched = await searchArticles(query); 
          setArticleResults({
            total: fetched.total,
            results: [...prevResults.results, ...fetched.results],
          });
        } finally {
          setLoading(false);
        }
    },
  []);

  const loadMoreArticles = () => {
    if (articleResults.total <= articleResults.results.length) {
      // there are no more articles to load
      return;
    }
    const newQuery: ArticleQuery = {
      ...articleQuery,
      page: articleQuery.page === undefined ? 0 : articleQuery.page + 1,
    };
    setArticleQuery(newQuery);
    searchWithQuery(articleResults, newQuery);
  }


  return (
    <div className="w-full h-full flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-4">
        <h2
          className=" text-2xl font-bold" 
        >Articles for the topic
        </h2>
        <h2
          className="px-2 py-1 rounded-md bg-slate-200 text-md font-normal" 
        >{topic.topic}</h2>
      </div>
      <div>
        <h3 className="px-2 py-1 text-xl font-bold">Representative articles:</h3>
        <RepresentativeArticleList articles={representativeArticles.results} />
      </div>
      <hr className="w-full h-2 rounded-md bg-gray-600 mt-4"></hr>
      <div>
        <h3 className="px-2 py-1 text-xl font-bold">All articles in this topic:</h3>
        <ArticlesDisplay 
          articleCountText={`Showing ${articleResults.results.length} out of ${articleResults.total} articles`}
          articleResults={articleResults} 
          loading={loading}
          onListEndReached={loadMoreArticles}
        />
      </div>
    </div>
  );
}

function RepresentativeArticleList({ articles }: { articles: ArticleResult[] }) {
  return (
    <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 grid-flow-row grid-align-center
    bg-slate-300 p-4 rounded-md">
      {articles.map(article => (
        <ArticleCard
          key={article.id}
          article={article}
        />
      ))}
    </div>
  );
}