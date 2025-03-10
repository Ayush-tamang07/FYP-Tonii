import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  typeOptions,
  muscleOptions,
  difficultyOptions,
  categoryOptions,
  equipmentOptions,
} from "../data/exerciseOption.js";

function ExerciseContent() {
  const [exercises, setExercises] = useState([]); // Default empty array
  const [expandedRows, setExpandedRows] = useState({}); // Track expanded instructions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"
  const [newExercise, setNewExercise] = useState({
    name: "",
    type: "",
    muscle: "",
    equipment: "",
    difficulty: "",
    category: "",
    instructions: "",
  });
  // const [originalExercises, setOriginalExercises] = useState([]);
  const [editExercise, setEditExercise] = useState(null); // Track the exercise being edited
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await axios.get("http://localhost:5500/api/exercise");
        console.log("API Response:", response.data);

        if (response.data && Array.isArray(response.data.data)) {
          setExercises(response.data.data);
        } else {
          console.error("Unexpected API response format:", response.data);
          setExercises([]);
        }
      } catch (error) {
        console.error("Error fetching exercises:", error);
        setExercises([]);
        setOriginalExercises([]);
      }
    };

    fetchExercises();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5500/api/admin/deleteExercise/${id}`
      );
      setExercises((prevExercises) =>
        prevExercises.filter((exercise) => exercise.id !== id)
      );
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  };

  // Toggle Expand/Collapse Instructions
  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExercise((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExercise = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5500/api/admin/addExercise",
        {
          ...newExercise,
          instructions: newExercise.instructions || "No instructions provided.",
        }
      );

      // Re-fetch all exercises after successful addition
      const updatedExercises = await axios.get(
        "http://localhost:5500/api/exercise"
      );
      setExercises(updatedExercises.data.data);

      // Show success message in the form
      setMessage("Exercise added successfully!");
      setMessageType("success");

      // Reset form after a delay
      setTimeout(() => {
        setIsModalOpen(false);
        setMessage(""); // Clear message after closing
        setNewExercise({
          name: "",
          type: "",
          muscle: "",
          equipment: "",
          difficulty: "",
          category: "",
          instructions: "",
        });
      }, 1500); // Close modal after 1.5 seconds
    } catch (error) {
      if (error.response) {
        // Handle duplicate exercise error (409 Conflict)
        if (error.response.status === 409) {
          setMessage(
            "An exercise with the same name, muscle, and equipment already exists."
          );
          setMessageType("error");
        } else {
          setMessage(`Error: ${error.response.data.message}`);
          setMessageType("error");
        }
      } else {
        console.error("Error adding exercise:", error);
        setMessage("An unexpected error occurred. Please try again.");
        setMessageType("error");
      }
    }
  };

  const [filters, setFilters] = useState({
    equipment: "",
    category: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilter = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await axios.get(
        `http://localhost:5500/api/exercise?${queryParams}`
      );

      if (response.data && Array.isArray(response.data.data)) {
        setExercises(response.data.data);
      } else {
        setExercises([]);
      }
    } catch (error) {
      console.error("Error applying filters:", error);
      setExercises([]);
    }
  };

  const clearFilters = async () => {
    setFilters({ equipment: "", category: "" });

    try {
      const response = await axios.get("http://localhost:5500/api/exercise");
      if (response.data && Array.isArray(response.data.data)) {
        setExercises(response.data.data);
      } else {
        setExercises([]);
      }
    } catch (error) {
      console.error("Error clearing filters:", error);
      setExercises([]);
    }
  };

  const handleEditClick = (exercise) => {
    setEditExercise(exercise);
    setIsEditModalOpen(true);
  };
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditExercise((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleUpdateExercise = async () => {
    if (!editExercise || !editExercise.id) {
      console.error("Invalid exercise data");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5500/api/admin/updateExercise/${editExercise.id}`,
        editExercise
      );

      if (response.data.success) {
        // Update exercise list after successful update
        const updatedExercises = await axios.get(
          "http://localhost:5500/api/exercise"
        );
        setExercises(updatedExercises.data.data);

        // Close the modal
        setIsEditModalOpen(false);
        setEditExercise(null);
      }
    } catch (error) {
      console.error("Error updating exercise:", error);
    }
  };

  return (
    <>
      <div className="mb-4 flex space-x-4">
        <button
          type="button"
          className=" bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Add
        </button>
        <select
          name="equipment"
          value={filters.equipment}
          onChange={handleFilterChange}
          className="border p-2 mb-2"
        >
          <option value="">Equipment</option>
          {equipmentOptions.map((equipment) => (
            <option key={equipment} value={equipment}>
              {equipment.charAt(0).toUpperCase() + equipment.slice(1)}
            </option>
          ))}
        </select>

        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
          className="border p-2 mb-2"
        >
          <option value="">Category</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>

        <button
          onClick={applyFilter}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Apply Filter
        </button>

        <button
          onClick={clearFilters}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear Filters
        </button>
      </div>

      <div className="container mx-auto p-4">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Type</th>
              <th className="border border-gray-300 p-2">Muscle</th>
              <th className="border border-gray-300 p-2">Difficulty</th>
              <th className="border border-gray-300 p-2">Category</th>
              <th className="border border-gray-300 p-2">Equipment</th>
              <th className="border border-gray-300 p-2">Instructions</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exercises.length > 0 ? (
              exercises.map((exercise) => (
                <tr key={exercise.id} className="border border-gray-300">
                  <td className="border border-gray-300 p-2">{exercise.id}</td>
                  <td className="border border-gray-300 p-2">
                    {exercise.name}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {exercise.type}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {exercise.muscle}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {exercise.difficulty}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {exercise.category}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {exercise.equipment}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {expandedRows[exercise.id]
                      ? exercise.instructions || "No instructions provided."
                      : `${
                          exercise.instructions
                            ? exercise.instructions.substring(0, 100)
                            : "No instructions provided."
                        }...`}
                    <button
                      onClick={() => toggleExpand(exercise.id)}
                      className="text-blue-500 underline text-sm"
                    >
                      {expandedRows[exercise.id] ? "Read Less" : "Read More"}
                    </button>
                  </td>

                  <td className="p-2 flex space-x-2">
                    <button
                      onClick={() => handleEditClick(exercise)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(exercise.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center p-4">
                  No exercises found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Add New Exercise</h2>

            {/* Show Success or Error Message inside the form */}
            {message && (
              <div
                className={`text-white p-2 rounded mb-4 ${
                  messageType === "success" ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {message}
              </div>
            )}

            <input
              type="text"
              name="name"
              placeholder="Exercise name"
              value={newExercise.name}
              onChange={handleInputChange}
              className="border p-2 w-full mb-2"
            />
            {/* exercise type */}
            <select
              name="type"
              value={newExercise.type}
              onChange={handleInputChange}
              className="border p-2 w-full mb-2"
            >
              <option value="">Type</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            {/* muscle */}
            <select
              name="muscle"
              value={newExercise.muscle}
              onChange={handleInputChange}
              className="border p-2 w-full mb-2"
            >
              <option value="">Muscle</option>
              {muscleOptions.map((muscle) => (
                <option key={muscle} value={muscle}>
                  {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                </option>
              ))}
            </select>
            {/* difficulty */}
            <select
              name="difficulty"
              value={newExercise.difficulty}
              onChange={handleInputChange}
              className="border p-2 w-full mb-2"
            >
              <option value="">Difficulty</option>
              {difficultyOptions.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
            {/* category */}
            <select
              name="category"
              value={newExercise.category}
              onChange={handleInputChange}
              className="border p-2 w-full mb-2"
            >
              <option value="">Category</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/*  */}
            {/* <select
              name="equipment"
              value={filters.equipment}
              onChange={handleFilterChange}
              className="border p-2 mb-2"
            >
              <option value="">Equipment</option>
              {equipmentOptions.map((equipment) => (
                <option key={equipment} value={equipment}>
                  {equipment.charAt(0).toUpperCase() + equipment.slice(1)}
                </option>
              ))}
            </select> */}
            {/*  */}
            <select
              name="equipment"
              value={newExercise.equipment}
              onChange={handleInputChange}
              className="border p-2 w-full mb-2"
            >
              <option value="">Equipment</option>
              {equipmentOptions.map((equipment) => (
                <option key={equipment} value={equipment}>
                  {equipment.charAt(0).toUpperCase() + equipment.slice(1)}
                </option>
              ))}
            </select>
            {/* <input
              type="text"
              name="equipment"
              placeholder="Equipment"
              value={newExercise.equipment}
              onChange={handleInputChange}
              className="border p-2 w-full mb-2"
            /> */}

            <textarea
              name="instructions"
              placeholder="Instructions"
              value={newExercise.instructions}
              onChange={handleInputChange}
              className="border p-2 w-full mb-2"
            ></textarea>
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExercise}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditModalOpen && editExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Edit Exercise</h2>

            <input
              type="text"
              name="name"
              placeholder="Exercise name"
              value={editExercise.name}
              onChange={handleEditInputChange}
              className="border p-2 w-full mb-2"
            />
            <select
              name="type"
              value={editExercise.type}
              onChange={handleEditInputChange}
              className="border p-2 w-full mb-2"
            >
              <option value="">Type</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            <select
              name="muscle"
              value={editExercise.muscle}
              onChange={handleEditInputChange}
              className="border p-2 w-full mb-2"
            >
              <option value="">Muscle</option>
              {muscleOptions.map((muscle) => (
                <option key={muscle} value={muscle}>
                  {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                </option>
              ))}
            </select>
            <select
                name="equipment"
                value={editExercise.equipment}
                onChange={handleEditInputChange}
                className="border p-2 w-full mb-2"
              >
                <option value="">Equipment</option>
                {equipmentOptions.map((equipment) => (
                  <option key={equipment} value={equipment}>
                    {equipment.charAt(0).toUpperCase() + equipment.slice(1)}
                  </option>
                ))}
              </select>
            <select
              name="difficulty"
              value={editExercise.difficulty}
              onChange={handleEditInputChange}
              className="border p-2 w-full mb-2"
            >
              <option value="">Difficulty</option>
              {difficultyOptions.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </option>
              ))}
            </select>
            <select
              name="category"
              value={editExercise.category}
              onChange={handleEditInputChange}
              className="border p-2 w-full mb-2"
            >
              <option value="">Category</option>
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            <textarea
              name="instructions"
              placeholder="Instructions"
              value={editExercise.instructions}
              onChange={handleEditInputChange}
              className="border p-2 w-full mb-2"
            ></textarea>

            <div className="flex justify-end">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateExercise}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ExerciseContent;
