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
  const groupedTopics: { 
    [key: string]: {
      query: TopicFilterQuery,
      articleSum: number,
      topics: (TopicResult & { normalizedCount?: number })[],
    }
  } = {};

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


  // const topicLabels = groupedTopics[Object.keys(groupedTopics)[0]].map(topic => topic.topic!);
  // const topicCounts = groupedTopics[Object.keys(groupedTopics)[0]].map(topic => topic.count!); 
  const topicLabels = topicResults.map(topic => topic.topic!);
  const smallTopicLabels = topicResults.map(topic => topic.topic!.split(' ').slice(0, 3).join(' '));
  const topicCounts = topicResults.map(topic => topic.count!); 

  const range = Object.keys(groupedTopics)[0]?.split('-');

  const start = range && new Date(range[0]);
  const end = range && new Date(range[1]);

  const title = `Topics ${start !== undefined && end !== undefined ? `between ${start.toDateString()} - ${end.toDateString()}` : ''}`;


  const options = {
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
        display: true,
        text: title,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: TooltipItem<any>[]) => {
            return topicLabels[tooltipItems[0].dataIndex];
          }
        }
      }
    },
  };
    

  const data = {
    // topicLabels,
    // labels,
    labels: smallTopicLabels,
    datasets: [
      {
        label: `Article Count`,
        data: topicCounts,
        // data: topicCounts.map(() => 10),
        // data: labels.map(() => 10),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };


  // const wcd = {
  //   // text
  //   labels: ['Hello', 'world', 'normally', 'you', 'want', 'more', 'words', 'than', 'this'],
  //   datasets: [
  //     {
  //       label: 'DS',
  //       // size in pixel
  //       data: [90, 80, 70, 60, 50, 40, 30, 20, 10],
  //     },
  //   ],
  // }

  // const wco = {
  //   plugins: [WordCloudChart],
  // }


  // const data = {
  //   labels,
  //   datasets: [
  //     {
  //       label: 'Dataset 1',
  //       data: labels.map(() => 10),
  //       borderColor: 'rgb(255, 99, 132)',
  //       backgroundColor: 'rgba(255, 99, 132, 0.5)',
  //     },
  //     {
  //       label: 'Dataset 2',
  //       data: labels.map(() => 20),
  //       borderColor: 'rgb(53, 162, 235)',
  //       backgroundColor: 'rgba(53, 162, 235, 0.5)',
  //     },
  //   ],
  // };
  
  return (
    <div className="flex flex-col items-center gap-4 mb-24 w-full">


      <Bar
        options={options}
        data={data}
      />

      {
        Object.keys(groupedTopics).map(dateRange => (
          <div key={dateRange}>
            <p>{dateRange}</p>
            <div className="flex flex-row flex-wrap gap-2 justify-center items-center">
              {shuffle(groupedTopics[dateRange].topics).map(topic => (
              // {/* {middleSort(groupedTopics[dateRange].topics).map(topic => ( */}
                <p
                  key={dateRange + topic.id}
                  className="p-4 bg-slate-200 mb-4 rounded-md
                  "
                  style={{
                    // fontSize: `${topic.count! * 0.8}px`,
                    fontSize: `${0.5 + topic.normalizedCount! * 9}rem`,
                    // flex: `${1 + topic.normalizedCount! * 9} 1 ${5 + topic.normalizedCount! * 95}%`,
                    width: `${10 + topic.normalizedCount! * 90}%`,
                    height: `${10 + topic.normalizedCount! * 90}%`,
                  }}
                >{topic.topic}</p>
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


function middleSort(array: any & { count?: number }[]) {

  const sorted = [...array].sort((a, b) => b.count! - a.count!);
  const copy = [...array];

  let m = Math.floor(sorted.length / 2);
  for (let i = sorted.length-1; i >= 0; i--) {

    let ind = (i % 2 === 0) ? m + sorted.length - i : m - sorted.length + i;
    copy[ind] = sorted[i]; 
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
