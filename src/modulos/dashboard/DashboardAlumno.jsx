import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ProgressBar,
  Badge,
  ListGroup,
  OverlayTrigger,
  Tooltip,
  Alert,
  Spinner,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./DashboardAlumno.css";

const DashboardAlumno = ({ user }) => {
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");

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

  const [stats, setStats] = useState({
    proyectos: 0,
    tareasPendientes: 0,
    documentos: 0,
    notificaciones: 0,
  });
  const [proyectos, setProyectos] = useState([]);
  const [tareasKanban, setTareasKanban] = useState({
    todo: 0,
    inProgress: 0,
    done: 0,
  });
  const [documentos, setDocumentos] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);

  // Función para obtener saludo según la hora
  const getGreeting = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Buenos días";
    if (hora < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  useEffect(() => {
    setGreeting(getGreeting());
    
    const fetchData = async () => {
      // Simular carga de datos
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStats({
        proyectos: 3,
        tareasPendientes: 7,
        documentos: 5,
        notificaciones: 2,
      });
      setProyectos([
        { id: 1, nombre: "Sistema de Control", progreso: 70, estado: "En progreso", color: "warning" },
        { id: 2, nombre: "App Móvil Inventarios", progreso: 45, estado: "En desarrollo", color: "info" },
        { id: 3, nombre: "IoT Laboratorio", progreso: 90, estado: "Casi terminado", color: "success" },
      ]);
      setTareasKanban({ todo: 4, inProgress: 2, done: 1 });
      setDocumentos([
        { id: 1, nombre: "Especificación Requisitos.pdf", fecha: "2025‑07‑10", tipo: "pdf", tamaño: "2.3 MB" },
        { id: 2, nombre: "Diagrama UML.vsdx", fecha: "2025‑07‑09", tipo: "vsdx", tamaño: "1.8 MB" },
        { id: 3, nombre: "Presentación Final.pptx", fecha: "2025‑07‑08", tipo: "pptx", tamaño: "5.2 MB" },
      ]);
      setNotificaciones([
        { id: 1, texto: "Tarea Diseño UI asignada", fecha: "Hace 2 h", tipo: "tarea", leida: false },
        { id: 2, texto: "Documento aprobado: Requisitos", fecha: "Ayer", tipo: "documento", leida: true },
        { id: 3, texto: "Reunión de equipo programada", fecha: "Hace 1 día", tipo: "evento", leida: false },
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Función para obtener el icono del archivo
  const getFileIcon = (tipo) => {
    switch (tipo) {
      case "pdf": return "bi-file-pdf text-danger";
      case "vsdx": return "bi-file-earmark-bar-graph text-primary";
      case "pptx": return "bi-file-earmark-ppt text-warning";
      default: return "bi-file-earmark text-muted";
    }
  };

  // Función para obtener el icono de notificación
  const getNotificationIcon = (tipo) => {
    switch (tipo) {
      case "tarea": return "bi-list-check text-primary";
      case "documento": return "bi-file-check text-success";
      case "evento": return "bi-calendar-event text-info";
      default: return "bi-bell text-muted";
    }
  };

  if (loading) {
    return (
      <Container fluid className="dashboard-alumno d-flex justify-content-center align-items-center">
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h4>Cargando dashboard...</h4>
        </div>
      </Container>
    );
  }

  return (
    <>
      <button
        className="btn btn-outline-secondary position-fixed theme-toggle"
        onClick={toggleTheme}
        aria-label="Cambiar tema"
        title={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
      >
        <i
          className={`bi ${
            theme === "light" ? "bi-moon-stars-fill" : "bi-sun-fill"
          } theme-icon`}
        ></i>
      </button>

      <Container fluid className="dashboard-alumno pb-5">
        <div className="header-section mb-4">
          <h1 className="display-6 fw-bold mb-2 welcome-title">
            {greeting} {user?.nombre || "Alumno"} 
            <span className="wave-emoji">👋</span>
          </h1>
          <p className="text-muted lead">¡Listo para un día productivo!</p>
        </div>

        <Row className="g-4 mb-5">
          {[
            {
              key: "proyectos",
              label: "Proyectos",
              icon: "bi-folder-check",
              value: stats.proyectos,
              tip: "Cantidad de proyectos en los que participas",
              color: "primary",
              bgGradient: "gradient-primary"
            },
            {
              key: "tareas",
              label: "Tareas pendientes",
              icon: "bi-list-check",
              value: stats.tareasPendientes,
              tip: "Tareas asignadas que aún debes completar",
              color: "warning",
              bgGradient: "gradient-warning"
            },
            {
              key: "documentos",
              label: "Documentos",
              icon: "bi-file-earmark-text",
              value: stats.documentos,
              tip: "Número de archivos y entregables que has subido",
              color: "success",
              bgGradient: "gradient-success"
            },
            {
              key: "notificaciones",
              label: "Notificaciones",
              icon: "bi-bell",
              value: stats.notificaciones,
              tip: "Alertas recientes sobre tu actividad",
              color: "info",
              bgGradient: "gradient-info"
            },
          ].map((card, index) => (
            <Col md={6} lg={3} key={card.key}>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip className="custom-tooltip">{card.tip}</Tooltip>}
              >
                <Card className={`card-summary shadow-sm border-0 text-center cursor-pointer ${card.bgGradient} fade-in`} 
                      style={{ animationDelay: `${index * 0.1}s` }}>
                  <Card.Body className="p-4">
                    <div className="icon-container mb-3">
                      <i className={`bi ${card.icon} fs-1 text-white`}></i>
                    </div>
                    <Card.Title className="text-uppercase small fw-semibold text-white-50 mb-2">
                      {card.label}
                    </Card.Title>
                    <h2 className="fw-bold mb-0 text-white counter" data-target={card.value}>
                      {card.value}
                    </h2>
                  </Card.Body>
                </Card>
              </OverlayTrigger>
            </Col>
          ))}
        </Row>

        <Row className="mb-5">
          <Col lg={8}>
            <Card className="shadow-sm h-100 modern-card">
              <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center p-4">
                <div>
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-kanban-fill me-2 text-primary"></i>
                    Mis proyectos
                  </h5>
                  <small className="text-muted">Estado actual de tus proyectos</small>
                </div>
                <a href="/proyectos" className="btn btn-sm btn-outline-primary rounded-pill">
                  Ver todos <i className="bi bi-arrow-right"></i>
                </a>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {proyectos.map((p, index) => (
                    <ListGroup.Item
                      key={p.id}
                      className="list-item-hover p-4 border-0"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="flex-grow-1 me-3">
                          <div className="d-flex align-items-center mb-2">
                            <h6 className="mb-0 fw-semibold">{p.nombre}</h6>
                            <Badge bg={p.color} className="ms-2 rounded-pill">
                              {p.estado}
                            </Badge>
                          </div>
                          <div className="progress-container">
                            <ProgressBar
                              now={p.progreso}
                              className="custom-progress"
                              variant={p.color}
                            />
                            <small className="text-muted mt-1">{p.progreso}% completado</small>
                          </div>
                        </div>
                        <a
                          href={`/proyectos/${p.id}`}
                          className="btn btn-sm btn-outline-primary rounded-pill"
                        >
                          Abrir <i className="bi bi-box-arrow-up-right"></i>
                        </a>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} className="mt-4 mt-lg-0">
            <Card className="shadow-sm h-100 modern-card">
              <Card.Header className="bg-white border-0 text-center p-4">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-columns-gap me-2 text-primary"></i>
                  Tareas por estado
                </h5>
                <small className="text-muted">Distribución de tu trabajo</small>
              </Card.Header>
              <Card.Body className="text-center p-4">
                <div className="kanban-stats mb-4">
                  <div className="stat-item">
                    <div className="stat-circle bg-secondary">
                      <span className="stat-number">{tareasKanban.todo}</span>
                    </div>
                    <p className="stat-label">Por hacer</p>
                  </div>
                  <div className="stat-item">
                    <div className="stat-circle bg-warning">
                      <span className="stat-number">{tareasKanban.inProgress}</span>
                    </div>
                    <p className="stat-label">En progreso</p>
                  </div>
                  <div className="stat-item">
                    <div className="stat-circle bg-success">
                      <span className="stat-number">{tareasKanban.done}</span>
                    </div>
                    <p className="stat-label">Terminadas</p>
                  </div>
                </div>
                <a href="/kanban" className="btn btn-primary rounded-pill w-100">
                  <i className="bi bi-kanban me-2"></i>
                  Ir al tablero
                </a>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={6}>
            <Card className="shadow-sm h-100 modern-card">
              <Card.Header className="bg-white border-0 p-4">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-file-earmark-text me-2 text-primary"></i>
                  Documentos recientes
                </h5>
                <small className="text-muted">Tus archivos más recientes</small>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {documentos.map((d, index) => (
                    <ListGroup.Item
                      key={d.id}
                      className="list-item-hover p-4 border-0"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="d-flex align-items-center">
                        <i className={`bi ${getFileIcon(d.tipo)} fs-3 me-3`}></i>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-semibold">{d.nombre}</h6>
                          <div className="d-flex justify-content-between">
                            <small className="text-muted">{d.fecha}</small>
                            <small className="text-muted">{d.tamaño}</small>
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
              <Card.Footer className="bg-white border-0 text-center p-3">
                <a href="/documentos" className="btn btn-sm btn-outline-primary rounded-pill">
                  Ver todos los documentos
                </a>
              </Card.Footer>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="shadow-sm h-100 modern-card">
              <Card.Header className="bg-white border-0 p-4">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-bell-fill me-2 text-primary"></i>
                  Últimas notificaciones
                </h5>
                <small className="text-muted">Manténte al día con las novedades</small>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {notificaciones.map((n, index) => (
                    <ListGroup.Item 
                      key={n.id} 
                      className={`list-item-hover p-4 border-0 ${!n.leida ? 'notification-unread' : ''}`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="d-flex align-items-start">
                        <i className={`bi ${getNotificationIcon(n.tipo)} fs-5 me-3 mt-1`}></i>
                        <div className="flex-grow-1">
                          <p className="mb-1 fw-semibold">{n.texto}</p>
                          <small className="text-muted">{n.fecha}</small>
                          {!n.leida && (
                            <Badge bg="primary" className="ms-2 rounded-pill">
                              Nuevo
                            </Badge>
                          )}
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
              <Card.Footer className="bg-white border-0 text-center p-3">
                <a href="/notificaciones" className="btn btn-sm btn-outline-primary rounded-pill">
                  Ver todas las notificaciones
                </a>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DashboardAlumno;