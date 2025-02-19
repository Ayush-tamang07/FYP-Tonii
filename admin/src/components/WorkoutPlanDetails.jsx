import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// import { ArrowLeft } from "lucide-react"; // Back Arrow Icon
import { IoMdArrowRoundBack } from "react-icons/io";

const WorkoutPlanDetails = () => {
  const { id } = useParams(); // Get workout plan ID from URL
  const navigate = useNavigate(); // For back navigation
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [newExercise, setNewExercise] = useState({ name: "", sets: "", reps: "", weight: "" });

  useEffect(() => {
    fetchWorkoutPlan();
  }, []);

  const fetchWorkoutPlan = async () => {
    try {
      const response = await axios.get(`http://localhost:5500/api/admin/workout-plans/${id}`);
      if (response.data.success) {
        setWorkoutPlan(response.data.data);
        setExercises(response.data.data.exercises || []);
      }
    } catch (error) {
      console.error("Error fetching workout plan details:", error);
    }
  };

  const handleAddExercise = async () => {
    if (!newExercise.name || !newExercise.sets || !newExercise.reps || !newExercise.weight) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5500/api/admin/workout-plans/${id}/exercises`, newExercise);
      if (response.data.success) {
        setExercises([...exercises, response.data.data]);
        setNewExercise({ name: "", sets: "", reps: "", weight: "" });
      }
    } catch (error) {
      console.error("Error adding exercise:", error);
      alert("Failed to add exercise.");
    }
  };

  return (
    <div className="p-6">
      {/* Back Button */}
      <button className="flex items-center space-x-2 text-gray-600 hover:text-black" onClick={() => navigate("/workoutPlans")}>
        {/* <ArrowLeft size={20} /> */}
        <IoMdArrowRoundBack />
        <span>Back</span>
      </button>

      {workoutPlan ? (
        <>
          <h2 className="text-2xl font-bold mt-4">{workoutPlan.name}</h2>

          {/* Add Exercise Form */}
          <div className="mt-6 bg-gray-100 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Add Exercise</h3>
            <div className="flex gap-2">
              <input type="text" placeholder="Exercise Name" value={newExercise.name} onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })} className="p-2 border rounded w-full" />
              <input type="number" placeholder="Sets" value={newExercise.sets} onChange={(e) => setNewExercise({ ...newExercise, sets: e.target.value })} className="p-2 border rounded w-20" />
              <input type="number" placeholder="Reps" value={newExercise.reps} onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })} className="p-2 border rounded w-20" />
              <input type="number" placeholder="Weight (kg)" value={newExercise.weight} onChange={(e) => setNewExercise({ ...newExercise, weight: e.target.value })} className="p-2 border rounded w-24" />
              <button className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700" onClick={handleAddExercise}>Add</button>
            </div>
          </div>

          {/* Display Exercises */}
          <ul className="mt-6 space-y-2">
            {exercises.map((exercise, index) => (
              <li key={index} className="bg-white shadow p-4 rounded">{exercise.name} - {exercise.sets} sets x {exercise.reps} reps ({exercise.weight} kg)</li>
            ))}
          </ul>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default WorkoutPlanDetails;
