import React, { useState } from 'react';
import styled from 'styled-components';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import { useTimeTracking } from '../context/TimeTrackingContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.h1`
  margin-bottom: 2rem;
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
  margin: 0 0 1rem 0;
  color: #666;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const ChartCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const TimeRangeButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: ${props => props.active ? '#007bff' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#666'};
  cursor: pointer;
  
  &:hover {
    background: ${props => props.active ? '#0056b3' : '#e0e0e0'};
  }
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ChartTitle = styled.h3`
  margin: 0;
`;

const ChartPlaceholder = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 4px;
  color: #666;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RecordList = styled.div`
  margin-top: 2rem;
  width: 100%;
`;

const RecordItem = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RecordDetails = styled.div`
  display: flex;
  gap: 1rem;
`;

const RecordTime = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const Dashboard: React.FC = () => {
  const { records } = useTimeTracking();
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'quarter'>('week');
  
  console.log('Dashboard records:', records);

  const totalTimeTracked = records.reduce((total, record) => total + record.duration, 0);
  const mostActiveActivity = records.reduce((acc, record) => {
    acc[record.activityType] = (acc[record.activityType] || 0) + record.duration;
    return acc;
  }, {} as Record<string, number>);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Calculate data for pie chart
  const activityDistribution = records.reduce((acc, record) => {
    acc[record.activityType] = (acc[record.activityType] || 0) + record.duration;
    return acc;
  }, {} as Record<string, number>);

  const pieData = {
    labels: Object.keys(activityDistribution),
    datasets: [
      {
        data: Object.values(activityDistribution),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
      },
    ],
  };

  // Calculate data for stacked bar chart
  const getTimeRangeData = () => {
    const now = new Date();
    const data: Record<string, Record<string, number>> = {};
    const labels: string[] = [];

    // Generate labels based on time range
    switch (timeRange) {
      case 'day':
        for (let i = 0; i < 24; i++) {
          labels.push(`${i}:00`);
        }
        break;
      case 'week':
        for (let i = 0; i < 7; i++) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          labels.unshift(date.toLocaleDateString('en-US', { weekday: 'short' }));
        }
        break;
      case 'month':
        for (let i = 0; i < 4; i++) {
          labels.unshift(`Week ${4 - i}`);
        }
        break;
      case 'quarter':
        for (let i = 0; i < 3; i++) {
          labels.unshift(`Month ${3 - i}`);
        }
        break;
    }

    // Initialize data structure
    labels.forEach(label => {
      data[label] = {};
      Object.keys(activityDistribution).forEach(activity => {
        data[label][activity] = 0;
      });
    });

    // Fill in the data
    records.forEach(record => {
      const date = new Date(record.endTime);
      let label = '';

      switch (timeRange) {
        case 'day':
          label = `${date.getHours()}:00`;
          break;
        case 'week':
          label = date.toLocaleDateString('en-US', { weekday: 'short' });
          break;
        case 'month':
          const weekNumber = Math.floor(date.getDate() / 7);
          label = `Week ${weekNumber + 1}`;
          break;
        case 'quarter':
          label = `Month ${date.getMonth() + 1}`;
          break;
      }

      if (data[label]) {
        data[label][record.activityType] = (data[label][record.activityType] || 0) + record.duration;
      }
    });

    return {
      labels,
      datasets: Object.keys(activityDistribution).map((activity, index) => ({
        label: activity,
        data: labels.map(label => data[label][activity] || 0),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ][index % 6],
      })),
    };
  };

  const barData = getTimeRangeData();

  return (
    <DashboardContainer>
      <Header>Dashboard</Header>
      
      <StatsGrid>
        <StatCard>
          <StatTitle>Total Time Tracked</StatTitle>
          <StatValue>{formatDuration(totalTimeTracked)}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Most Active Activity</StatTitle>
          <StatValue>
            {Object.entries(mostActiveActivity).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None'}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Total Sessions</StatTitle>
          <StatValue>{records.length}</StatValue>
        </StatCard>
      </StatsGrid>

      <ChartsContainer>
        <ChartCard>
          <h3>Activity Distribution</h3>
          <Pie data={pieData} />
        </ChartCard>
        
        <ChartCard>
          <h3>Time Distribution</h3>
          <TimeRangeSelector>
            <TimeRangeButton 
              active={timeRange === 'day'} 
              onClick={() => setTimeRange('day')}
            >
              Day
            </TimeRangeButton>
            <TimeRangeButton 
              active={timeRange === 'week'} 
              onClick={() => setTimeRange('week')}
            >
              Week
            </TimeRangeButton>
            <TimeRangeButton 
              active={timeRange === 'month'} 
              onClick={() => setTimeRange('month')}
            >
              Month
            </TimeRangeButton>
            <TimeRangeButton 
              active={timeRange === 'quarter'} 
              onClick={() => setTimeRange('quarter')}
            >
              Quarter
            </TimeRangeButton>
          </TimeRangeSelector>
          <Bar 
            data={barData}
            options={{
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                },
              },
            }}
          />
        </ChartCard>
      </ChartsContainer>

      <RecordList>
        <h3>Recent Sessions</h3>
        {records.map(record => (
          <RecordItem key={record.id}>
            <RecordDetails>
              <div>{record.activityType}</div>
              <RecordTime>
                {new Date(record.endTime).toLocaleString()}
              </RecordTime>
            </RecordDetails>
            <div>{formatDuration(record.duration)}</div>
          </RecordItem>
        ))}
      </RecordList>
    </DashboardContainer>
  );
};

export default Dashboard; 