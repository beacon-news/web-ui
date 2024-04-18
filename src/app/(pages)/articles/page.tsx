"use client";
import { ArticleQuery } from "@/app/lib/models/article-query";
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

  // start at -1 so incrementing it when encountering the end of the list gives page '0', the first page to fetch
  const [articleQuery, setArticleQuery] = useState<ArticleQuery>({
    page: -1,
    page_size: 10,
  });

  const [moreCanBeFetched, setMoreCanBeFetched] = useState(true);

  const searchWithQuery = useCallback(
    useDebouncedCallback(
      async (prevArticleResults: FeedArticleResults, query: ArticleQuery) => {

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
    const newQuery = {
      ...articleQuery,
      page: articleQuery.page === undefined ? 0 : articleQuery.page + 1,
    };
    setArticleQuery(newQuery);
    searchWithQuery(articleResults, newQuery);
  }

  return (
    <div className="w-full flex flex-col items-center">
      <SearchBar
        articleQuery={articleQuery}
        setArticleQuery={setArticleQueryAndSearch}
        onSearchPressed={() => { searchWithQuery(articleResults, articleQuery); }}
      /> 
      <ArticleList 
        articleResults={articleResults.results} 
        moreArticlesPresent={moreCanBeFetched} 
        onListEndReached={loadMoreArticles}
      />
      {/* <Suspense fallback={<div>Loading...</div>}>
        <ArticleList articleResults={articles.results} />
      </Suspense> */}
    </div>
  );
}