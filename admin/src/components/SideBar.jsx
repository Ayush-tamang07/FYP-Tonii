import React from 'react';

function SideBar() {
  return (
    <aside className="min-h-screen white p-4 rounded-xl fixed bg-white  ">
      <nav className="space-y-4">
        <a
          href="/dashboard"
          className="block p-2 rounded hover:bg-gray-200 transition"
        >
          Dashboard
        </a>
        <a
          href="/user"
          className="block p-2 rounded hover:bg-gray-200 transition"
        >
          User Details
        </a>
        <a
          href="/exercise"
          className="block p-2 rounded hover:bg-gray-200 transition"
        >
          Exercise
        </a>
        <a
          href="/feedback"
          className="block p-2 rounded hover:bg-gray-200 transition"
        >
          Feedback
        </a>
        <a
          href="#"
          className="block p-2 rounded hover:bg-gray-200 transition"
        >
          Setting
        </a>
      </nav>
      <div className="mt-10">
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
