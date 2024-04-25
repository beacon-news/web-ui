import { ArticleQuery } from "@/app/lib/models/article-query";
// import { ArticleResults } from "@/app/lib/models/article";
import searchArticles from "@/app/lib/service/article-search";
import fetchCategories from "@/app/lib/service/category-search";
import Wrapper from "./wrapper";


export default async function Page() {

  const categoryResults = await fetchCategories();
  const articleQuery: ArticleQuery = {
    page: 0,
    page_size: 20,
  }
  const articleResults = await searchArticles(articleQuery);

  return (
    <Wrapper 
      categoryResults={categoryResults}
      initialArticleQuery={articleQuery}
      initialArticles={articleResults}
    />
  );
}