import React, { useEffect, useState } from "react";
import axios from "axios";

const WorkoutPlansContent = () => {
  const [workoutPlans, setWorkoutPlans] = useState([]); // Stores workout plans
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Controls modal visibility
  const [newWorkoutName, setNewWorkoutName] = useState(""); // Stores new workout name

  // ✅ Fetch existing workout plans on component mount
  useEffect(() => {
    fetchWorkoutPlans();
  }, []);

  // 📌 Function to Fetch Workout Plans from API
  const fetchWorkoutPlans = async () => {
    try {
      const response = await axios.get("http://localhost:5500/api/admin/workout-plans");

      console.log("Workout Plans API Response:", response.data);

      if (response.data && Array.isArray(response.data.data)) {
        setWorkoutPlans(response.data.data); // ✅ Set fetched workout plans
      } else {
        setWorkoutPlans([]); // Ensure it's always an array
      }
    } catch (error) {
      console.error("Error fetching workout plans:", error);
      setWorkoutPlans([]); // Prevent undefined errors
    }
  };

  // 📌 Function to Handle Workout Plan Creation
  const handleSaveWorkoutPlan = async () => {
    if (!newWorkoutName.trim()) {
      alert("Workout name cannot be empty!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5500/api/admin/workout-plans", {
        name: newWorkoutName,
      });

      if (response.data.success) {
        setWorkoutPlans([...workoutPlans, response.data.data]); // ✅ Append new plan to state
        handleCloseModal();
      }
    } catch (error) {
      console.error("Error creating workout plan:", error);
      alert("Failed to create workout plan.");
    }
  };

  // 📌 Function to Handle Modal Open/Close
  const handleAddClick = () => setIsAddModalOpen(true);
  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setNewWorkoutName(""); // ✅ Clear input field
  };

  return (
    <>
      <div className="p-6">
        {/* Create Workout Plan Button */}
        <div className="mb-6 flex justify-end">
          <button
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded shadow-lg"
            onClick={handleAddClick}
          >
            Create Workout Plan
          </button>
        </div>

        {/* Grid Layout for Workout Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 cursor-pointer">
          {Array.isArray(workoutPlans) && workoutPlans.length > 0 ? (
            workoutPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white shadow-md rounded-lg p-6 flex flex-col space-y-2"
              >
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <div className="flex justify-end space-x-4 mt-4">
                  {/* <button className="text-purple-600 hover:underline">View</button> */}
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

      {/* Add Workout Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-1/2 overflow-y-auto relative">
            <h2 className="text-xl font-bold mb-4">Create Workout Plan</h2>

            <label className="block text-gray-700 mb-2">Workout Name</label>
            <input
              type="text"
              placeholder="Enter workout name"
              value={newWorkoutName}
              onChange={(e) => setNewWorkoutName(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />

            {/* Modal Buttons */}
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <button
                className="bg-gray-300 px-3 py-2 rounded hover:bg-gray-400"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                onClick={handleSaveWorkoutPlan}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkoutPlansContent;
