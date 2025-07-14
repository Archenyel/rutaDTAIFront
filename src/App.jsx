import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./modulos/auth/Login";
import Registro from "./modulos/auth/Registro";
import Admin from "./modulos/paneles/Admin";
import SuperAdmin from "./modulos/paneles/SuperAdmin";
import Alumno from "./modulos/paneles/Alumno";
import Kanban from "./modulos/Kanban/Kanban";
import Dashboard from "./modulos/dashboard/Dashboard"; 
import Layout from "./componentes/Layout/Layout";    
import DashboardAlumno from "./modulos/dashboard/DashboardAlumno";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/superadmin" element={<SuperAdmin />} />
        <Route path="/alumno" element={<Layout><Alumno /></Layout>} />
        <Route path="/kanban" element={<Layout><Kanban /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/dashboardAlumno" element={<Layout><DashboardAlumno /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
