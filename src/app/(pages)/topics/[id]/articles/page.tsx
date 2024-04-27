"use client";
import { ArticleQuery, fromQueryParams } from "@/app/lib/models/article-query";
// import { ArticleResults } from "@/app/lib/models/article";
import searchArticles from "@/app/lib/service/article-search";
import ArticleList from "@/app/ui/article-list";
import ArticleSearchBar from "@/app/ui/article-search-bar";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import fetchCategories from "@/app/lib/service/category-search";
// import { CategoryResults } from "@/app/lib/models/category";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Results } from "@/app/lib/models/results";
import { ArticleResult } from "@/app/lib/models/article";
import ArticleCard from "@/app/ui/article-card";


export default function Page() {

  const params = useParams();
  const searchParams = useSearchParams();
  
  console.log(params);
  console.log(searchParams);

  const [articleResults, setArticleResults] = useState<Results<ArticleResult>>({
    total: 0,
    results: [],
  });

  const [articleQuery, setArticleQuery] = useState<ArticleQuery>({
    page: 0,
    page_size: 10,
  });

  const [loading, setLoading] = useState(true);

  const searchWithQuery = useCallback(
      async (query: ArticleQuery) => {
        try {
          const fetched = await searchArticles(query); 
          setArticleResults(fetched);
        } catch (error) {
          // TODO: set error handling, propagate it up
          throw error;
        }
    },
  []);

  useEffect(() => {
    const query: ArticleQuery = {
      topic_ids: [params.id as string],
      page: 0,
      page_size: 10,
    };
    searchWithQuery(query);
    setArticleQuery(query);
  }, [params])

  return (
    <div className="w-full flex flex-col items-center">
      {/* <p>Found {articleResults.results.length} articles</p> */}
      
      {/* {articleResults.results.map(article => (
        <ArticleCard
         key={article.id}
         article={article}
         onCategoryClicked={_ => {}}
         onTopicClicked={_ => {}}
        />
      ))} */}
      {/* <ArticleList 
        articleCountText={`Found ${articleResults.results.length} articles`}
        articleResults={articleResults} 
        loading={loading}
        onListEndReached={() => {}}
        onCategoryClicked={_ => {}}
        onTopicClicked={_ => {}}
      /> */}
    </div>
  );
}