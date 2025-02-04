import React from "react";

export default function SideBar() {
  return (
    <aside>
        <nav>
            <a href="/dashboard"><ul>Dashboard</ul></a>
            <a href="/user"><ul>User Details</ul></a>
            <a href="/exercise"><ul>Exercise</ul></a>
            <a href="/feedback"><ul>Feedback</ul></a>
            <a href="#"><ul>Setting</ul></a>
        </nav>
        <button
          type="button"
          className="focus:outline-none text-[#FF0000] bg-[#FFEDED] hover:bg-red-300 font-semibold rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
        >
          Logout
        </button>
    </aside>
  );
}