import { TopicResult } from "../lib/models/topic";

export default function TopicDetails({
  topic,
} : {
  topic: TopicResult,
}) {

  return (
    <div 
      className="mt-4 pb-4 outline outline-2 outline-gray-200 shadow-lg shadow-gray-300 rounded-md"
    >
      <h2 className="w-full bg-slate-700 text-white text-lg text-center py-2 mb-6
      rounded-t-md"
      >{topic.topic}</h2> 
      <div className="mt-4 px-4">
        <p className="text-md text-gray-700">There are {topic.count} articles with this topic.</p> 
        <p className="text-md text-gray-700">Representative articles:</p> 
        <div
          className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3" 
        >
          {topic.representative_articles.map(topicArticle => (
            <div 
              key={topicArticle.id}
              className="flex flex-col gap-y-4 bg-slate-200 p-4 justify-between rounded-md
              outline-1 outline-gray-200 "
            >
              <h3 
                className="text-lg text-center font-bold hover:cursor-pointer hover:text-blue-500"
                onClick={() => window.open(topicArticle.url, '_blank')} 
              >{topicArticle.title}</h3>
              <div>
                {topicArticle.author !== undefined &&  topicArticle.author.join(", ").trim() !== "" &&
                  <p
                    className="text-sm text-gray-600"
                  >Author(s): {topicArticle.author.join(", ")}</p>
                }
                <p
                  className="text-sm text-gray-600"
                >{topicArticle.publish_date.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}