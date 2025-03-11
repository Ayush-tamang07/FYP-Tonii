import React, { useEffect, useState } from "react";
import axios from "axios";

const WorkoutPlansContent = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [exercises, setExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);

  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  const fetchWorkoutPlans = async () => {
    try {
      const response = await axios.get("http://localhost:5500/api/admin/workout-plans");
      if (response.data && Array.isArray(response.data.data)) {
        setWorkoutPlans(response.data.data);
      } else {
        setWorkoutPlans([]);
      }
    } catch (error) {
      console.error("Error fetching workout plans:", error);
      setWorkoutPlans([]);
    }
  };

  const fetchExercises = async () => {
    try {
      const response = await axios.get("http://localhost:5500/api/exercise");
      if (response.data.success && Array.isArray(response.data.data)) {
        setExercises(response.data.data);
      } else {
        setExercises([]);
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
      setExercises([]);
    }
  };

  const handleSaveWorkoutPlan = async () => {
    if (!newWorkoutName.trim()) {
      alert("Workout name cannot be empty!");
      return;
    }

    if (selectedExercises.length === 0) {
      alert("Please select at least one exercise.");
      return;
    }

    try {
      const createPlanResponse = await axios.post("http://localhost:5500/api/admin/workout-plans", {
        name: newWorkoutName,
      });

      if (createPlanResponse.data.success) {
        const workoutPlanId = createPlanResponse.data.data.id;

        await axios.post("http://localhost:5500/api/workout-plans/add-exercise", {
          workoutPlanId,
          exercises: selectedExercises,
        });

        fetchWorkoutPlans();
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error creating workout plan or adding exercises:", error);
      alert("Failed to create workout plan.");
    }
  };

  const handleAddClick = () => {
    fetchExercises();
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setNewWorkoutName("");
    setSelectedExercises([]);
  };

  const handleExerciseSelection = (exerciseId) => {
    setSelectedExercises((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  return (
    <>
      <div className="p-6">
        <div className="mb-6 flex justify-end">
          <button
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded shadow-lg"
            onClick={handleAddClick}
          >
            Create Workout Plan
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 cursor-pointer">
          {workoutPlans.length > 0 ? (
            workoutPlans.map((plan) => (
              <div key={plan.id} className="bg-white shadow-md rounded-lg p-6 flex flex-col space-y-2">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="flex justify-end space-x-4 mt-4">
                  <button className="text-blue-600 hover:underline">Edit</button>
                  <button className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No workout plans available.</p>
          )}
        </div>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-3/4 overflow-hidden flex flex-col">
            <h2 className="text-xl font-bold mb-4">Create Workout Plan</h2>

            <label className="block text-gray-700 mb-2">Workout Name</label>
            <input
              type="text"
              value={newWorkoutName}
              onChange={(e) => setNewWorkoutName(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter workout name"
            />

            <h3 className="text-lg font-semibold mt-4">Select Exercises</h3>
            <div className="flex-1 overflow-y-auto border p-2 rounded">
              {exercises.map((exercise) => (
                <div key={exercise.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedExercises.includes(exercise.id)}
                    onChange={() => handleExerciseSelection(exercise.id)}
                    className="mr-2"
                  />
                  <span>{exercise.name}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end space-x-2 sticky bottom-0 bg-white p-4">
              <button className="bg-gray-300 px-3 py-2 rounded" onClick={handleCloseModal}>Cancel</button>
              <button className="bg-green-600 text-white px-3 py-2 rounded" onClick={handleSaveWorkoutPlan}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkoutPlansContent;
