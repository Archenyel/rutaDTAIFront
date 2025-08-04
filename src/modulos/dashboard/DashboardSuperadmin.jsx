import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Nav,
  Button,
  Form,
  Modal,
  ProgressBar,
  ListGroup,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Layout from "../../componentes/Layout/Layout";
import "./DashboardAdmin.css";

const DashboardSuperadmin = ({ user }) => {
  const [theme, setTheme] = useState("light");
  const [greeting, setGreeting] = useState("");
  const [activeTab, setActiveTab] = useState("proyectos");
  const [showProyectoModal, setShowProyectoModal] = useState(false);
  const [showAlumnoModal, setShowAlumnoModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  
  // Datos para notificaciones y Kanban
  const [recentAlerts, setRecentAlerts] = useState([
    { id: 1, tipo: "warning", mensaje: "Proyecto 'Sistema Escolar' retrasado", fecha: "Hace 1 hora", prioridad: "alta" },
    { id: 2, tipo: "info", mensaje: "Nuevo documento subido por Ana García", fecha: "Hace 2 horas", prioridad: "media" },
    { id: 3, tipo: "success", mensaje: "Proyecto 'Portal Digital' completado", fecha: "Hace 4 horas", prioridad: "alta" },
    { id: 4, tipo: "danger", mensaje: "Tarea vencida sin completar", fecha: "Hace 6 horas", prioridad: "alta" },
  ]);
  
  const [tasksDistribution, setTasksDistribution] = useState({
    todo: 45,
    inProgress: 32,
    review: 21,
    done: 58,
  });

  const [proyectos, setProyectos] = useState([
    {
      id: 1,
      nombre: "Sistema de Gestión Escolar",
      tipo: "Proyecto Estratégico",
      participantes: 8,
      estado: "En progreso",
      prioridad: "Alta",
      inicio: "2025-06-15",
      fin: "2025-08-30",
    },
    {
      id: 2,
      nombre: "Portal de Recursos",
      tipo: "Proyecto Operativo",
      participantes: 5,
      estado: "Finalizado",
      prioridad: "Media",
      inicio: "2025-04-10",
      fin: "2025-06-20",
    },
  ]);
  
  const [alumnos, setAlumnos] = useState([
    {
      id: 1,
      nombre: "Ana García",
      carrera: "Ing. de Software",
      proyectos: 2,
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "Luis Pérez",
      carrera: "Redes",
      proyectos: 1,
      estado: "Inactivo",
    },
    {
      id: 3,
      nombre: "María López",
      carrera: "Sistemas",
      proyectos: 3,
      estado: "Activo",
    },
  ]);
  
  const [administradores, setAdministradores] = useState([
    {
      id: 1,
      nombre: "Carlos Jiménez",
      proyectos: 3,
      estado: "Activo",
    },
    {
      id: 2,
      nombre: "Sofía Méndez",
      proyectos: 1,
      estado: "Activo",
    },
  ]);

  // Form states for adding/editing
  const [newProyecto, setNewProyecto] = useState({
    id: null,
    nombre: "",
    tipo: "Proyecto Estratégico",
    participantes: 1,
    estado: "En progreso",
    prioridad: "Media",
    inicio: "",
    fin: "",
  });
  
  const [newAlumno, setNewAlumno] = useState({
    id: null,
    nombre: "",
    carrera: "",
    proyectos: 0,
    estado: "Activo",
  });
  
  const [newAdmin, setNewAdmin] = useState({
    id: null,
    nombre: "",
    proyectos: 0,
    estado: "Activo",
  });

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
    totalProyectos: proyectos.length,
    proyectosActivos: proyectos.filter((p) => p.estado === "En progreso").length,
    totalTareas: 240,
    tareasCompletadas: 180,
    totalAlumnos: alumnos.length,
    alumnosActivos: alumnos.filter((a) => a.estado === "Activo").length,
    totalDocumentos: 154,
    alertasRecientes: recentAlerts.length,
    totalPortafolios: 12,
    totalProgramas: 8,
  };

  // Handlers for adding/editing items
  const handleAddOrEditProyecto = (e) => {
    e.preventDefault();
    const proyecto = {
      id: newProyecto.id || proyectos.length + 1,
      ...newProyecto,
      participantes: parseInt(newProyecto.participantes),
    };
    if (newProyecto.id) {
      setProyectos(proyectos.map((p) => (p.id === newProyecto.id ? proyecto : p)));
    } else {
      setProyectos([...proyectos, proyecto]);
    }
    setNewProyecto({
      id: null,
      nombre: "",
      tipo: "Proyecto Estratégico",
      participantes: 1,
      estado: "En progreso",
      prioridad: "Media",
      inicio: "",
      fin: "",
    });
    setShowProyectoModal(false);
  };

  const handleAddOrEditAlumno = (e) => {
    e.preventDefault();
    const alumno = {
      id: newAlumno.id || alumnos.length + 1,
      ...newAlumno,
      proyectos: parseInt(newAlumno.proyectos),
    };
    if (newAlumno.id) {
      setAlumnos(alumnos.map((a) => (a.id === newAlumno.id ? alumno : a)));
    } else {
      setAlumnos([...alumnos, alumno]);
    }
    setNewAlumno({
      id: null,
      nombre: "",
      carrera: "",
      proyectos: 0,
      estado: "Activo",
    });
    setShowAlumnoModal(false);
  };

  const handleAddOrEditAdmin = (e) => {
    e.preventDefault();
    const admin = {
      id: newAdmin.id || administradores.length + 1,
      ...newAdmin,
      proyectos: parseInt(newAdmin.proyectos),
    };
    if (newAdmin.id) {
      setAdministradores(administradores.map((a) => (a.id === newAdmin.id ? admin : a)));
    } else {
      setAdministradores([...administradores, admin]);
    }
    setNewAdmin({
      id: null,
      nombre: "",
      proyectos: 0,
      estado: "Activo",
    });
    setShowAdminModal(false);
  };

  // Delete handlers
  const handleDeleteProyecto = (id) => {
    setProyectos(proyectos.filter((p) => p.id !== id));
  };

  const handleDeleteAlumno = (id) => {
    setAlumnos(alumnos.filter((a) => a.id !== id));
  };

  const handleDeleteAdmin = (id) => {
    setAdministradores(administradores.filter((a) => a.id !== id));
  };

  // Edit handlers
  const handleEditProyecto = (proyecto) => {
    setNewProyecto(proyecto);
    setShowProyectoModal(true);
  };

  const handleEditAlumno = (alumno) => {
    setNewAlumno(alumno);
    setShowAlumnoModal(true);
  };

  const handleEditAdmin = (admin) => {
    setNewAdmin(admin);
    setShowAdminModal(true);
  };

  // Helper functions for alerts and tasks
  const getAlertIcon = (tipo) => {
    switch (tipo) {
      case "warning": return "bi-exclamation-triangle text-warning";
      case "info": return "bi-info-circle text-info";
      case "success": return "bi-check-circle text-success";
      case "danger": return "bi-x-circle text-danger";
      default: return "bi-bell text-muted";
    }
  };

  const getPriorityBadge = (prioridad) => {
    switch (prioridad) {
      case "alta": return "danger";
      case "media": return "warning";
      case "baja": return "secondary";
      default: return "secondary";
    }
  };

  return (
    <Layout>
      <button
        className="btn btn-outline-secondary position-fixed theme-toggle"
        onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
        aria-label="Cambiar tema"
        title={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
        style={{ zIndex: 1100 }}
      >
        <i className={`bi ${theme === "light" ? "bi-moon-stars-fill" : "bi-sun-fill"} theme-icon`}></i>
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
              <p className="text-muted lead">Panel general de supervisión del sistema</p>
            </div>
          </div>
        </div>
        
        {/* Sección de Estadísticas y Alertas */}
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
            {
              key: "portafolios",
              label: "Portafolios",
              icon: "bi-briefcase-fill",
              value: generalStats.totalPortafolios,
              subtitle: "Total de portafolios",
              bgGradient: "gradient-purple",
              to: "/portafolios",
            },
            {
              key: "programas",
              label: "Programas",
              icon: "bi-briefcase",
              value: generalStats.totalProgramas,
              subtitle: "Total de programas",
              bgGradient: "gradient-teal",
              to: "/programas",
            },
          ].map((card, index) => (
            <Col md={6} lg={3} key={card.key}>
              <Card
                as={card.to ? Link : Card}
                to={card.to}
                className={`admin-stat-card shadow-sm border-0 text-center ${card.bgGradient} fade-in`}
                style={{ animationDelay: `${index * 0.1}s`, cursor: card.to ? "pointer" : "default" }}
              >
                <Card.Body className="p-4">
                  <div className="icon-container mb-3">
                    <i className={`bi ${card.icon} fs-1 text-white`}></i>
                  </div>
                  <Card.Title className="text-uppercase small fw-semibold text-white-50 mb-2">{card.label}</Card.Title>
                  <h2 className="fw-bold mb-1 text-white">{card.value}</h2>
                  <small className="text-white-50">{card.subtitle}</small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

                {/* Sección de Navegación con Botones */}
        <Row className="g-4 mb-5">
          <Col lg={12}>
            <Card className="shadow-sm modern-card">
              <Card.Header className="bg-white border-0 p-4">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-grid-3x3-gap-fill me-2 text-primary"></i>
                  Gestión del Sistema
                </h5>
                <small className="text-muted">Acceso rápido a los módulos principales</small>
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
                        <small className="text-white-50">Gestionar portafolios digitales</small>
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
                        <small className="text-white-50">Administrar programas académicos</small>
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
                        <small className="text-white-50">Supervisar todos los proyectos</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={6} lg={3}>
                    <Card 
                      as={Link} 
                      to="/usuarios-administradores" 
                      className="text-center border-0 shadow-sm h-100 navigation-card gradient-warning"
                      style={{ cursor: "pointer", textDecoration: "none" }}
                    >
                      <Card.Body className="p-4">
                        <div className="icon-container mb-3">
                          <i className="bi bi-people-fill fs-1 text-white"></i>
                        </div>
                        <h6 className="text-white fw-bold mb-2">Usuarios</h6>
                        <small className="text-white-50">Gestionar usuarios y admins</small>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Sección de Distribución de Tareas y Alertas */}
        <Row className="g-4 mb-5">
          <Col lg={8}>
            <Card className="shadow-sm h-100 modern-card">
              <Card.Header className="bg-white border-0 p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-0 fw-bold">
                      <i className="bi bi-bar-chart-fill me-2 text-primary"></i>
                      Distribución de Tareas
                    </h5>
                    <small className="text-muted">Estado actual del trabajo en el sistema</small>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="tasks-distribution">
                  <div className="task-stat">
                    <div className="task-circle bg-secondary">
                      <span className="task-number">{tasksDistribution.todo}</span>
                    </div>
                    <p className="task-label">Por hacer</p>
                  </div>
                  <div className="task-stat">
                    <div className="task-circle bg-warning">
                      <span className="task-number">{tasksDistribution.inProgress}</span>
                    </div>
                    <p className="task-label">En progreso</p>
                  </div>
                  <div className="task-stat">
                    <div className="task-circle bg-info">
                      <span className="task-number">{tasksDistribution.review}</span>
                    </div>
                    <p className="task-label">En revisión</p>
                  </div>
                  <div className="task-stat">
                    <div className="task-circle bg-success">
                      <span className="task-number">{tasksDistribution.done}</span>
                    </div>
                    <p className="task-label">Completadas</p>
                  </div>
                  <Link to="/SuperadminKanban" className="btn btn-primary btn-sm rounded-pill mt-3" style={{ width: "100%" }}>
                    <i className="bi bi-kanban me-2"></i>
                    Ir al tablero Kanban
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="shadow-sm h-100 modern-card">
              <Card.Header className="bg-white border-0 p-4">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-bell-fill me-2 text-danger"></i>
                  Alertas Recientes
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {recentAlerts.map((alert, index) => (
                    <ListGroup.Item key={alert.id} className="alert-item p-3 border-0">
                      <div className="d-flex align-items-start">
                        <i className={`bi ${getAlertIcon(alert.tipo)} fs-5 me-3 mt-1`}></i>
                        <div className="flex-grow-1">
                          <p className="mb-1 fw-semibold">{alert.mensaje}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">{alert.fecha}</small>
                            <Badge bg={getPriorityBadge(alert.prioridad)} className="rounded-pill">
                              {alert.prioridad}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>


      </Container>
    </Layout>
  );
};

export default DashboardSuperadmin;