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
import { useParams, useRouter } from "next/navigation";
import { Results } from "@/app/lib/models/results";
import { CategoryResult } from "@/app/lib/models/category";
import { ArticleResult } from "@/app/lib/models/article";


export default function Wrapper({
  categoryResults,
  initialArticles,
  initialArticleQuery,
}: {
  categoryResults: Results<CategoryResult>,
  initialArticles: Results<ArticleResult>,
  initialArticleQuery: ArticleQuery,
}) {

  const [articleResults, setArticleResults] = useState<Results<ArticleResult>>(initialArticles);
  const [articleQuery, setArticleQuery] = useState<ArticleQuery>(initialArticleQuery);
  const [moreCanBeFetched, setMoreCanBeFetched] = useState(true);

  const searchWithQuery = useCallback(
    useDebouncedCallback(
      async (prevArticleResults: Results<ArticleResult>, query: ArticleQuery) => {

        if (
          // there is nothing more to load
          (prevArticleResults.total < query.page! * query.page_size!) ||

          // semantic search doesn't take paging into account, always returns the K first results
          ((query.search_type === "combined" || query.search_type === "semantic") && query.page! > 0)
        ) {
          // there is nothing more to load
          setMoreCanBeFetched(false);
          return;
        }

        try {
          const fetched = await searchArticles(query); 

          if (query.page && query.page > 0) {
            // append the articles
            setArticleResults({
              total: fetched.total,
              results: [...prevArticleResults.results, ...fetched.results],
            });
          } else {
            // replace the articles
            setArticleResults(fetched);
          } 
          setMoreCanBeFetched(true);

        } catch (error) {
          // TODO: set error handling, propagate it up
          throw error;
        }
    },
    800,
  ), []);

  // debug
  useEffect(() => {
    console.log(articleQuery)
  }, [articleQuery])

  const setArticleQueryAndSearch = (query: ArticleQuery) => {
    setArticleQuery(query);
    searchWithQuery(articleResults, query);
  }

  const loadMoreArticles = () => {
    const newQuery: ArticleQuery = {
      ...articleQuery,
      page: articleQuery.page === undefined ? 0 : articleQuery.page + 1,
    };
    setArticleQuery(newQuery);
    searchWithQuery(articleResults, newQuery);
  }


  const [searchOptionsOpen, setSearchOptionsOpen] = useState(false);

  const onCategoryClicked = (text: string) => {
    const newQuery: ArticleQuery = {
      ...articleQuery,
      categories: text,
    };
    setArticleQuery(newQuery);
    searchWithQuery(articleResults, newQuery);
    setSearchOptionsOpen(true);
    scrollToTop();
  }

  const onTopicClicked = (text: string) => {
    const newQuery: ArticleQuery = {
      ...articleQuery,
      topic: text,
    };
    setArticleQuery(newQuery);
    searchWithQuery(articleResults, newQuery);
    setSearchOptionsOpen(true);
    scrollToTop();
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 100,
      behavior: 'smooth'
    });
  }

  const makeArticleCountText = () => {
    if (articleResults.total === undefined || articleResults.total <= 0) {
      return undefined; 
    }

    // in case of 'text' search, show all articles which can be fetched
    if (articleQuery.search_type === undefined || articleQuery.search_type === "text") {
      return `Found ${articleResults.total} articles`;
    }

    // in case of 'semantic' and 'combined' search, only the first (max) page_size results are shown
    return `Showing ${articleResults.results.length} most relevant articles`;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <ArticleSearchBar
        categories={categoryResults.results.map(cat => cat.name).sort()}
        articleQuery={articleQuery}
        setArticleQuery={setArticleQueryAndSearch}
        onSearchPressed={() => { searchWithQuery(articleResults, articleQuery); }}
        optionsOpen={searchOptionsOpen}
        setOptionsOpen={setSearchOptionsOpen}
      /> 
      <ArticleList 
        articleCountText={makeArticleCountText()}
        articleResults={articleResults.results} 
        moreArticlesPresent={moreCanBeFetched} 
        onListEndReached={loadMoreArticles}
        onCategoryClicked={onCategoryClicked}
        onTopicClicked={onTopicClicked}
      />
    </div>
  );
}