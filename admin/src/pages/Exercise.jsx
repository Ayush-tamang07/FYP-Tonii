import React, { useEffect, useState } from 'react';
import PageHeader from "../components/PageHeader";
import axios from 'axios';

function Exercise() {
  const [exercises, setExercises] = useState([]); // Default empty array
  const [expandedRows, setExpandedRows] = useState({}); // Track expanded instructions

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
      await axios.delete(`http://localhost:5500/api/deleteExercise/${id}`);
      setExercises(exercises.filter((exercise) => exercise.id !== id));
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

  return (
    <>
      <PageHeader title="Exercise" />
      <div className="container mx-auto p-4">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">ID</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Type</th>
              <th className="border border-gray-300 p-2">Muscle</th>
              <th className="border border-gray-300 p-2">Equipment</th>
              <th className="border border-gray-300 p-2">Difficulty</th>
              <th className="border border-gray-300 p-2">Category</th>
              <th className="border border-gray-300 p-2">Instructions</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exercises.length > 0 ? (
              exercises.map((exercise) => (
                <tr key={exercise.id} className="border border-gray-300">
                  <td className="border border-gray-300 p-2">{exercise.id}</td>
                  <td className="border border-gray-300 p-2">{exercise.name}</td>
                  <td className="border border-gray-300 p-2">{exercise.type}</td>
                  <td className="border border-gray-300 p-2">{exercise.muscle}</td>
                  <td className="border border-gray-300 p-2">{exercise.equipment}</td>
                  <td className="border border-gray-300 p-2">{exercise.difficulty}</td>
                  <td className="border border-gray-300 p-2">{exercise.category}</td>
                  <td className="border border-gray-300 p-2">
                    {expandedRows[exercise.id] ? exercise.instructions : `${exercise.instructions.substring(0, 100)}... `}
                    <button
                      onClick={() => toggleExpand(exercise.id)}
                      className="text-blue-500 underline text-sm"
                    >
                      {expandedRows[exercise.id] ? "Read Less" : "Read More"}
                    </button>
                  </td>
                  <td className="p-2 flex space-x-2">
                    <button 
                      onClick={() => console.log("Edit exercise with ID:", exercise.id)} 
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
    </>
  );
}

export default Exercise;
