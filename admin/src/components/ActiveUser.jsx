import React, { useEffect, useState } from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import axios from 'axios';

const ActiveUser = () => {
  const [dauData, setDauData] = useState([]);
  const [timeRange, setTimeRange] = useState('30'); // '7', '30', or 'all'
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('http://localhost:5500/api/analytics/dau');

        const processedData = res.data.map(item => ({
          date: new Date(item.date).toISOString().split('T')[0],
          count: item.count
        }));

        const filteredData = filterDataByTimeRange(processedData, timeRange);
        setDauData(filteredData);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch DAU data', err);
        setError('Failed to load user activity data');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const filterDataByTimeRange = (data, range) => {
    if (range === 'all') return data;

    const days = parseInt(range);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days + 1);

    return data.filter(item => new Date(item.date) >= cutoff);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      return (
        <div className="bg-gray-800 text-white p-3 rounded shadow-lg opacity-90">
          <p className="font-medium mb-1">{formattedDate}</p>
          <p className="text-blue-300 mb-1">{`Active Users: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const insights = {
    totalActiveUsers: dauData.reduce((acc, day) => acc + day.count, 0),
    uniqueDays: dauData.length,
    average: dauData.length > 0 ? (dauData.reduce((acc, day) => acc + day.count, 0) / dauData.length).toFixed(1) : 0,
    highest: dauData.length > 0 ? Math.max(...dauData.map(day => day.count)) : 0,
    currentMonth: getCurrentMonthActiveUsers(dauData),
    latestCount: dauData.length > 0 ? dauData[dauData.length - 1].count : 0
  };

  function getCurrentMonthActiveUsers(data) {
    const now = new Date();
    return data
      .filter(item => {
        const date = new Date(item.date);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, item) => sum + item.count, 0);
  }

  const renderChart = () => (
    <BarChart 
      data={dauData}
      margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
      <XAxis 
        dataKey="date" 
        stroke="#6b7280"
        tick={{ fill: '#6b7280', fontSize: 12 }}
        tickLine={{ stroke: '#9ca3af' }}
        tickFormatter={(value) => {
          const date = new Date(value);
          return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }}
      />
      <YAxis 
        allowDecimals={false}
        stroke="#6b7280"
        tick={{ fill: '#6b7280', fontSize: 12 }}
        tickLine={{ stroke: '#9ca3af' }}
        width={30}
        domain={[0, dataMax => Math.max(3, dataMax)]}
      />
      <Tooltip content={<CustomTooltip />} />
      <Legend 
        verticalAlign="top"
        height={36}
        iconType="circle"
        iconSize={10}
      />
      <Bar 
        dataKey="count" 
        name="Active Users" 
        fill="#4f46e5"
        radius={[4, 4, 0, 0]}
        animationDuration={1500}
      />
    </BarChart>
  );

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-6 w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Daily Active Users</h2>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading activity data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md mt-6 w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Daily Active Users</h2>
        <div className="flex justify-center items-center h-64 bg-red-50 rounded-lg">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Daily Active Users</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Period:</span>
          <div className="flex border rounded-md overflow-hidden">
            <button 
              className={`px-3 py-1 text-sm ${timeRange === '7' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-600'}`}
              onClick={() => setTimeRange('7')}
            >
              7d
            </button>
            <button 
              className={`px-3 py-1 text-sm ${timeRange === '30' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-600'}`}
              onClick={() => setTimeRange('30')}
            >
              30d
            </button>
            <button 
              className={`px-3 py-1 text-sm ${timeRange === 'all' ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-600'}`}
              onClick={() => setTimeRange('all')}
            >
              All
            </button>
          </div>
        </div>
      </div>

      <div className="border rounded-lg p-4 bg-gray-50">
        <ResponsiveContainer width="100%" height={350}>
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {dauData.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Total Active Users</p>
              <p className="text-xl font-bold text-blue-600">{insights.totalActiveUsers}</p>
              <p className="text-xs text-gray-500 mt-1">Across all recorded days</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Active Days</p>
              <p className="text-xl font-bold text-green-600">{insights.uniqueDays}</p>
              <p className="text-xs text-gray-500 mt-1">Days with user activity</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Latest Day Count</p>
              <p className="text-xl font-bold text-purple-600">{insights.latestCount}</p>
              <p className="text-xs text-gray-500 mt-1">Most recent day's active users</p>
            </div>
          </div>

          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium text-gray-700 mb-2">Usage Details</h3>
            <div className="text-sm text-gray-600">
              <p>• Data shows <strong>{insights.uniqueDays}</strong> days with user activity.</p>
              <p>• Most recent day ({new Date(dauData[dauData.length - 1].date).toLocaleDateString()}) had <strong>{insights.latestCount}</strong> active users.</p>
              <p>• Total of <strong>{insights.totalActiveUsers}</strong> user activities recorded.</p>
              <p>• Average of <strong>{insights.average}</strong> active users per day when activity occurred.</p>
              {insights.highest > 1 && (
                <p>• Peak activity: <strong>{insights.highest}</strong> users on a single day.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ActiveUser;
