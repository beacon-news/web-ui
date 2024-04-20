import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

interface TopicData {
  topic: string;
  articleCount: number;
}

interface Props {
  topicsData: TopicData[];
}

const data = [
  {
    topic: "Topic 1",
    articleCount: 10,
  },
  {
    topic: "Topic 2",
    articleCount: 20,
  },
  {
    topic: "Topic 3",
    articleCount: 30,
  },
  {
    topic: "Topic 4",
    articleCount: 40,
  },
]

const TopicChart: React.FC<Props> = ({ topicsData }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    Chart.register(...registerables);

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const topicsData = data;

    const topicLabels = topicsData.map((data) => data.topic);
    const articleCounts = topicsData.map((data) => data.articleCount);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topicLabels,
        datasets: [{
          label: 'Number of Articles',
          data: articleCounts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        animation: {
          duration: 1000,
        },
        scales: {
          x: {
            ticks: {
              // beginAtZero: true,
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `Articles: ${context.formattedValue}`,
            },
          },
        },
      },
    });
  }, [topicsData]);

  return <canvas ref={chartRef} />;
};

export default TopicChart;
