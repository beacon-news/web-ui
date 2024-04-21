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
import { GroupedTopic } from './grouped-topic-display';
import { Bar } from 'react-chartjs-2';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);


export default function TopicsBarChart({
  groupedTopic,
} : {
  groupedTopic: GroupedTopic,
}) {

  const createChartData = useCallback((groupedTopic: GroupedTopic) => {
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
  }, []);

  const createChartOptions = useCallback((groupedTopic: GroupedTopic) => {
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
  }, []);

  return (
    <Bar
      options={createChartOptions(groupedTopic)}
      data={createChartData(groupedTopic)}
    />
  );
}