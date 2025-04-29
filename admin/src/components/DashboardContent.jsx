import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUsers, FaDumbbell, FaComment } from "react-icons/fa";
import ActiveUser from "./ActiveUser";

function DashboardContent() {
  const [userCount, setUserCount] = useState(0);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token

    axios
      .get("http://localhost:5500/api/admin/readUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUserCount(response.data.users.length); // Corrected from response.data.length
      })
      .catch((error) => console.error("Error fetching user count:", error));

    // Fetch exercise count
    axios
      .get("http://localhost:5500/api/exercise")
      .then((response) => setExerciseCount(response.data.count))
      .catch((error) => console.error("Error fetching exercise count:", error));

    axios
      .get("http://localhost:5500/api/admin/readfeedback")
      .then((response) => setFeedbackCount(response.data.length))
      .catch((error) => console.error("Error fetching feedback count:", error));
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
        <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center">
          <FaComment className="text-4xl text-orange-500 mb-2" />
          <h3 className="text-xl font-semibold mb-2">Feedback</h3>
          <p className="text-2xl font-bold text-orange-500">{feedbackCount}</p>
        </div>
      </div>
      <div className="">
        <ActiveUser/>
      </div>
    </div>
  );
}

export default DashboardContent;
