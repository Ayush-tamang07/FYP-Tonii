import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const WorkoutPlanDetails = () => {
  const { id } = useParams(); // Get workout plan ID from URL
  const [workoutPlanName, setWorkoutPlanName] = useState(""); // Define workoutPlanName state
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkoutPlanExercises = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming JWT token is stored
        if (!token) {
          throw new Error("No authentication token found. Please log in.");
        }

        const response = await axios.get(`http://localhost:5500/api/user/workout-plan/${id}/exercises`, {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token in Authorization header
            "Content-Type": "application/json",
          },
        });

        if (response.data.success) {
          setWorkoutPlanName(response.data.workoutPlanName); // Set workout plan name
          setExercises(response.data.exercises); // Store exercises correctly
        } else {
          setExercises([]);
        }
      } catch (error) {
        console.error("Error fetching exercises:", error);
        if (error.response) {
          console.log("Server Response:", error.response.data);
        }
        setExercises([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPlanExercises(); // Invoke function properly inside useEffect
  }, [id]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">{workoutPlanName || "Workout Plan Details"}</h2>
      {loading ? (
        <p className="text-gray-500">Loading exercises...</p>
      ) : exercises.length > 0 ? (
        <ul className="list-disc list-inside space-y-2">
          {exercises.map((exerciseData) => (
            <li key={exerciseData.id} className="text-gray-700 border-b pb-2">
              <h3 className="font-semibold">{exerciseData.exercise.name}</h3>
              <p><strong>Type:</strong> {exerciseData.exercise.type}</p>
              <p><strong>Muscle Targeted:</strong> {exerciseData.exercise.muscle}</p>
              <p><strong>Equipment:</strong> {exerciseData.exercise.equipment}</p>
              <p><strong>Difficulty:</strong> {exerciseData.exercise.difficulty}</p>
              <p><strong>Category:</strong> {exerciseData.exercise.category}</p>
              <p className="text-sm text-gray-600">{exerciseData.exercise.instructions}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No exercises found for this workout plan.</p>
      )}
    </div>
  );
};

export default WorkoutPlanDetails;
