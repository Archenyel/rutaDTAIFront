import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./modulos/auth/Login";
import Roles from "./modulos/auth/Roles";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/roles" element={<Roles rol="admin" />} />
      </Routes>
    </Router>
  );
}

export default App;
