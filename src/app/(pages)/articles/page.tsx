import getFeed from "@/app/lib/service/feed"
import ArticleList from "@/app/ui/article-list";


export default async function Page() {
  const articleResults = await getFeed();

  return <div className="max-w-5xl mx-auto">
    <ArticleList articleResults={articleResults.results} />;
  </div>
}