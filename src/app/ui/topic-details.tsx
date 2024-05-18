import Link from "next/link";
import { TopicResult } from "../lib/models/topic";
import { makeTopicArticlesLink } from "../(pages)/layout";

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
      >
        <Link
          href={makeTopicArticlesLink({id: topic.id!})}
          target="_blank"
          className="hover:cursor-pointer hover:text-blue-200"
        >{topic.topic}</Link>
      </h2> 
      <div className="mt-4 px-4">
        <p className="text-md text-gray-700">There are {topic.count} articles with this topic.</p> 
        {topic.batch_query &&  
          <TopicDateText 
            dateStart={topic.batch_query.publish_date.start} 
            dateEnd={topic.batch_query.publish_date.end}
          />
        }
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
              <div>
                <img
                  src={topicArticle.image}
                  alt={topicArticle.title.join('\n')}
                  className="w-full h-40 object-cover rounded-md" 
                >
                </img>
                <h3 
                  className="mt-2 text-lg text-center font-bold hover:cursor-pointer hover:text-blue-500"
                  onClick={() => window.open(topicArticle.url, '_blank')} 
                >{topicArticle.title.join('\n')}</h3>
              </div>
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

const TopicDateText = ({dateStart, dateEnd} : {dateStart: Date, dateEnd: Date}) => {
  return (
    <p className="text-md text-gray-700">
      This topic represents articles published between 
      <span className="text-gray-800"> {dateStart.toDateString()} </span> 
      and 
      <span className="text-gray-800"> {dateEnd.toDateString()}</span>
      .
    </p>
  )
}