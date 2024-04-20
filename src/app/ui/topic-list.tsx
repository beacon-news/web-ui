"use client";

import { useEffect} from "react";
import { useInView } from "react-intersection-observer";
import Spinner from "./spinner";
import { ScrollToTop } from "./scroll-to-top";
import { TopicResult } from "../lib/models/topic";


export default function TopicList({ 
  topicResults, 
  morePresent,
  onListEndReached,
 } : { 
  topicResults: TopicResult[],
  morePresent: boolean,
  onListEndReached: () => void,
}) {
  
  const {ref, inView} = useInView();

  useEffect(() => {
    if (inView) {
      onListEndReached();
    }
  }, [inView])
  
  return (
    <div className="flex flex-col items-center gap-4 mb-24">

      {/* show the articles */}
      {topicResults.length > 0 &&
        <>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 grid-flow-row grid-align-center">
            {topicResults.map((topic) => (
              <div key={topic.id} className="mt-4">

                <p>{topic.topic}</p> 
                <p>{topic.count}</p> 
                {topic.query &&
                  <>
                    <p>Articles between:</p>
                    <p>{topic.query.publish_date.start.toLocaleString()}</p> 
                    <p>{topic.query.publish_date.end.toLocaleString()}</p> 
                  </>
                }
                {topic.representative_articles.map(topicArticle => (
                  <div>
                    <p 
                      onClick={() => window.open(topicArticle.url, '_blank')} 
                    >{topicArticle.title}</p>
                    <p>{topicArticle.author && topicArticle.author.join(", ")}</p>
                    <p>{topicArticle.publish_date.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <ScrollToTop />
        </>
      }

      {/* show loading element if there are more elements to load */}
      {morePresent ? 
        <div className="p-12 flex flex-col items-center gap-4 text-lg text-gray-600">
          <Spinner />
          <div ref={ref} >Loading</div>
        </div>
        :
        (
          // if are no more elements, but there were some, show the end element
          topicResults.length > 0 ?
          <div className="p-12 text-center text-lg text-gray-600">That's it, you've reached the end!</div>
          :
          // there are no more articles, and there were also none before.
          <div className="p-12 text-center text-lg text-gray-600">No topics found.</div>
        )
      }
    </div>
  );
}
