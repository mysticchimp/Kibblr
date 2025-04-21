import React from 'react';
import { useTimeTracking } from '../context/TimeTrackingContext';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import styled from 'styled-components';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.h3`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin: 0.5rem 0;
  color: #333;
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ChartCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Dashboard: React.FC = () => {
  const { timeEntries } = useTimeTracking();

  // Calculate total time spent
  const totalTime = timeEntries.reduce((total: number, entry) => total + entry.duration, 0);
  const totalHours = Math.floor(totalTime / 3600);
  const totalMinutes = Math.floor((totalTime % 3600) / 60);

  // Calculate time by activity type
  const timeByActivity = timeEntries.reduce((acc: Record<string, number>, entry) => {
    acc[entry.activityType] = (acc[entry.activityType] || 0) + entry.duration;
    return acc;
  }, {});

  // Prepare data for charts
  const barChartData = {
    labels: Object.keys(timeByActivity),
    datasets: [
      {
        label: 'Time Spent (hours)',
        data: Object.values(timeByActivity).map((seconds: number) => Math.round(seconds / 3600)),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: Object.keys(timeByActivity),
    datasets: [
      {
        data: Object.values(timeByActivity).map((seconds: number) => Math.round(seconds / 3600)),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Time Tracking Overview',
      },
    },
  };

  return (
    <DashboardContainer>
      <h1>Dashboard</h1>
      
      <StatsGrid>
        <StatCard>
          <StatTitle>Total Time Tracked</StatTitle>
          <StatValue>
            {totalHours}h {totalMinutes}m
          </StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Total Sessions</StatTitle>
          <StatValue>{timeEntries.length}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Activities Tracked</StatTitle>
          <StatValue>{Object.keys(timeByActivity).length}</StatValue>
        </StatCard>
      </StatsGrid>

      <ChartsContainer>
        <ChartCard>
          <Bar data={barChartData} options={chartOptions} />
        </ChartCard>
        <ChartCard>
          <Pie data={pieChartData} options={chartOptions} />
        </ChartCard>
      </ChartsContainer>
    </DashboardContainer>
  );
};

export default Dashboard; 