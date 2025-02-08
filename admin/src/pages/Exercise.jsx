import React from "react";
import PageHeader from "../components/PageHeader";
import SideBar from "../components/SideBar";
import ExerciseContent from "../components/ExerciseContent";
import TestExercise from "../components/TestExercise";

function Exercise() {
  return (
    <div className="grid h-screen grid-cols-[auto_1fr] gap-5">
      {/* Sidebar */}
      <div className="w-[200px] bg-white p-4"><SideBar/></div>
      
      {/* Header and Main Content */}
      <div className="grid grid-rows-[auto_1fr] gap-5 min-h-0">
        {/* Header */}
        <div className="h-[100px] bg-white flex items-center"><PageHeader title='Exercise'/></div>
        
        {/* Scrollable Content */}
        <div className="bg-white p-4 overflow-auto">
          <ExerciseContent/>
        </div>
      </div>
    </div>
  );
}

export default Exercise;
