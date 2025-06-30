import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Roles from "../components/Roles";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard/superadmin" element={<Roles rol="superadmin" />} />
        <Route path="/dashboard/admin" element={<Roles rol="admin" />} />
        <Route path="/dashboard/alumno" element={<Roles rol="alumno" />} />
        <Route path="*" element={<p>Página no encontrada</p>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
