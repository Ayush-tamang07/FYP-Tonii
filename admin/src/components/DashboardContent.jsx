import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUsers, FaDumbbell } from 'react-icons/fa';

function DashboardContent() {
  const [userCount, setUserCount] = useState(0);
  const [exerciseCount, setExerciseCount] = useState(0);

  useEffect(() => {
    // Fetch user count
    axios.get('http://localhost:5500/api/admin/readUser')
      .then(response => setUserCount(response.data.length))
      .catch(error => console.error('Error fetching user count:', error));

    // Fetch exercise count
    axios.get('http://localhost:5500/api/exercise')
      .then(response => setExerciseCount(response.data.count))
      .catch(error => console.error('Error fetching exercise count:', error));
  }, []);

  return (
    <div className="flex flex-col p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full max-w-4xl">
        <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
          <FaUsers className="text-4xl text-blue-500 mb-2" />
          <h3 className="text-xl font-semibold mb-2">Users</h3>
          <p className="text-2xl font-bold text-blue-500">{userCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
          <FaDumbbell className="text-4xl text-green-500 mb-2" />
          <h3 className="text-xl font-semibold mb-2">Exercises</h3>
          <p className="text-2xl font-bold text-green-500">{exerciseCount}</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardContent;