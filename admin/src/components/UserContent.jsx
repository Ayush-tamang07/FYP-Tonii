import React, { useEffect, useState } from "react";
import axios from "axios";

function UserContent() {
  const [users, setUsers] = useState([]); // Fix: Use an array since backend returns multiple users
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token

    if (!token) {
      setError("Unauthorized: No token found");
      setLoading(false);
      return;
    }

    // Fetch user data with token
    axios
      .get("http://localhost:5500/api/admin/readUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUsers(response.data.users); // Fix: Store array of users correctly
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to fetch user details");
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4 bg-white">
      {loading && <p>Loading user details...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && users.length > 0 ? ( // Fix: Check if users array is not empty
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                {/* <th className="border p-2">ID</th> */}
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">DOB</th>
                <th className="border p-2">Gender</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="border p-2">{user.username}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">
                    {new Date(user.dob).toISOString().split("T")[0]}{" "}
                    {/* Extract only date */}
                  </td>
                  <td className="border p-2">{user.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No users found.</p> // Fix: Display message when no users
      )}
    </div>
  );
}

export default UserContent;
