import React from "react";
import PageHeader from "../components/PageHeader";
import SideBar from "../components/SideBar";
import Feedback from "./Feedback";
import Exercise from "./Exercise";
import UserContent from "../components/UserContent";

function Setting() {
  return (
    <div className="grid h-screen grid-cols-[auto_1fr] gap-5">
      {/* Sidebar */}
      <div className="w-[200px] bg-white p-4">
        <SideBar />
      </div>

      {/* Header and Main Content */}
      <div className="grid grid-rows-[auto_1fr] gap-5 min-h-0">
        {/* Header */}
        <div className="h-[100px] bg-white flex items-center">
          <PageHeader title="Setting" />
        </div>

        {/* Scrollable Content */}
        <div className="bg-white p-4 overflow-auto">
            <div>Setting</div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
