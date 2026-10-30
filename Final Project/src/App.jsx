import { Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MentorDashboard from "./pages/MentorDashboard";
import StartupDashboard from "./pages/StartupDashboard";
import AIAssistant from "./pages/AIAssistant";

function App() {
  const token = localStorage.getItem("token");

  let role = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);

      if (!decoded.exp || decoded.exp * 1000 > Date.now()) {
        role = decoded.role;
      }
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/mentor-dashboard"
        element={<MentorDashboard />}
      />

      <Route
        path="/startup-dashboard"
        element={<StartupDashboard />}
      />

      <Route
        path="/assistant"
        element={
          role === "mentor" || role === "company" ? (
            <AIAssistant role={role} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;