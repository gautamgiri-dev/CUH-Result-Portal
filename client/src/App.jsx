import "./App.css";
import "./Component.scss";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Student from "./pages/Student/Student";
import FacultyLogin from "./pages/FacultyLogin/FacultyLogin";
import Hod from "./pages/Hod/Hod";
import Admin from "./pages/Admin/Admin";

import { Protected } from "./middlewares/auth.middleware";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/students" element={<Student />} />
      <Route path="/faculty-login" element={<FacultyLogin />} />
      <Route path="/hods/*" element={<Hod />} />
      <Route path="/hods" element={<Navigate to="/hods/dashboard" />} />

      {/* <Route path="/hods/*" element={<Protected role />} /> */}

      <Route
        path="/admin/*"
        element={
          <Protected role={1}>
            <Admin />
          </Protected>
        }
      />
    </Routes>
  );
}

export default App;
