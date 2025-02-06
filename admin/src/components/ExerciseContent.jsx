import React, { useEffect, useState } from "react";
import axios from "axios";

function ExerciseContent() {
  const [exercises, setExercises] = useState([]); // Default empty array
  const [expandedRows, setExpandedRows] = useState({}); // Track expanded instructions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExercise, setNewExercise] = useState({
    name: "",
    type: "",
    muscle: "",
    equipment: "",
    difficulty: "",
    category: "",
    instructions: "",
  });

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
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExercise((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExercise = async () => {
    try {
      const response = await axios.post("http://localhost:5500/api/admin/addExercise", newExercise);
      setExercises([...exercises, response.data]);
      setIsModalOpen(false);
      setNewExercise({ name: "", type: "", muscle: "", equipment: "", difficulty: "", category: "", instructions: "" });
    } catch (error) {
      console.error("Error adding exercise:", error);
    }
  };
  const typeOptions = [
    "cardio",
    "olympic_weightlifting",
    "plyometrics",
    "powerlifting",
    "strength",
    "stretching",
    "strongman"
  ];
  
  console.log(typeOptions);  
  const muscleOptions = [
    "abdominals", "abductors", "adductors", "biceps", "calves", "chest", "forearms", "glutes",
    "hamstrings", "lats", "lower_back", "middle_back", "neck", "quadriceps", "traps", "triceps"
  ];
  const difficultyOptions = ["beginner", "intermediate", "advanced"];
  const categoryOptions = ["chest", "back", "arms","shoulders","core","legs"];

  return (
    <>
      <button
        type="button"
        className="focus:outline-none text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        onClick={() => setIsModalOpen(true)}
      >
        Add
      </button>
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
                      ? exercise.instructions
                      : `${exercise.instructions.substring(0, 100)}... `}
                    <button
                      onClick={() => toggleExpand(exercise.id)}
                      className="text-blue-500 underline text-sm"
                    >
                      {expandedRows[exercise.id] ? "Read Less" : "Read More"}
                    </button>
                  </td>
                  <td className="p-2 flex space-x-2">
                    <button
                      onClick={() =>
                        console.log("Edit exercise with ID:", exercise.id)
                      }
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Add New Exercise</h2>
            <input type="text" name="name" placeholder="Name" value={newExercise.name} onChange={handleInputChange} className="border p-2 w-full mb-2" />
            {/* exercise type */}
            <select name="type" value={newExercise.type} onChange={handleInputChange} className="border p-2 w-full mb-2">
              <option value="">Type</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
              </select>
            {/* muscle */}
            <select name="muscle" value={newExercise.muscle} onChange={handleInputChange} className="border p-2 w-full mb-2">
              <option value="">Muscle</option>
              {muscleOptions.map((muscle) => (
                <option key={muscle} value={muscle}>{muscle.charAt(0).toUpperCase() + muscle.slice(1)}</option>
              ))}
            </select>
            {/* difficulty */}
            <select name="difficulty" value={newExercise.difficulty} onChange={handleInputChange} className="border p-2 w-full mb-2">
              <option value="">Difficulty</option>
              {difficultyOptions.map((difficulty) => (
                <option key={difficulty} value={difficulty}>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</option>
              ))}
            </select>
            {/* category */}
            <select name="category" value={newExercise.category} onChange={handleInputChange} className="border p-2 w-full mb-2">
              <option value="">Category</option>
              {categoryOptions.map((category) => (
              <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
              ))}
            </select>
            <input type="text" name="equipment" placeholder="Equipment" value={newExercise.equipment} onChange={handleInputChange} className="border p-2 w-full mb-2" />
            <textarea name="instructions" placeholder="Instructions" value={newExercise.instructions} onChange={handleInputChange} className="border p-2 w-full mb-2"></textarea>
            <div className="flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
              <button onClick={handleAddExercise} className="bg-green-500 text-white px-4 py-2 rounded">Add</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ExerciseContent;
