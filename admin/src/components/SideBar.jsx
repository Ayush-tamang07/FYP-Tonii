import React from 'react';
import { useLocation } from 'react-router-dom';
import { MdDashboard } from "react-icons/md";
import { BiSolidUserDetail } from "react-icons/bi";
import { GiWeightLiftingUp } from "react-icons/gi";
import { VscFeedback } from "react-icons/vsc";
import { IoSettings } from "react-icons/io5";

function SideBar() {
  const location = useLocation(); // Get current route path

  // Function to apply active background color and text color
  const getLinkClass = (path) => 
    location.pathname === path 
      ? "bg-[#E3F2FD] text-[#2D60FF]"  // Active state
      : "text-[#B1B1B1]";               // Inactive state

  return (
    <aside className="flex flex-col h-full p-4">
      {/* Navigation Links */}
      <nav className="space-y-4 flex-1">
        <a href="/dashboard" className={`flex items-center space-x-2 p-2 rounded font-semibold hover:bg-[#E3F2FD] text-sm transition ${getLinkClass("/dashboard")}`}>
          <MdDashboard className="text-xl" />
          <span>Dashboard</span>
        </a>
        <a href="/user" className={`flex items-center space-x-2 p-2 rounded font-semibold hover:bg-[#E3F2FD] text-sm transition ${getLinkClass("/user")}`}>
          <BiSolidUserDetail className="text-xl" />
          <span>User Details</span>
        </a>
        <a href="/exercise" className={`flex items-center space-x-2 p-2 rounded font-semibold hover:bg-[#E3F2FD] text-sm transition ${getLinkClass("/exercise")}`}>
          <GiWeightLiftingUp className="text-xl" />
          <span>Exercise</span>
        </a>
        <a href="/feedback" className={`flex items-center space-x-2 p-2 rounded font-semibold hover:bg-[#E3F2FD] text-sm transition ${getLinkClass("/feedback")}`}>
          <VscFeedback className="text-xl" />
          <span>Feedback</span>
        </a>
        <a href="" className={`flex items-center space-x-2 p-2 rounded font-semibold text-sm hover:bg-[#E3F2FD] transition ${getLinkClass("/settings")}`}>
          <IoSettings className="text-xl" />
          <span>Settings</span>
        </a>
      </nav>

      {/* Logout Button at the Bottom */}
      <div className="mt-auto">
        <button
          type="button"
          className="w-full flex items-center justify-center space-x-2 focus:outline-none text-red-500 bg-red-100 hover:bg-red-200 font-semibold rounded-lg text-sm px-5 py-2.5"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default SideBar;
