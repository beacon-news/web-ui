"use client";

import { useEffect} from "react";
import { useInView } from "react-intersection-observer";
import Spinner from "./spinner";
import { ScrollToTop } from "./scroll-to-top";
import { TopicFilterQuery, TopicResult } from "../lib/models/topic";
import { Iceberg } from "next/font/google";
import TopicChart from "./topic-chart";
import { Bar } from "react-chartjs-2";


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

  // group topics according to the topic query (date range) they belong to
  type GroupedTopic = { 
    query: TopicFilterQuery,
    articleSum: number,
    topics: (TopicResult & { normalizedCount?: number })[],
  };
  type GroupedTopics = {
    [key: string]: GroupedTopic
  };

  const groupedTopics: GroupedTopics = {};
  for (const topic of topicResults) {
    if (!topic.query) {
      continue;
    }

    // this will be the group key
    const dateRange = `${topic.query.publish_date.start.toLocaleString()}-${topic.query.publish_date.end.toLocaleString()}`;
    if (!groupedTopics[dateRange]) {
      groupedTopics[dateRange] = {
        query: topic.query,
        articleSum: topic.count!,
        topics: [topic],
      }
    } else {
      groupedTopics[dateRange] = {
        ...groupedTopics[dateRange],
        articleSum: groupedTopics[dateRange].articleSum + topic.count!,
        topics: [...groupedTopics[dateRange].topics, topic],
      };
    }
  }

  // normalize topic article counts
  for (const key in groupedTopics) {
    const topics = groupedTopics[key].topics;
    topics.forEach(topic => topic.normalizedCount = topic.count! / groupedTopics[key].articleSum);
  }

  // const options = {
  //   indexAxis: 'y' as const,
  //   elements: {
  //     bar: {
  //       borderWidth: 2,
  //     },
  //   },
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: 'right' as const,
  //     },
  //     title: {
  //       display: true,
  //       text: title,
  //     },
  //     tooltip: {
  //       callbacks: {
  //         title: (tooltipItems: TooltipItem<any>[]) => {
  //           return topicLabels[tooltipItems[0].dataIndex];
  //         }
  //       }
  //     }
  //   },
  // };
    

  // const data = {
  //   // topicLabels,
  //   // labels,
  //   labels: smallTopicLabels,
  //   datasets: [
  //     {
  //       label: `Article Count`,
  //       data: topicCounts,
  //       // data: topicCounts.map(() => 10),
  //       // data: labels.map(() => 10),
  //       borderColor: 'rgb(255, 99, 132)',
  //       backgroundColor: 'rgba(255, 99, 132, 0.5)',
  //     },
  //   ],
  // };

  const createChartData = (groupedTopic: GroupedTopic) => {
    return {
      // take only the first 3 words from the topic representation
      labels: groupedTopic.topics.map(topic => topic.topic!.split(' ').slice(0, 3).join(' ')),
      datasets: [
        {
          label: `Article Count`,
          data: groupedTopic.topics.map(topic => topic.count!),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
    ],
    }
  }

  const createChartOptions = (groupedTopic: GroupedTopic) => {
    const topics = groupedTopic.topics.map(topic => topic.topic!);
    // const title = `Topics between ${groupedTopic.query.publish_date.start.toLocaleString()} - ${groupedTopic.query.publish_date.end.toLocaleString()}`;
    return {
      indexAxis: 'y' as const,
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          position: 'right' as const,
        },
        title: {
          display: false,
          // display: true,
          // text: title,
        },
        tooltip: {
          callbacks: {
            title: (tooltipItems: TooltipItem<any>[]) => {
              // take all the words from the topic representation
              return topics[tooltipItems[0].dataIndex];
            }
          }
        }
      },
    };
  }


  return (
    <div className="flex flex-col items-center gap-4 mb-24 w-full">

      {
        Object.keys(groupedTopics).map(dateRange => (
          <div 
            key={dateRange}
            className="w-full"
          >
            <p
              className="text-lg"
            >Topics between 
              <span className="text-gray-600"> {groupedTopics[dateRange].query!.publish_date.start.toDateString()} </span>
              and 
              <span className="text-gray-600"> {groupedTopics[dateRange].query!.publish_date.end.toDateString()} </span>
            </p>

            <Bar
              options={createChartOptions(groupedTopics[dateRange])}
              data={createChartData(groupedTopics[dateRange])}
            />
            <div className="flex flex-row flex-wrap gap-2 justify-center items-center">
              {/* {shuffle(groupedTopics[dateRange].topics).map(topic => ( */}
              {middleSort(groupedTopics[dateRange].topics, compareTopicCounts).map(topic => (
                <div
                  key={dateRange + topic.id}
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
          </div>
        ))
      }

      {/* show the elements */}
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
                  <div key={topicArticle.id}>
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


import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';

import { WordCloudChart, WordCloudController, WordElement } from "chartjs-chart-wordcloud";
import { log } from "console";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,

  WordCloudController,
  WordElement,
);

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

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