import React, { useEffect, useState } from "react";
import axios from "axios";

function ExerciseContent() {
  const [exercises, setExercises] = useState([]); // Exercise list
  const [expandedRows, setExpandedRows] = useState({}); // For Read More/Read Less
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Add modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit modal state
  const [selectedExercise, setSelectedExercise] = useState(null); // Selected exercise for editing
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [exerciseForm, setExerciseForm] = useState({
    name: "",
    type: "",
    muscle: "",
    equipment: "",
    difficulty: "",
    category: "",
    instructions: "",
  });

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await axios.get("http://localhost:5500/api/exercise");
      if (response.data && Array.isArray(response.data.data)) {
        setExercises(response.data.data);
      } else {
        setExercises([]);
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
      setExercises([]);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5500/api/admin/deleteExercise/${id}`);
      setExercises((prev) => prev.filter((exercise) => exercise.id !== id));
    } catch (error) {
      console.error("Error deleting exercise:", error);
    }
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExerciseForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExercise = async () => {
    try {
      await axios.post("http://localhost:5500/api/admin/addExercise", exerciseForm);
      fetchExercises();
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error adding exercise:", error);
    }
  };

  const handleEditClick = (exercise) => {
    setSelectedExercise(exercise);
    setExerciseForm(exercise);
    setIsEditModalOpen(true);
  };

  const handleUpdateExercise = async () => {
    try {
      await axios.put(
        `http://localhost:5500/api/admin/updateExercise/${selectedExercise.id}`,
        exerciseForm
      );
      fetchExercises();
      setIsEditModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error updating exercise:", error);
    }
  };

  const resetForm = () => {
    setExerciseForm({
      name: "",
      type: "",
      muscle: "",
      equipment: "",
      difficulty: "",
      category: "",
      instructions: "",
    });
  };

  return (
    <>
      <button
        className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-lg px-5 py-2.5"
        onClick={() => setIsAddModalOpen(true)}
      >
        Add Exercise
      </button>

      <div className="container mx-auto p-4">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Muscle</th>
              <th className="border p-2">Difficulty</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Equipment</th>
              <th className="border p-2">Instructions</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((exercise) => (
              <tr key={exercise.id} className="border">
                <td className="p-2">{exercise.id}</td>
                <td className="p-2">{exercise.name}</td>
                <td className="p-2">{exercise.type}</td>
                <td className="p-2">{exercise.muscle}</td>
                <td className="p-2">{exercise.difficulty}</td>
                <td className="p-2">{exercise.category}</td>
                <td className="p-2">{exercise.equipment}</td>
                <td className="p-2">
                  {expandedRows[exercise.id] ? exercise.instructions : `${exercise.instructions.substring(0, 50)}...`}
                  <button onClick={() => toggleExpand(exercise.id)} className="text-blue-500 underline text-sm">
                    {expandedRows[exercise.id] ? "Read Less" : "Read More"}
                  </button>
                </td>
                <td className="p-2 flex space-x-2">
                  <button onClick={() => handleEditClick(exercise)} className="bg-blue-500 text-white px-2 py-1 rounded">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(exercise.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-lg font-bold mb-4">Edit Exercise</h2>

            <input type="text" name="name" value={exerciseForm.name} onChange={handleInputChange} className="border p-2 w-full mb-2" />
            <input type="text" name="type" value={exerciseForm.type} onChange={handleInputChange} className="border p-2 w-full mb-2" />
            <input type="text" name="muscle" value={exerciseForm.muscle} onChange={handleInputChange} className="border p-2 w-full mb-2" />
            <input type="text" name="difficulty" value={exerciseForm.difficulty} onChange={handleInputChange} className="border p-2 w-full mb-2" />
            <input type="text" name="category" value={exerciseForm.category} onChange={handleInputChange} className="border p-2 w-full mb-2" />
            <input type="text" name="equipment" value={exerciseForm.equipment} onChange={handleInputChange} className="border p-2 w-full mb-2" />
            <textarea name="instructions" value={exerciseForm.instructions} onChange={handleInputChange} className="border p-2 w-full mb-2"></textarea>

            <div className="flex justify-end">
              <button onClick={() => setIsEditModalOpen(false)} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                Cancel
              </button>
              <button onClick={handleUpdateExercise} className="bg-green-500 text-white px-4 py-2 rounded">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ExerciseContent;
