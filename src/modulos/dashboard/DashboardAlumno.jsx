import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./DashboardAlumno.css";

const DashboardAlumno = ({ user }) => {
  const [theme, setTheme] = useState("light");
  const [greeting, setGreeting] = useState("");
  const navigate = useNavigate();

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    // Guardar preferencia del tema en localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Cargar tema guardado al iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Función para obtener saludo según la hora
  const getGreeting = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Buenos días";
    if (hora < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  // Funciones principales del alumno (solo 3)
  const mainFunctions = [
    {
      title: "Mis Tareas",
      description: "Ver y gestionar todas mis tareas asignadas",
      icon: "bi-list-check",
      color: "primary",
      path: "/kanban",
      bgGradient: "gradient-primary",
    },
    {
      title: "Mis Proyectos",
      description: "Acceder a los proyectos en los que participo",
      icon: "bi-folder",
      color: "success",
      path: "/proyectos",
      bgGradient: "gradient-success",
    },
    {
      title: "Mi Perfil",
      description: "Configurar mi información personal",
      icon: "bi-person-circle",
      color: "warning",
      path: "/perfil",
      bgGradient: "gradient-warning",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <>
      {/* Botón de tema */}
      <button
        className="btn btn-outline-secondary position-fixed theme-toggle"
        onClick={toggleTheme}
        style={{ top: "20px", right: "20px", zIndex: 1000 }}
      >
        <i
          className={`bi ${
            theme === "light" ? "bi-moon-stars-fill" : "bi-sun-fill"
          }`}
        ></i>
      </button>

      {/* Botón de cerrar sesión */}
      <button
        className="btn btn-outline-danger position-fixed"
        onClick={handleLogout}
        style={{ top: "20px", right: "80px", zIndex: 1000 }}
        title="Cerrar Sesión"
      >
        <i className="bi bi-box-arrow-right"></i>
      </button>

      <Container fluid className="min-vh-100 d-flex align-items-center py-4">
        <Container>
          {/* Header de bienvenida */}
          <Row className="text-center mb-5">
            <Col>
              <h1 className="display-4 fw-bold mb-3">
                {greeting}, {user?.usuario || "Alumno"}!
                <span className="ms-3">👋</span>
              </h1>
              <p className="lead text-muted">¿Qué te gustaría hacer hoy?</p>
            </Col>
          </Row>

          {/* Botones principales */}
          <Row className="g-4 justify-content-center">
            {mainFunctions.map((func, index) => (
              <Col key={index} md={6} lg={4} xl={4}>
                <Card
                  className={`h-100 shadow-lg border-0 text-center cursor-pointer ${func.bgGradient} card-hover`}
                  onClick={() => handleNavigation(func.path)}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <Card.Body className="d-flex flex-column justify-content-center p-5">
                    <div className="mb-4">
                      <i className={`bi ${func.icon} display-1 text-white`}></i>
                    </div>
                    <h4 className="fw-bold text-white mb-3">{func.title}</h4>
                    <p className="text-white-50 mb-4">{func.description}</p>
                    <Button
                      variant="light"
                      className="mt-auto fw-bold"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNavigation(func.path);
                      }}
                    >
                      Ir ahora
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          
          {/* Footer con información útil */}
          <Row className="mt-5">
            <Col className="text-center">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                ¿Necesitas ayuda? Contacta a tu administrador o revisa la documentación
              </small>
            </Col>
          </Row>
        </Container>
      </Container>

      <style jsx>{`
        .card-hover:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
        }

        .gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .gradient-success {
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
        }

        .gradient-info {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .gradient-warning {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }

        .gradient-danger {
          background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
        }

        .gradient-secondary {
          background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        }

        .theme-toggle {
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cursor-pointer {
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .display-4 {
            font-size: 2rem;
          }

          .lead {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
};

export default DashboardAlumno;