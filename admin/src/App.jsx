import { BrowserRouter,Routes, Route } from "react-router-dom";
import { Login, Dashboard, User, Exercise, Feedback, SideBar } from "../reference.js";

export default function App() {
  return (
    // <Login/>
    <BrowserRouter>
    <Routes>
      <Route/>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/user" element={<User />} />
      <Route path="/exercise" element={<Exercise />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/Sidebar" element={<SideBar />} />
      {/* <Route path="/*" element={<Navigate to="/" />} /> */}
    </Routes>
    </BrowserRouter>
  )
}