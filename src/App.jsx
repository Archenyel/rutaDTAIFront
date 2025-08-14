import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./modulos/auth/Login";
import Registro from "./modulos/auth/Registro";
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
import ListaProyectos from "./componentes/listaProyectos";
import GestionUsuarios from "./componentes/GestionUsuarios";
import ListaProyectosAlumno from "./componentes/listaProyectosAlumno";
import ProtectedRoute from "./componentes/ProtectedRoute";
import UploadToGCS from "./pages/UploadToGCS";
import Perfil from "./modulos/perfil/ModuloPerfil"


function App() {
  return (
    <Router>

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/upload" element={<UploadToGCS />} />

        
        
        {/* Rutas para Superadmin (rol 0) */}
        <Route 
          path="/dashboardSuperadmin" 
          element={
            <ProtectedRoute allowedRoles={[0]}>
              <SuperAdmin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/SuperadminKanban" 
          element={
            <ProtectedRoute allowedRoles={[0]}>
              <Layout><SuperadminKanban /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/gestionUsuarios" 
          element={
            <ProtectedRoute allowedRoles={[0]}>
              <Layout><GestionUsuarios /></Layout>
            </ProtectedRoute>
          } 
        />

        {/* Rutas para Admin (rol 1) */}
        <Route 
          path="/dashboardAdmin" 
          element={
            <ProtectedRoute allowedRoles={[0,1]}>
              <DashboardAdmin />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/adminKanban/:id" 
          element={
            <ProtectedRoute allowedRoles={[0,1]}>
              <Layout><AdminKanban /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/gestionProyectos" 
          element={
            <ProtectedRoute allowedRoles={[0,1]}>
              <Layout><GestionProyectos /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/listaProyectos" 
          element={
            <ProtectedRoute allowedRoles={[0,1]}>
              <Layout><ListaProyectos /></Layout>
            </ProtectedRoute>
          } 
        />

        {/* Rutas para Alumnos (rol 2) */}
        <Route 
          path="/dashboardAlumno" 
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <Layout><DashboardAlumno /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/listaProyectosAlumno" 
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <Layout><ListaProyectosAlumno /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/alumno" 
          element={
            <ProtectedRoute allowedRoles={[2]}>
              <Layout><Alumno /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/kanban" 
          element={
            <ProtectedRoute allowedRoles={[0,1,2]}>
              <Layout><Kanban /></Layout>
            </ProtectedRoute>
          } 
        />

        {/* Rutas compartidas entre roles autenticados */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={[0, 1, 2]}>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/proyectos" 
          element={
            <ProtectedRoute allowedRoles={[0, 1, 2]}>
              <Layout><Proyecto /></Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/perfil" 
          element={
            <ProtectedRoute allowedRoles={[0, 1, 2]}>
              <Layout><Perfil /></Layout>
            </ProtectedRoute>
          } 
        />

        {/* Rutas que parecen públicas o legacy - evaluar si necesitan protección */}
        <Route 
          path="/portafolios" 
          element={
            <ProtectedRoute allowedRoles={[0]}>
              <Portafolios />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/programas" 
          element={
            <ProtectedRoute allowedRoles={[0, 1, 2]}>
              <Programas />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
