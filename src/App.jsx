import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./modulos/auth/Login";
import Roles from "./modulos/auth/Roles";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/roles/admin" element={<Roles rol="admin" />} />
        <Route path="/roles/superadmin" element={<Roles rol="superadmin" />} />
        <Route path="/roles/alumno" element={<Roles rol="alumno" />} />
      </Routes>
    </Router>
  );
}

export default App;
