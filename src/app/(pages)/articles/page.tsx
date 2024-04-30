"use client";
import { ArticleQuery } from "@/app/lib/models/article-query";
import searchArticles from "@/app/lib/service/article-search";
import ArticlesDisplay from "@/app/ui/articles-display";
import ArticleSearchBar from "@/app/ui/article-search-bar";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Results } from "@/app/lib/models/results";
import { CategoryResult } from "@/app/lib/models/category";
import { ArticleCategory, ArticleResult, ArticleTopic } from "@/app/lib/models/article";
import { makeTopicArticlesLink } from "../layout";
import fetchCategories from "@/app/lib/service/category-search";


export default function Page() {

  const [categoryResults, setCategoryResults] = useState<Results<CategoryResult>>({
    total: 0,
    results: [],
  });

  const [articleResults, setArticleResults] = useState<Results<ArticleResult>>({
    total: 0,
    results: [],
  });

  const [articleQuery, setArticleQuery] = useState<ArticleQuery>({
    page: 0,
    page_size: 20,
  });

  const [loading, setLoading] = useState(true);

  const searchWithQuery = useDebouncedCallback(
    async (prevArticleResults: Results<ArticleResult>, query: ArticleQuery) => {
      console.log("fetching articles", query);
      
      if (
        // semantic search doesn't take paging into account, always returns the K first results
        (query.search_type === "combined" || query.search_type === "semantic") && query.page! > 0
      ) {
        setLoading(false);
        return;
      }

      setLoading(true);

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

      } catch (error) {
        // TODO: set error handling, propagate it up
        throw error;
      } finally {
        setLoading(false);
      }
    }, 
    500,
  );

  // debug
  useEffect(() => {
    console.log(articleQuery)
  }, [articleQuery])


  useEffect(() => {
    (async () => {
      const results = await fetchCategories();
      setCategoryResults(results);
    })();
  }, []);


  // fetch initial articles
  useEffect(() => {
    searchWithQuery(articleResults, articleQuery);
    setArticleQuery({
      ...articleQuery,
      page: articleQuery.page === undefined ? 0 : articleQuery.page + 1,
    });
  }, [])


  const setArticleQueryAndSearch = (query: ArticleQuery) => {
    setArticleQuery(query);
    searchWithQuery(articleResults, query);
  }

  const loadMoreArticles = () => {
    // don't load more if there is nothing more to load
    if (articleResults.total <= articleResults.results.length) {
      return;
    }
    searchWithQuery(articleResults, articleQuery);
    setArticleQuery({
      ...articleQuery,
      page: articleQuery.page === undefined ? 0 : articleQuery.page + 1,
    });
  }


  const [searchOptionsOpen, setSearchOptionsOpen] = useState(false);

  const onCategoryClicked = (category: ArticleCategory) => {
    const newQuery: ArticleQuery = {
      ...articleQuery,
      categories: category.name,
    };
    setArticleQuery(newQuery);
    searchWithQuery(articleResults, newQuery);
    setSearchOptionsOpen(true);
    scrollToTop();
  }

  // const onTopicClicked = (topic: ArticleTopic) => {
  //   const newQuery: ArticleQuery = {
  //     ...articleQuery,
  //     topic: topic.topic,
  //   };
  //   setArticleQuery(newQuery);
  //   searchWithQuery(articleResults, newQuery);
  //   setSearchOptionsOpen(true);
  //   scrollToTop();
  // }

  const navigateToTopicArticles = (topic: ArticleTopic) => {
    window.open(makeTopicArticlesLink(topic), '_blank');
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
    <div className="w-full flex flex-col items-center gap-4">
      <ArticleSearchBar
        categories={categoryResults.results.map(cat => cat.name).sort()}
        articleQuery={articleQuery}
        setArticleQuery={setArticleQueryAndSearch}
        onSearchPressed={() => { searchWithQuery(articleResults, articleQuery); }}
        optionsOpen={searchOptionsOpen}
        setOptionsOpen={setSearchOptionsOpen}
      /> 
      <ArticlesDisplay 
        articleCountText={makeArticleCountText()}
        articleResults={articleResults} 
        loading={loading}
        onListEndReached={loadMoreArticles}
        onCategoryClicked={onCategoryClicked}
        // onTopicClicked={onTopicClicked}
        onTopicClicked={navigateToTopicArticles}
      />
    </div>
  );
}