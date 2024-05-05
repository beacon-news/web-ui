import { ArticleQuery } from "@/app/lib/models/article-query";
import searchArticles from "@/app/lib/service/article-search";
import TopicArticlesPage from "./topic-articles-page";
import searchTopics from "@/app/lib/service/topic-search";


export default async function Page(
{ 
  params,
} : {
  params: { 
    id: string 
  },
}) {

  // TODO: add error handling

  const topicResults = await searchTopics({
    ids: [params.id],
    page: 0,
    page_size: 1,
  });

  if (topicResults.results.length < 1) {
    throw new Error("Topic not found"); 
  }

  const topic = topicResults.results[0];

  const representativeArticlesQuery: ArticleQuery = {
    ids: topic.representative_articles.map(art => art.id),
  }
  const representativeArticles = await searchArticles(representativeArticlesQuery);

  const articleQuery: ArticleQuery = {
    topic_ids: [params.id],
    page: 0,
    page_size: 20,
  }
  const articleResults = await searchArticles(articleQuery);

  return (
    <TopicArticlesPage 
      topic={topicResults.results[0]}
      representativeArticles={representativeArticles}
      initialArticles={articleResults}
      initialArticleQuery={articleQuery}
    />
  );
}