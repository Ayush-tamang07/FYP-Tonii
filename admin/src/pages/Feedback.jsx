import React, { useState, useEffect } from "react";

function Feedback() {
  const [feedback, setFeedback] = useState([]); // Store feedback data
  const [filteredFeedback, setFilteredFeedback] = useState([]); // Store filtered data
  const [expandedRows, setExpandedRows] = useState({}); // Track expanded descriptions
  const [selectedFeedbackType, setSelectedFeedbackType] = useState(""); // Selected feedback type
  const [startDate, setStartDate] = useState(""); // Start date filter
  const [endDate, setEndDate] = useState(""); // End date filter

  // Fetch feedback data from API
  useEffect(() => {
    fetch("http://localhost:5500/api/admin/readFeedback")
      .then((response) => response.json())
      .then((data) => {
        setFeedback(data);
        setFilteredFeedback(data); // Set initially filtered data
      })
      .catch((error) => console.error("Error fetching feedback:", error));
  }, []);

  // Toggle "Read More" / "Read Less"
  const toggleRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Function to truncate description
  const truncateText = (text, isExpanded) => {
    if (isExpanded || text.length <= 50) return text;
    return text.substring(0, 50) + "...";
  };

  // Function to apply filters (Case-Insensitive Filtering)
  const applyFilter = () => {
    let filteredData = feedback;

    // Filter by feedback type (case insensitive)
    if (selectedFeedbackType) {
      filteredData = filteredData.filter(
        (item) =>
          item.feedback_type.toLowerCase() === selectedFeedbackType.toLowerCase()
      );
    }

    // Filter by start date & end date
    if (startDate || endDate) {
      filteredData = filteredData.filter((item) => {
        const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
        return (
          (!startDate || itemDate >= startDate) &&
          (!endDate || itemDate <= endDate)
        );
      });
    }

    setFilteredFeedback(filteredData);
  };

  // Function to clear filters and show all feedback
  const clearFilters = () => {
    setSelectedFeedbackType("");
    setStartDate("");
    setEndDate("");
    setFilteredFeedback(feedback); // Reset to original feedback list
  };

  return (
    <>
      {/* Filter UI */}
      <div className="mb-4 flex space-x-4">
        {/* Feedback Type Filter */}
        <select
          name="feedbackType"
          id="feedbackType"
          className="border p-2 rounded"
          value={selectedFeedbackType}
          onChange={(e) => setSelectedFeedbackType(e.target.value)}
        >
          <option value="">Select Feedback Type</option>
          <option value="Bug">Bug Report</option>
          <option value="Feature Request">Feature Request</option>
          <option value="General Feedback">General Feedback</option>
          <option value="Usability Feedback">Usability Feedback</option>
          <option value="Performance Feedback">Performance Feedback</option>
          <option value="Customer Support Feedback">
            Customer Support Feedback
          </option>
          <option value="Security Feedback">Security Feedback</option>
          <option value="Content Feedback">Content Feedback</option>
          <option value="App/Platform Rating">App/Platform Rating</option>
          <option value="Service Quality">Service Quality</option>
          <option value="Compliance/Policy">Compliance/Policy</option>
          <option value="Suggestions">Suggestions</option>
          <option value="Praise">Praise</option>
          <option value="Complaint">Complaint</option>
          <option value="Technical Support Request">
            Technical Support Request
          </option>
          <option value="Others">Others</option>
        </select>

        {/* Start Date Filter */}
        <input
          type="date"
          className="border p-2 rounded"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        {/* End Date Filter */}
        <input
          type="date"
          className="border p-2 rounded"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        {/* Apply Filter Button */}
        <button
          onClick={applyFilter}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Apply Filter
        </button>

        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear Filters
        </button>
      </div>

      {/* Feedback Table */}
      <div className="flex">
        <div className="w-full p-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">S.N</th>
                  <th className="border p-2">Feedback Type</th>
                  <th className="border p-2">User</th>
                  <th className="border p-2">Description</th>
                  <th className="border p-2">Created At</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedback.length > 0 ? (
                  filteredFeedback.map((item, index) => (
                    <tr key={item.id}>
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{item.feedback_type}</td>
                      <td className="border p-2">{item.user.username}</td>
                      <td className="border p-2">
                        {truncateText(item.description, expandedRows[item.id])}
                        {item.description.length > 50 && (
                          <button
                            onClick={() => toggleRow(item.id)}
                            className="text-blue-500 ml-2"
                          >
                            {expandedRows[item.id] ? "Read Less" : "Read More"}
                          </button>
                        )}
                      </td>
                      <td className="border p-2">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="border p-2 text-center">
                      No feedback found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Feedback;
