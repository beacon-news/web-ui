"use client";
import { SearchArticleQuery } from "@/app/lib/models/article-query";
import { FeedArticleResults } from "@/app/lib/models/feed-article";
import getFeed from "@/app/lib/service/feed"
import searchArticles from "@/app/lib/service/search";
import ArticleList from "@/app/ui/article-list";
import SearchBar from "@/app/ui/search-input";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";


export default function Page() {
  // const articleResults = await getFeed();

  const [articleResults, setArticleResults] = useState<FeedArticleResults>({
    total: 0,
    results: [],
  });

  const [articleQuery, setArticleQuery] = useState<SearchArticleQuery>({
    page: 0,
    page_size: 10,
  });

  const setQuery = useDebouncedCallback(
    (searchTerm: string) => {
      setArticleQuery({
        ...articleQuery, 
        query: searchTerm, 
        page: 0, 
      });
    },
    500
  );

  const searchWithQuery = useCallback(
    async (prevArticleResults: FeedArticleResults, query: SearchArticleQuery) => {
      const fetched = await searchArticles(query); 

      if (query.page && query.page > 0) {
        // append the articles
        setArticleResults({
          total: fetched.total,
          results: [...prevArticleResults.results, ...fetched.results],
        })
      } else {
        // replace the articles
        setArticleResults(fetched);
      } 
  }, []);

  useEffect(() => { 
    searchWithQuery(articleResults, articleQuery); 
  }, [articleQuery, searchWithQuery]);

  const loadMoreArticles = () => {
    setArticleQuery({ 
      ...articleQuery, 
      page: articleQuery.page === undefined ? 0 : articleQuery.page + 1
    });
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <SearchBar onInputChanged={setQuery}/> 
      <ArticleList articleResults={articleResults.results} onListEndReached={loadMoreArticles}/>
      {/* <Suspense fallback={<div>Loading...</div>}>
        <ArticleList articleResults={articles.results} />
      </Suspense> */}
    </div>
  );
}