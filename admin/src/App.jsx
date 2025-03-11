import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Login,
  Dashboard,
  User,
  Exercise,
  Feedback,
  SideBar,
} from "./reference.js";
import Setting from "./pages/Setting.jsx";
import WorkoutPlans from "./pages/WorkoutPlans.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user" element={<User />} />
          <Route path="/exercise" element={<Exercise />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/workoutPlans" element={<WorkoutPlans />} />
          <Route path="/Sidebar" element={<SideBar />} />
          <Route path="/setting" element={<Setting />} />
        </Route>

        {/* Redirect unmatched routes */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
