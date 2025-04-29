import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  typeOptions,
  muscleOptions,
  difficultyOptions,
  categoryOptions,
  equipmentOptions,
} from "../data/exerciseOption.js";
import { toast } from 'react-toastify';

function ExerciseContent() {
  const [exercises, setExercises] = useState([]); // Default empty array
  const [expandedRows, setExpandedRows] = useState({}); // Track expanded instructions
  const [expandedVideoUrls, setExpandedVideoUrls] = useState({}); // Track expanded video URLs
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [newExercise, setNewExercise] = useState({
    name: "",
    type: "",
    muscle: "",
    equipment: "",
    difficulty: "",
    category: "",
    instructions: "",
    videoUrl: "", 
  });
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

  // Toggle Expand/Collapse Video URLs
  const toggleExpandVideo = (id) => {
    setExpandedVideoUrls((prev) => ({
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
          videoUrl: "", // Changed from videoURL to videoUrl
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
          toast.error(`Error: ${error.response?.data?.message || 'Something went wrong'}`);
          // setMessage(`Error: ${error.response.data.message}`);
          // setMessageType("error");
        }
      } else {
        // console.error("Error adding exercise:", error);
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
              <th className="border border-gray-300 p-2">Video URL</th>
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
                  <td className="border border-gray-300">
                    {expandedVideoUrls[exercise.id]
                      ? exercise.videoUrl || "No video URL provided."
                      : `${
                          exercise.videoUrl
                            ? exercise.videoUrl.substring(0, 30)
                            : "No video URL provided."
                        }...`}
                    <button
                      onClick={() => toggleExpandVideo(exercise.id)}
                      className="text-blue-500 underline text-sm"
                    >
                      {expandedVideoUrls[exercise.id]
                        ? "Read Less"
                        : "Read More"}
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
                <td colSpan="10" className="text-center p-4">
                  No exercises found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Add New Exercise
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {/* Success or Error Message */}
              {message && (
                <div
                  className={`mb-4 px-4 py-3 rounded-md text-sm font-medium ${
                    messageType === "success"
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}
                >
                  {messageType === "success" && (
                    <span className="inline-flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {message}
                    </span>
                  )}
                  {messageType === "error" && (
                    <span className="inline-flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {message}
                    </span>
                  )}
                </div>
              )}

              {/* Form Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Exercise Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exercise Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter exercise name"
                    value={newExercise.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                {/* Exercise Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={newExercise.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select Type</option>
                    {typeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Muscle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Muscle
                  </label>
                  <select
                    name="muscle"
                    value={newExercise.muscle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select Muscle</option>
                    {muscleOptions.map((muscle) => (
                      <option key={muscle} value={muscle}>
                        {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={newExercise.difficulty}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select Difficulty</option>
                    {difficultyOptions.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty.charAt(0).toUpperCase() +
                          difficulty.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={newExercise.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Equipment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipment
                  </label>
                  <select
                    name="equipment"
                    value={newExercise.equipment}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select Equipment</option>
                    {equipmentOptions.map((equipment) => (
                      <option key={equipment} value={equipment}>
                        {equipment.charAt(0).toUpperCase() + equipment.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Video URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL
                  </label>
                  <input
                    type="text"
                    name="videoUrl"
                    placeholder="Enter video URL"
                    value={newExercise.videoUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                {/* Instructions */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructions
                  </label>
                  <textarea
                    name="instructions"
                    placeholder="Enter detailed instructions"
                    value={newExercise.instructions}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExercise}
                className="ml-3 px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Add Exercise
              </button>
            </div>
          </div>
        </div>
      )}
      {isEditModalOpen && editExercise && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Edit Exercise
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {/* Form Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Exercise Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exercise Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter exercise name"
                    value={editExercise.name}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                {/* Exercise Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={editExercise.type}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select Type</option>
                    {typeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Muscle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Muscle
                  </label>
                  <select
                    name="muscle"
                    value={editExercise.muscle}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select Muscle</option>
                    {muscleOptions.map((muscle) => (
                      <option key={muscle} value={muscle}>
                        {muscle.charAt(0).toUpperCase() + muscle.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Equipment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Equipment
                  </label>
                  <select
                    name="equipment"
                    value={editExercise.equipment}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select Equipment</option>
                    {equipmentOptions.map((equipment) => (
                      <option key={equipment} value={equipment}>
                        {equipment.charAt(0).toUpperCase() + equipment.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={editExercise.difficulty}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select Difficulty</option>
                    {difficultyOptions.map((difficulty) => (
                      <option key={difficulty} value={difficulty}>
                        {difficulty.charAt(0).toUpperCase() +
                          difficulty.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={editExercise.category}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Video URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL
                  </label>
                  <input
                    type="text"
                    name="videoUrl"
                    placeholder="Enter video URL"
                    value={editExercise.videoUrl}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                {/* Instructions */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Instructions
                  </label>
                  <textarea
                    name="instructions"
                    placeholder="Enter detailed instructions"
                    value={editExercise.instructions}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    rows="4"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateExercise}
                className="ml-3 px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
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
