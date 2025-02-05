import React from "react";
import PageHeader from "../components/PageHeader";
import SideBar from "../components/SideBar";
import FeedbackContent from "../components/FeedbackContent";

function Exercise() {
  return (
    <div className="grid h-screen grid-cols-[auto_1fr] gap-5">
      {/* Sidebar */}
      <div className="w-[200px] bg-white p-4"><SideBar/></div>
      
      {/* Header and Main Content */}
      <div className="grid grid-rows-[auto_1fr] gap-5 min-h-0">
        {/* Header */}
        <div className="h-[100px] bg-white flex items-center"><PageHeader title='Feedback'/></div>
        
        {/* Scrollable Content */}
        <div className="bg-white p-4 overflow-auto">
          <FeedbackContent/>
        </div>
      </div>
    </div>
  );
}

export default Exercise;
