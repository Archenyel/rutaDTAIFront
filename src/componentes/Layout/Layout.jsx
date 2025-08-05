import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Layout.css";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sinLayout = ["/login", "/registro"];
  const ocultarLayout = sinLayout.includes(location.pathname);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handlePerfil = () => {
    navigate("/perfil");
  };

  const userRole = localStorage.getItem("userRole"); // "0", "1", "2"
  const fotoPerfil = localStorage.getItem("userPhoto");
  const userName = localStorage.getItem("userName") || "U";

  // Define ruta de dashboard según rol
  const dashboardRoute = () => {
    if (userRole === "0") return "/dashboardSuperadmin";
    if (userRole === "1") return "/dashboardAdmin";
    if (userRole === "2") return "/dashboardAlumno";
    return "/dashboard"; // default
  };

  const renderNavLinks = () => {
    // Alumno
    if (userRole === "2") {
      return (
        <>
          <button
            className="header-btn me-2"
            onClick={() => navigate("/proyectos")}
            type="button"
          >
            Proyectos
          </button>
          <button
            className="header-btn me-2"
            onClick={() => navigate("/kanban")}
            type="button"
          >
            Tareas
          </button>
        </>
      );
    }

    // Admin
    if (userRole === "1") {
      return (
        <>
          <button
            className="header-btn me-2"
            onClick={() => navigate("/gestionProyectos")}
            type="button"
          >
            Proyectos
          </button>
          <button
            className="header-btn me-2"
            onClick={() => navigate("/programas")}
            type="button"
          >
            Programas
          </button>
        </>
      );
    }

    // Superadmin
    if (userRole === "0") {
      return (
        <>
          <button
            className="header-btn me-2"
            onClick={() => navigate("/SuperadminKanban")}
            type="button"
          >
            Tareas
          </button>
          <button
            className="header-btn me-2"
            onClick={() => navigate("/programas")}
            type="button"
          >
            Programas
          </button>
          <button
            className="header-btn me-2"
            onClick={() => navigate("/portafolios")}
            type="button"
          >
            Portafolios
          </button>
        </>
      );
    }

    return null;
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
              {/* Aquí el texto que navega al dashboard según rol */}
              <button
                onClick={() => navigate(dashboardRoute())}
                className="header-brand-btn"
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  color: "white",
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                aria-label="Ir al dashboard"
              >
                RutaDTAI - Sistema
              </button>
            </div>
            <div className="col-auto d-flex align-items-center gap-2">
              {renderNavLinks()}

              <button
                className="header-btn me-2"
                onClick={handlePerfil}
                type="button"
              >
                Ver perfil
              </button>

              {fotoPerfil ? (
                <img
                  src={fotoPerfil}
                  alt="Foto de perfil"
                  className="rounded-circle"
                  style={{
                    width: "40px",
                    height: "40px",
                    objectFit: "cover",
                    border: "2px solid white",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "#666",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}

              <button
                className="header-btn logout-btn"
                onClick={handleLogout}
                type="button"
              >
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
