import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Layout from "../../componentes/Layout/Layout";
import "./DashboardAdmin.css";

const DashboardSuperadmin = ({ user }) => {
  const [theme, setTheme] = useState("light");
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  useEffect(() => {
    const hora = new Date().getHours();
    if (hora < 12) setGreeting("Buenos días");
    else if (hora < 18) setGreeting("Buenas tardes");
    else setGreeting("Buenas noches");
  }, []);

  const generalStats = {
    totalProyectos: 15,
    proyectosActivos: 8,
    totalTareas: 240,
    tareasCompletadas: 180,
    totalAlumnos: 25,
    alumnosActivos: 20,
    totalDocumentos: 154,
    totalPortafolios: 12,
    totalProgramas: 8,
  };

  return (
    <Layout>
      <button
        className="btn btn-outline-secondary position-fixed theme-toggle"
        onClick={() =>
          setTheme((prev) => (prev === "light" ? "dark" : "light"))
        }
        aria-label="Cambiar tema"
        title={
          theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"
        }
        style={{ zIndex: 1100 }}
      >
        <i
          className={`bi ${
            theme === "light" ? "bi-moon-stars-fill" : "bi-sun-fill"
          } theme-icon`}
        ></i>
      </button>
      <Container fluid className="dashboard-admin pb-5">
        <div className="admin-header mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-6 fw-bold mb-2 welcome-title">
                {greeting} {user?.nombre || "SuperAdministrador"}
                <span className="admin-badge ms-3">
                  <i className="bi bi-shield-lock me-1"></i>
                  SuperAdmin
                </span>
              </h1>
              <p className="text-muted lead">
                Panel general de supervisión del sistema
              </p>
            </div>
          </div>
        </div>

        {/* Sección de Navegación con Botones */}
        <Row className="g-4 mb-5">
          <Col lg={12}>
            <Card className="shadow-sm modern-card">
              <Card.Header className="bg-white border-0 p-4">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-grid-3x3-gap-fill me-2 text-primary"></i>
                  Gestión del Sistema
                </h5>
                <small className="text-muted">
                  Acceso rápido a los módulos principales
                </small>
              </Card.Header>
              <Card.Body className="p-4">
                <Row className="g-3">
                  <Col md={6} lg={3}>
                    <Card
                      as={Link}
                      to="/portafolios"
                      className="text-center border-0 shadow-sm h-100 navigation-card gradient-primary"
                      style={{ cursor: "pointer", textDecoration: "none" }}
                    >
                      <Card.Body className="p-4">
                        <div className="icon-container mb-3">
                          <i className="bi bi-briefcase-fill fs-1 text-white"></i>
                        </div>
                        <h6 className="text-white fw-bold mb-2">Portafolios</h6>
                        <small className="text-white-50">
                          Gestionar portafolios digitales
                        </small>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6} lg={3}>
                    <Card
                      as={Link}
                      to="/programas"
                      className="text-center border-0 shadow-sm h-100 navigation-card gradient-success"
                      style={{ cursor: "pointer", textDecoration: "none" }}
                    >
                      <Card.Body className="p-4">
                        <div className="icon-container mb-3">
                          <i className="bi bi-briefcase fs-1 text-white"></i>
                        </div>
                        <h6 className="text-white fw-bold mb-2">Programas</h6>
                        <small className="text-white-50">
                          Administrar programas académicos
                        </small>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6} lg={3}>
                    <Card
                      as={Link}
                      to="/listaproyectos"
                      className="text-center border-0 shadow-sm h-100 navigation-card gradient-info"
                      style={{ cursor: "pointer", textDecoration: "none" }}
                    >
                      <Card.Body className="p-4">
                        <div className="icon-container mb-3">
                          <i className="bi bi-folder-check fs-1 text-white"></i>
                        </div>
                        <h6 className="text-white fw-bold mb-2">Proyectos</h6>
                        <small className="text-white-50">
                          Supervisar todos los proyectos
                        </small>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={6} lg={3}>
                    <Card
                      as={Link}
                      to="/gestionUsuarios"
                      className="text-center border-0 shadow-sm h-100 navigation-card gradient-warning"
                      style={{ cursor: "pointer", textDecoration: "none" }}
                    >
                      <Card.Body className="p-4">
                        <div className="icon-container mb-3">
                          <i className="bi bi-people-fill fs-1 text-white"></i>
                        </div>
                        <h6 className="text-white fw-bold mb-2">Usuarios</h6>
                        <small className="text-white-50">
                          Gestionar usuarios y admins
                        </small>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Sección de Estadísticas */}
        <Row className="g-4 mb-5">
          {[
            {
              key: "proyectos",
              label: "Proyectos Totales",
              icon: "bi-folder-check",
              value: generalStats.totalProyectos,
              subtitle: `${generalStats.proyectosActivos} activos`,
              bgGradient: "gradient-primary",
            },
            {
              key: "tareas",
              label: "Tareas Totales",
              icon: "bi-list-check",
              value: generalStats.totalTareas,
              subtitle: `${generalStats.tareasCompletadas} completadas`,
              bgGradient: "gradient-success",
            },
            {
              key: "alumnos",
              label: "Alumnos Totales",
              icon: "bi-people",
              value: generalStats.totalAlumnos,
              subtitle: `${generalStats.alumnosActivos} activos`,
              bgGradient: "gradient-info",
            },
            {
              key: "documentos",
              label: "Documentos",
              icon: "bi-file-earmark-text",
              value: generalStats.totalDocumentos,
              subtitle: `Historial general`,
              bgGradient: "gradient-warning",
            },
          ].map((card, index) => (
            <Col md={6} lg={3} key={card.key}>
              <Card
                className={`admin-stat-card shadow-sm border-0 text-center ${card.bgGradient} fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card.Body className="p-4">
                  <div className="icon-container mb-3">
                    <i className={`bi ${card.icon} fs-1 text-white`}></i>
                  </div>
                  <Card.Title className="text-uppercase small fw-semibold text-white-50 mb-2">
                    {card.label}
                  </Card.Title>
                  <h2 className="fw-bold mb-1 text-white">{card.value}</h2>
                  <small className="text-white-50">{card.subtitle}</small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Layout>
  );
};

export default DashboardSuperadmin;
