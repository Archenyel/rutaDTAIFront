import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Layout.css";

const Layout = ({ children }) => {

  console.log(localStorage.getItem("userRole"));
  console.log(localStorage.getItem("userId"));
  console.log(localStorage.getItem("userName"));

  const location = useLocation();
  const navigate = useNavigate();

  const sinLayout = ["/login", "/registro"];
  const ocultarLayout = sinLayout.includes(location.pathname);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handlePerfil = () => {
    navigate("/perfil");
  };

  if (ocultarLayout) {
    return (
      <div style={{ width: "100%", minHeight: "100vh", margin: 0, padding: 0 }}>
        {children}
      </div>
    );
  }

  return (
    <div className="layout-wrapper">
      {/* Header */}
      <header className="layout-header">
        <div className="container-fluid">
          <div className="row align-items-center py-3">
            <div className="col">
              <h4 className="mb-0 text-white">RutaDTAI - Sistema</h4>
            </div>
            <div className="col-auto">
              <button className="header-btn me-2" onClick={handlePerfil}>
                Ver perfil
              </button>
              <button className="header-btn logout-btn" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="layout-content">{children}</main>

      {/* Footer */}
      <footer className="layout-footer">
        <div className="container text-center">
          <p className="mb-0">
            © 2025 RutaDTAI - Sistema de Gestión de Proyectos | Universidad Tecnológica de Querétaro
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
