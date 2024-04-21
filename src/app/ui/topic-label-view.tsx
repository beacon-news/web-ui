import { TopicResult } from "../lib/models/topic";
import { GroupedTopic } from "./grouped-topic-display";

export default function TopicsLabelView({
  groupedTopic,
} : {
  groupedTopic: GroupedTopic,
}) {

  return (
    <div className="flex flex-row flex-wrap gap-2 justify-center items-center">
      {middleSort(groupedTopic.topics, compareTopicCounts).map(topic => (
        <div
          key={topic.id}
          className="p-4 bg-slate-200 mb-4 rounded-md
          text-center flex flex-col items-center gap-y-2"
          style={{
            // flex: `${1 + topic.normalizedCount! * 9} 1 ${5 + topic.normalizedCount! * 95}%`,
            // minWidth: `${100 + topic.normalizedCount! * 350}px`,
            minWidth: `${12 + topic.normalizedCount! * 30}rem`,
            width: `${10 + topic.normalizedCount! * 90}%`,
            height: `${10 + topic.normalizedCount! * 90}%`,
          }}
        >
          <p
            style={{
              // fontSize: `${topic.count! * 0.8}px`,
              // fontSize: `${0.5 + topic.normalizedCount! * 9}rem`,
              fontSize: `${0.5 + topic.normalizedCount! * 7}em`,
            }}
          >{topic.topic}</p>
          <p className="text-sm text-gray-600 mt-4">{topic.count} articles</p>
        </div>
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

// TODO: remove this if unused
function shuffle(array: any[]) {

  const copy = [...array];

  let n = array.length;
  let i;

  while (n) {
    i = Math.floor(Math.random() * n--);
    [copy[n], copy[i]] = [copy[i], copy[n]];
  }

  return copy;
}