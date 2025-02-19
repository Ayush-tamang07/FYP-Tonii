import React from "react";
import { Routes, Route } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import SideBar from "../components/SideBar";
import WorkoutPlansContent from "../components/WorkoutPlansContent";
import WorkoutPlanDetails from "../components/WorkoutPlanDetails"; // New Component

function WorkoutPlans() {
  return (
    <div className="grid h-screen grid-cols-[auto_1fr] gap-5">
      {/* Sidebar */}
      <div className="w-[200px] bg-white p-4">
        <SideBar />
      </div>

      {/* Header and Main Content */}
      <div className="grid grid-rows-[auto_1fr] gap-5 min-h-0">
        {/* Header */}
        <div className="h-[100px] bg-white flex items-center shadow-sm">
          <PageHeader title="Workout Plans" />
        </div>

        {/* Routes for Main Content */}
        <div className="bg-white p-4 overflow-auto">
          <Routes>
            <Route path="/" element={<WorkoutPlansContent />} />
            <Route path=":id" element={<WorkoutPlanDetails />} /> {/* New Route for Details Page */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default WorkoutPlans;
