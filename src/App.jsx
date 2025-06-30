import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./modulos/auth/Login";
import Admin from "./modulos/paneles/Admin";
import SuperAdmin from "./modulos/paneles/SuperAdmin";
import Alumno from "./modulos/paneles/Alumno";
import Registro from "./modulos/auth/Registro";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/superadmin" element={<SuperAdmin />} />
        <Route path="/alumno" element={<Alumno />} />
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </Router>
  );
}

export default App;
