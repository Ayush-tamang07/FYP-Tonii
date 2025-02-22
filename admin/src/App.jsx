import { BrowserRouter,Routes, Route } from "react-router-dom";
// import { Login, Dashboard, User, Exercise, SideBar } from "./reference";
import { Login, Dashboard, User, Exercise, Feedback, SideBar } from "./reference.js";

import React from 'react'
import Setting from "./pages/Setting.jsx";
import WorkoutPlans from "./pages/WorkoutPlans.jsx";
import { ToastContainer, toast } from 'react-toastify';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route/>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/user" element={<User />} />
      <Route path="/exercise" element={<Exercise />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/workoutPlans" element={<WorkoutPlans />} />
      <Route path="/Sidebar" element={<SideBar />} />
      <Route path="/setting" element={<Setting />} />
      {/* <Route path="/*" element={<Navigate to="/" />} /> */}
    </Routes>
    <ToastContainer />
    </BrowserRouter>
  )
}

export default App