import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { BiSolidUserDetail } from "react-icons/bi";
import { GiWeightLiftingUp } from "react-icons/gi";
import { VscFeedback } from "react-icons/vsc";
import { IoSettings } from "react-icons/io5";
import { LuClipboardList } from "react-icons/lu";
import { toast } from "react-toastify";

function SideBar() {
  const location = useLocation(); 
  const navigate = useNavigate(); 

  const getLinkClass = (path) =>
    location.pathname === path
      ? "bg-[#E3F2FD] text-[#2D60FF]"
      : "text-[#B1B1B1]";

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged Out!");
    navigate("/");
  };

  return (
    <aside className="flex flex-col h-full p-4">
      <nav className="space-y-4 flex-1">
        <Link
          to="/dashboard"
          className={`flex items-center space-x-2 p-2 rounded font-semibold hover:bg-[#E3F2FD] text-sm transition ${getLinkClass(
            "/dashboard"
          )}`}
        >
          <MdDashboard className="text-xl" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/user"
          className={`flex items-center space-x-2 p-2 rounded font-semibold hover:bg-[#E3F2FD] text-sm transition ${getLinkClass(
            "/user"
          )}`}
        >
          <BiSolidUserDetail className="text-xl" />
          <span>User Details</span>
        </Link>
        <Link
          to="/exercise"
          className={`flex items-center space-x-2 p-2 rounded font-semibold hover:bg-[#E3F2FD] text-sm transition ${getLinkClass(
            "/exercise"
          )}`}
        >
          <GiWeightLiftingUp className="text-xl" />
          <span>Exercise</span>
        </Link>
        {/* <Link
          to="/workoutPlans"
          className={`flex items-center space-x-2 p-2 rounded font-semibold hover:bg-[#E3F2FD] text-sm transition ${getLinkClass(
            "/workoutPlans"
          )}`}
        >
          <LuClipboardList className="text-xl" />
          <span>WorkoutPlans</span>
        </Link> */}
        <Link
          to="/feedback"
          className={`flex items-center space-x-2 p-2 rounded font-semibold hover:bg-[#E3F2FD] text-sm transition ${getLinkClass(
            "/feedback"
          )}`}
        >
          <VscFeedback className="text-xl" />
          <span>Feedback</span>
        </Link>
        <Link
          to="/Setting"
          className={`flex items-center space-x-2 p-2 rounded font-semibold text-sm hover:bg-[#E3F2FD] transition ${getLinkClass(
            "/Setting"
          )}`}
        >
          <IoSettings className="text-xl" />
          <span>Settings</span>
        </Link>
      </nav>

      <div className="mt-auto">
        <button
          type="button"
          className="w-full flex items-center justify-center space-x-2 focus:outline-none text-red-500 bg-red-100 hover:bg-red-200 font-semibold rounded-lg text-sm px-5 py-2.5"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default SideBar;
