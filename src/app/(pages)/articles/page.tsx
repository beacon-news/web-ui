"use client";
import { ArticleQuery } from "@/app/lib/models/article-query";
import { ArticleResults } from "@/app/lib/models/article";
import searchArticles from "@/app/lib/service/article-search";
import ArticleList from "@/app/ui/article-list";
import ArticleSearchBar from "@/app/ui/article-search-bar";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import fetchCategories from "@/app/lib/service/category-search";
import { CategoryResults } from "@/app/lib/models/category";
import { useRouter } from "next/navigation";


export default function Page() {

  const [categoryResults, setCategoryResults] = useState<CategoryResults>({
    total: 0,
    results: [], 
  });

  useEffect(() => {
    (async () => {
      setCategoryResults(await fetchCategories());
    })();
  }, []);

  const [articleResults, setArticleResults] = useState<ArticleResults>({
    total: 0,
    results: [],
  });

  // start at -1 so incrementing it when encountering the end of the list gives page '0', the first page to fetch
  const [articleQuery, setArticleQuery] = useState<ArticleQuery>({
    page: -1,
    page_size: 20,
  });

  // TODO: build query from URL params 
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(articleQuery as Record<string, string>);

    const path = `/articles?${params.toString()}`;
    console.log(path);

    const fromPath = new URLSearchParams(path);
    console.log(fromPath);
  }, [articleQuery]);

  const [moreCanBeFetched, setMoreCanBeFetched] = useState(true);

  const searchWithQuery = useCallback(
    useDebouncedCallback(
      async (prevArticleResults: ArticleResults, query: ArticleQuery) => {

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

            console.log('replacing');
            
            // replace the articles
            setArticleResults(fetched);
          } 
          // setFetchedCount(fetched.results.length);
          setMoreCanBeFetched(true);

        } catch (error) {

          // TODO: set error handling, propagate it up
          throw error;
        }
    },
    800,
  ), []);

  useEffect(() => {
    searchWithQuery(articleResults, articleQuery); 
  }, [])

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

  const onCategoryClicked = (text: string) => {
    const newQuery: ArticleQuery = {
      ...articleQuery,
      categories: text,
    };
    setArticleQuery(newQuery);
    searchWithQuery(articleResults, newQuery);
  }

  const onTopicClicked = (text: string) => {
    const newQuery: ArticleQuery = {
      ...articleQuery,
      topic: text,
    };
    setArticleQuery(newQuery);
    searchWithQuery(articleResults, newQuery);
  }


  return (
    <div className="w-full flex flex-col items-center">
      <ArticleSearchBar
        categories={categoryResults.results.map(cat => cat.name).sort()}
        articleQuery={articleQuery}
        setArticleQuery={setArticleQueryAndSearch}
        onSearchPressed={() => { searchWithQuery(articleResults, articleQuery); }}
      /> 
      <ArticleList 
        articleResults={articleResults.results} 
        moreArticlesPresent={moreCanBeFetched} 
        onListEndReached={loadMoreArticles}
        onCategoryClicked={onCategoryClicked}
        onTopicClicked={onTopicClicked}
      />
    </div>
  );
}