import React from 'react';
import { useLocation } from 'react-router-dom';

function SideBar() {
  const location = useLocation(); // Get current route path

  // Function to apply active background color and text color
  const getLinkClass = (path) => 
    location.pathname === path 
      ? "bg-[#E3F2FD] text-[#2D60FF]"  // Active state
      : "text-[#B1B1B1]";               // Inactive state

  return (
    <aside className="flex flex-col h-full">
      {/* Navigation Links */}
      <nav className="space-y-4 flex-1">
        <a href="/dashboard" className={`block p-2 rounded font-semibold hover:bg-[#E3F2FD] text-sm transition ${getLinkClass("/dashboard")}`}>
          Dashboard
        </a>
        <a href="/user" className={`block p-2 rounded font-semibold hover:bg-[#E3F2FD] text-sm transition ${getLinkClass("/user")}`}>
          User Details
        </a>
        <a href="/exercise" className={`block p-2 rounded font-semibold hover:bg-[#E3F2FD] text-sm transition ${getLinkClass("/exercise")}`}>
          Exercise
        </a>
        <a href="/feedback" className={`block p-2 rounded font-semibold hover:bg-[#E3F2FD] text-sm transition ${getLinkClass("/feedback")}`}>
          Feedback
        </a>
        <a href="#" className={`block p-2 rounded font-semibold text-sm hover:bg-[#E3F2FD] transition ${getLinkClass("/settings")}`}>
          Setting
        </a>
      </nav>

      {/* Logout Button at the Bottom */}
      <div className="mt-auto">
        <button
          type="button"
          className="w-full focus:outline-none text-red-500 bg-red-100 hover:bg-red-200 font-semibold rounded-lg text-sm px-5 py-2.5"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default SideBar;
