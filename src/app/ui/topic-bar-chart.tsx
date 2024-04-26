import React, { useCallback } from 'react';
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
import { Bar } from 'react-chartjs-2';
import { TopicResult } from '../lib/models/topic';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);


export default function TopicsBarChart({
  topics,
} : {
  topics: TopicResult[],
}) {

  const createChartData = useCallback((topics: TopicResult[]) => {
    return {
      // take only the first 3 words from the topic representation
      labels: topics.map(topic => topic.topic!.split(' ').slice(0, 3).join(' ')),
      datasets: [
        {
          label: `Article Count`,
          data: topics.map(topic => topic.count!),
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
    ],
    }
  }, []);

  const createChartOptions = useCallback((topics: TopicResult[]) => {
    const topicNames = topics.map(topic => topic.topic!);
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
        },
        tooltip: {
          callbacks: {
            title: (tooltipItems: TooltipItem<any>[]) => {
              // take all the words from the topic representation
              return topicNames[tooltipItems[0].dataIndex];
            }
          }
        }
      },
    };
  }, []);

  return (
    <Bar
      options={createChartOptions(topics)}
      data={createChartData(topics)}
    />
  );
}