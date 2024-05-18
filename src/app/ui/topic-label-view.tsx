import { TopicResult } from "../lib/models/topic";
import Link from "next/link";
import { makeTopicArticlesLink } from "../(pages)/layout";


export default function TopicsLabelView({
  topics,
} : {
  topics: TopicResult[],
}) {

  type NormalizedTopic = (TopicResult & { normalizedCount?: number })

  // count of articles in the currently fetched topics
  const articleCountInTopics = topics.reduce((acc, topic) => acc + topic.count!, 0)

  const normalizedTopics: NormalizedTopic[] = topics.map(topic => ({
    ...topic,
    normalizedCount: topic.count! / articleCountInTopics,
  }))

  return (
    <div className="flex flex-row flex-wrap gap-2 justify-center items-center">
      {middleSort(normalizedTopics, compareTopicCounts).map(topic => (
        
        <Link
          key={topic.id}
          href={makeTopicArticlesLink(topic)}
          target="_blank"
          className="p-4 bg-slate-200 mb-4 rounded-md text-center flex flex-col items-center gap-y-2 
          hover:cursor-pointer hover:bg-slate-300"
          style={{
            // flex: `${1 + topic.normalizedCount! * 9} 1 ${5 + topic.normalizedCount! * 95}%`,
            // minWidth: `${100 + topic.normalizedCount! * 350}px`,
            // minWidth: `${12 + topic.normalizedCount! * 30}rem`,

            width: `${10 + topic.normalizedCount! * 90}%`,
            height: `${10 + topic.normalizedCount! * 70}%`,
            minWidth: `${12 + topic.normalizedCount! * topics.length}rem`,

            // width: `${10 + topic.normalizedCount! * topics.length}%`,
            // height: `${10 + topic.normalizedCount! * topics.length}%`,
            // backgroundColor: generateColor(topic.batch_id),

            // width: `20%`,
            // height: `10%`,
            // minWidth: `3 rem`,
            // backgroundColor: `hsl(120, ${topic.normalizedCount! * 100}%, ${60 + topic.normalizedCount! * 40}%)`,
          }}
        >
            <p
              style={{
                // fontSize: `${topic.count! * 0.8}px`,
                // fontSize: `${0.5 + topic.normalizedCount! * 9}rem`,
                fontSize: `${0.4 + topic.normalizedCount! * 7}em`,
                // fontSize: `${0.4 + topic.normalizedCount! * topics.length}em`,
              }}
            >{topic.topic}</p>
          <p className="text-sm text-gray-600 mt-4">{topic.count} articles</p>
        </Link>
      ))}
    </div> 
  );
}


function middleSort(array: any[], compareFn?: (a: any, b: any) => number) {

  const sorted = Array.from(array);
  sorted.sort(compareFn);

  const arr = Array.from(sorted);

  let j = 0;
  for (let i = 0; i < sorted.length - 1; i += 2) {
    arr[j] = sorted[i];
    arr[arr.length - 1 - j] = sorted[i+1];
    j++;
  }

  if (sorted.length % 2 == 1) {
    let m = Math.floor(arr.length / 2);
    arr[m] = sorted[sorted.length - 1];
  }

  return arr;
}

function compareTopicCounts(a: TopicResult, b: TopicResult) {
  return a.count! - b.count!;
}
