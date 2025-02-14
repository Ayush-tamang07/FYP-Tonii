import React from "react";
import PageHeader from "../components/PageHeader";
import SideBar from "../components/SideBar";
import WorkoutPlansContent from "../components/WorkoutPlansContent";

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

        {/* Scrollable Content */}
        <div className="bg-white p-4 overflow-auto">
          <WorkoutPlansContent />
        </div>
      </div>
    </div>
  );
}

export default WorkoutPlans;
