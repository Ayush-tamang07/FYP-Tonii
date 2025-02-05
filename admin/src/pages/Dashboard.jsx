import React from "react";
import PageHeader from "../components/PageHeader";
import SideBar from "../components/SideBar";

function Dashboard() {
  return (
    <div className="grid grid-cols-2 min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="col-span-2 shadow-lg  m-6">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="col-span-10 p-6">
        {/* Page Header */}
        <PageHeader title="Exercise" />

        {/* Content Section */}
        <div className="bg-white shadow-md rounded-lg p-4 mt-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 p-2">SL No</th>
                <th className="border border-gray-300 p-2">Exercise Name</th>
                <th className="border border-gray-300 p-2">Type</th>
                <th className="border border-gray-300 p-2">Muscle</th>
                <th className="border border-gray-300 p-2">Equipment</th>
                <th className="border border-gray-300 p-2">Difficulty</th>
                <th className="border border-gray-300 p-2">Instruction</th>
                <th className="border border-gray-300 p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Example row */}
              <tr>
                <td className="border border-gray-300 p-2">1</td>
                <td className="border border-gray-300 p-2">Push Up</td>
                <td className="border border-gray-300 p-2">Strength</td>
                <td className="border border-gray-300 p-2">Chest</td>
                <td className="border border-gray-300 p-2">None</td>
                <td className="border border-gray-300 p-2">Medium</td>
                <td className="border border-gray-300 p-2">Start in a plank position...</td>
                <td className="border border-gray-300 p-2">
                  <button className="text-blue-500 mr-2">Edit</button>
                  <button className="text-red-500">Delete</button>
                </td>
              </tr>
            </tbody>
            <tbody>
              {/* Example row */}
              <tr>
                <td className="border border-gray-300 p-2">1</td>
                <td className="border border-gray-300 p-2">Push Up</td>
                <td className="border border-gray-300 p-2">Strength</td>
                <td className="border border-gray-300 p-2">Chest</td>
                <td className="border border-gray-300 p-2">None</td>
                <td className="border border-gray-300 p-2">Medium</td>
                <td className="border border-gray-300 p-2">Start in a plank position...</td>
                <td className="border border-gray-300 p-2">
                  <button className="text-blue-500 mr-2">Edit</button>
                  <button className="text-red-500">Delete</button>
                </td>
              </tr>
            </tbody>
            <table>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta dignissimos voluptatum veritatis libero repellendus amet magni, numquam nostrum, doloremque dolor non hic quas esse voluptas enim nisi, ipsum porro sit?</table>
            <table>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta dignissimos voluptatum veritatis libero repellendus amet magni, numquam nostrum, doloremque dolor non hic quas esse voluptas enim nisi, ipsum porro sit?</table>
            <table>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta dignissimos voluptatum veritatis libero repellendus amet magni, numquam nostrum, doloremque dolor non hic quas esse voluptas enim nisi, ipsum porro sit?</table>
            <table>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta dignissimos voluptatum veritatis libero repellendus amet magni, numquam nostrum, doloremque dolor non hic quas esse voluptas enim nisi, ipsum porro sit?</table>
            <table>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta dignissimos voluptatum veritatis libero repellendus amet magni, numquam nostrum, doloremque dolor non hic quas esse voluptas enim nisi, ipsum porro sit?</table>
            <table>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta dignissimos voluptatum veritatis libero repellendus amet magni, numquam nostrum, doloremque dolor non hic quas esse voluptas enim nisi, ipsum porro sit?</table>
            <table>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta dignissimos voluptatum veritatis libero repellendus amet magni, numquam nostrum, doloremque dolor non hic quas esse voluptas enim nisi, ipsum porro sit?</table>
            <table>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta dignissimos voluptatum veritatis libero repellendus amet magni, numquam nostrum, doloremque dolor non hic quas esse voluptas enim nisi, ipsum porro sit?</table>
            <table>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta dignissimos voluptatum veritatis libero repellendus amet magni, numquam nostrum, doloremque dolor non hic quas esse voluptas enim nisi, ipsum porro sit?</table>
            <table>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta dignissimos voluptatum veritatis libero repellendus amet magni, numquam nostrum, doloremque dolor non hic quas esse voluptas enim nisi, ipsum porro sit?</table>
            <table>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta dignissimos voluptatum veritatis libero repellendus amet magni, numquam nostrum, doloremque dolor non hic quas esse voluptas enim nisi, ipsum porro sit?</table>
            
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
