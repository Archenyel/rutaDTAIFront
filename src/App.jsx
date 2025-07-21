import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./modulos/auth/Login";
import Registro from "./modulos/auth/Registro";
import Admin from "./modulos/paneles/Admin";
import Alumno from "./modulos/paneles/Alumno";
import Kanban from "./modulos/Kanban/Kanban";
import AdminKanban from "./modulos/Kanban/AdminKanban/AdminnKanban";
import SuperadminKanban from "./modulos/Kanban/SuperadminKanban/SuperadminKanban";
import Dashboard from "./modulos/dashboard/Dashboard"; 
import Layout from "./componentes/Layout/Layout";    
import DashboardAlumno from "./modulos/dashboard/DashboardAlumno";
import DashboardAdmin from "./modulos/dashboard/DashboardAdmin";
import SuperAdmin from "./modulos/dashboard/DashboardSuperadmin";
import Portafolios from "./modulos/dashboard/cards/Portafolios";
import Programas from "./modulos/dashboard/cards/Programas";
import Proyecto from "./modulos/proyectos/Proyecto";
import GestionProyectos from "./modulos/dashboard/gestionProyectos/GestionProyectos";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboardSuperadmin" element={<SuperAdmin />} />
        <Route path="/alumno" element={<Layout><Alumno /></Layout>} />
        <Route path="/kanban" element={<Layout><Kanban /></Layout>} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/dashboardAlumno" element={<Layout><DashboardAlumno /></Layout>} />
        <Route path="/dashboardAdmin" element={<Layout><DashboardAdmin /></Layout>} />
        <Route path="/adminKanban" element={<Layout><AdminKanban /></Layout>} />
        <Route path="/SuperadminKanban" element={<Layout><SuperadminKanban /></Layout>} />
        <Route path="/proyectos/:id" element={<Layout><Proyecto /></Layout>} />
        <Route path="/portafolios" element={<Portafolios />} />
        <Route path="/programas" element={<Programas />} />
        <Route path="/gestionProyectos" element={<Layout><GestionProyectos /></Layout>} />


      </Routes>
    </Router>
  );
}

export default App;
