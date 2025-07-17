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
  Dropdown,
  Form,
  Button,
  Table,
  Nav,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./DashboardAdmin.css";

const DashboardAdmin = ({ user }) => {
  const [theme, setTheme] = useState("light");
  const [greeting, setGreeting] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [dateFilter, setDateFilter] = useState("7");
  const [careerFilter, setCareerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  // Datos estáticos que siempre están disponibles - CONSTANTES
  const generalStats = {
    totalProyectos: 24,
    proyectosActivos: 18,
    proyectosFinalizados: 6,
    totalTareas: 156,
    tareasCompletadas: 98,
    tareasPendientes: 58,
    totalAlumnos: 145,
    alumnosActivos: 132,
    totalDocumentos: 89,
    alertasRecientes: 12,
  };

  const projectsData = [
    { id: 1, nombre: "Sistema de Gestión Escolar", participantes: 8, progreso: 85, estado: "En progreso", prioridad: "alta", fechaInicio: "2025-06-15", fechaFin: "2025-08-30" },
    { id: 2, nombre: "App Móvil de Biblioteca", participantes: 5, progreso: 60, estado: "En desarrollo", prioridad: "media", fechaInicio: "2025-07-01", fechaFin: "2025-09-15" },
    { id: 3, nombre: "Portal de Recursos Digitales", participantes: 12, progreso: 100, estado: "Finalizado", prioridad: "alta", fechaInicio: "2025-05-01", fechaFin: "2025-07-10" },
    { id: 4, nombre: "Sistema de Evaluación Online", participantes: 6, progreso: 35, estado: "Planificación", prioridad: "baja", fechaInicio: "2025-07-10", fechaFin: "2025-10-30" },
  ];

  const studentsData = [
    { id: 1, nombre: "Ana García", carrera: "Ingeniería de Software", proyectos: 2, tareas: 8, completadas: 6, estado: "activo", ultimaActividad: "Hace 2 horas" },
    { id: 2, nombre: "Carlos López", carrera: "Sistemas Computacionales", proyectos: 1, tareas: 5, completadas: 4, estado: "activo", ultimaActividad: "Hace 1 día" },
    { id: 3, nombre: "María Rodríguez", carrera: "Ingeniería de Software", proyectos: 3, tareas: 12, completadas: 10, estado: "activo", ultimaActividad: "Hace 3 horas" },
    { id: 4, nombre: "Diego Martínez", carrera: "Redes y Telecomunicaciones", proyectos: 1, tareas: 4, completadas: 2, estado: "inactivo", ultimaActividad: "Hace 3 días" },
  ];

  const tasksDistribution = {
    todo: 45,
    inProgress: 32,
    review: 21,
    done: 58,
  };

  const recentAlerts = [
    { id: 1, tipo: "warning", mensaje: "Proyecto 'Sistema Escolar' retrasado", fecha: "Hace 1 hora", prioridad: "alta" },
    { id: 2, tipo: "info", mensaje: "Nuevo documento subido por Ana García", fecha: "Hace 2 horas", prioridad: "media" },
    { id: 3, tipo: "success", mensaje: "Proyecto 'Portal Digital' completado", fecha: "Hace 4 horas", prioridad: "alta" },
    { id: 4, tipo: "danger", mensaje: "Tarea vencida sin completar", fecha: "Hace 6 horas", prioridad: "alta" },
  ];

  const careerStats = [
    { carrera: "Ingeniería de Software", alumnos: 45, proyectos: 12, progreso: 78 },
    { carrera: "Sistemas Computacionales", alumnos: 38, proyectos: 8, progreso: 65 },
    { carrera: "Redes y Telecomunicaciones", alumnos: 32, proyectos: 4, progreso: 82 },
    { carrera: "Desarrollo Web", alumnos: 30, proyectos: 6, progreso: 71 },
  ];

  const recentDocuments = [
    { id: 1, nombre: "Especificaciones_Sistema_v2.pdf", autor: "Ana García", fecha: "2025-07-14", tamaño: "2.8 MB", tipo: "pdf" },
    { id: 2, nombre: "Prototipo_App_Movil.fig", autor: "Carlos López", fecha: "2025-07-13", tamaño: "15.2 MB", tipo: "design" },
    { id: 3, nombre: "BD_Modelo_Relacional.sql", autor: "María Rodríguez", fecha: "2025-07-12", tamaño: "856 KB", tipo: "sql" },
  ];

  const getGreeting = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Buenos días";
    if (hora < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const getFileIcon = (tipo) => {
    switch (tipo) {
      case "pdf": return "bi-file-pdf text-danger";
      case "design": return "bi-palette text-primary";
      case "sql": return "bi-database text-success";
      default: return "bi-file-earmark text-muted";
    }
  };

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

  const getStatusBadge = (estado) => {
    switch (estado) {
      case "Finalizado": return "success";
      case "En progreso": return "primary";
      case "En desarrollo": return "info";
      case "Planificación": return "warning";
      default: return "secondary";
    }
  };

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

      <Container fluid className="dashboard-admin pb-5">
        <div className="admin-header mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="display-6 fw-bold mb-2 welcome-title">
                {greeting} {user?.nombre || "Administrador"}
                <span className="admin-badge ms-3">
                  <i className="bi bi-shield-check me-1"></i>
                  Admin
                </span>
              </h1>
              <p className="text-muted lead">Panel de control y gestión del sistema</p>
            </div>
            <div className="admin-filters">
              <Row className="g-2">
                <Col>
                  <Form.Select size="sm" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                    <option value="7">Últimos 7 días</option>
                    <option value="30">Últimos 30 días</option>
                    <option value="90">Últimos 3 meses</option>
                    <option value="365">Último año</option>
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Select size="sm" value={careerFilter} onChange={(e) => setCareerFilter(e.target.value)}>
                    <option value="all">Todas las carreras</option>
                    <option value="software">Ing. Software</option>
                    <option value="sistemas">Sistemas</option>
                    <option value="redes">Redes</option>
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Select size="sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">Todos los estados</option>
                    <option value="activo">Activos</option>
                    <option value="finalizado">Finalizados</option>
                    <option value="pendiente">Pendientes</option>
                  </Form.Select>
                </Col>
              </Row>
            </div>
          </div>
        </div>

        {/* Estadísticas Generales - SIEMPRE VISIBLES */}
        <Row className="g-4 mb-5">
          {[
            {
              key: "proyectos",
              label: "Proyectos Totales",
              icon: "bi-folder-check",
              value: generalStats.totalProyectos,
              subtitle: `${generalStats.proyectosActivos} activos`,
              color: "primary",
              bgGradient: "gradient-primary"
            },
            {
              key: "tareas",
              label: "Tareas Totales",
              icon: "bi-list-check",
              value: generalStats.totalTareas,
              subtitle: `${generalStats.tareasCompletadas} completadas`,
              color: "success",
              bgGradient: "gradient-success"
            },
            {
              key: "alumnos",
              label: "Alumnos Totales",
              icon: "bi-people",
              value: generalStats.totalAlumnos,
              subtitle: `${generalStats.alumnosActivos} activos`,
              color: "info",
              bgGradient: "gradient-info"
            },
            {
              key: "documentos",
              label: "Documentos",
              icon: "bi-file-earmark-text",
              value: generalStats.totalDocumentos,
              subtitle: `${generalStats.alertasRecientes} alertas`,
              color: "warning",
              bgGradient: "gradient-warning"
            },
          ].map((card, index) => (
            <Col md={6} lg={3} key={card.key}>
              <Card className={`admin-stat-card shadow-sm border-0 text-center ${card.bgGradient} fade-in`} 
                    style={{ animationDelay: `${index * 0.1}s` }}>
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

        {/* Navegación por pestañas */}
        <Nav variant="pills" className="admin-nav mb-4">
          <Nav.Item>
            <Nav.Link active={activeTab === "general"} onClick={() => setActiveTab("general")}>
              <i className="bi bi-graph-up me-2"></i>
              General
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link active={activeTab === "proyectos"} onClick={() => setActiveTab("proyectos")}>
              <i className="bi bi-folder me-2"></i>
              Proyectos
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link active={activeTab === "alumnos"} onClick={() => setActiveTab("alumnos")}>
              <i className="bi bi-people me-2"></i>
              Alumnos
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link active={activeTab === "documentos"} onClick={() => setActiveTab("documentos")}>
              <i className="bi bi-file-earmark me-2"></i>
              Documentos
            </Nav.Link>
          </Nav.Item>
    
        </Nav>

        {/* Contenido según la pestaña activa */}
        {activeTab === "general" && (
          <Row className="g-4">
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
                  <a href="/adminKanban" className="btn btn-primary btn-sm rounded-pill" style={{ width: "550px" }}>
                    <i className="bi bi-kanban me-2"></i>
                    Ir al tablero
                  </a>
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
        )}

        {activeTab === "proyectos" && (
          <Row>
            <Col>
              <Card className="shadow-sm modern-card">
                <Card.Header className="bg-white border-0 p-4">
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-folder-fill me-2 text-primary"></i>
                    Gestión de Proyectos
                  </h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table className="table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Proyecto</th>
                          <th>Participantes</th>
                          <th>Progreso</th>
                          <th>Estado</th>
                          <th>Prioridad</th>
                          <th>Fecha Fin</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projectsData.map((project) => (
                          <tr key={project.id}>
                            <td>
                              <div>
                                <h6 className="mb-0">{project.nombre}</h6>
                                <small className="text-muted">ID: {project.id}</small>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-light text-dark rounded-pill">
                                {project.participantes} alumnos
                              </span>
                            </td>
                            <td>
                              <div className="progress-container">
                                <ProgressBar now={project.progreso} className="custom-progress" />
                                <small className="text-muted">{project.progreso}%</small>
                              </div>
                            </td>
                            <td>
                              <Badge bg={getStatusBadge(project.estado)} className="rounded-pill">
                                {project.estado}
                              </Badge>
                            </td>
                            <td>
                              <Badge bg={getPriorityBadge(project.prioridad)} className="rounded-pill">
                                {project.prioridad}
                              </Badge>
                            </td>
                            <td>{project.fechaFin}</td>
                            <td>
                              <Button variant="outline-primary" size="sm" className="me-2">
                                <i className="bi bi-eye"></i>
                              </Button>
                              <Button variant="outline-secondary" size="sm">
                                <i className="bi bi-pencil"></i>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {activeTab === "alumnos" && (
          <Row>
            <Col lg={8}>
              <Card className="shadow-sm modern-card">
                <Card.Header className="bg-white border-0 p-4">
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-people-fill me-2 text-primary"></i>
                    Participación de Alumnos
                  </h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table className="table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Alumno</th>
                          <th>Carrera</th>
                          <th>Proyectos</th>
                          <th>Tareas</th>
                          <th>Estado</th>
                          <th>Última Actividad</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentsData.map((student) => (
                          <tr key={student.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar me-3">
                                  <i className="bi bi-person-circle fs-3 text-primary"></i>
                                </div>
                                <div>
                                  <h6 className="mb-0">{student.nombre}</h6>
                                  <small className="text-muted">ID: {student.id}</small>
                                </div>
                              </div>
                            </td>
                            <td>{student.carrera}</td>
                            <td>
                              <span className="badge bg-primary rounded-pill">
                                {student.proyectos}
                              </span>
                            </td>
                            <td>
                              <div className="task-summary">
                                <span className="badge bg-success rounded-pill me-1">
                                  {student.completadas}
                                </span>
                                <span className="text-muted">/ {student.tareas}</span>
                              </div>
                            </td>
                            <td>
                              <Badge bg={student.estado === "activo" ? "success" : "secondary"} className="rounded-pill">
                                {student.estado}
                              </Badge>
                            </td>
                            <td>
                              <small className="text-muted">{student.ultimaActividad}</small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="shadow-sm h-100 modern-card">
                <Card.Header className="bg-white border-0 p-4">
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-graph-up me-2 text-primary"></i>
                    Estadísticas por Carrera
                  </h5>
                </Card.Header>
                <Card.Body className="p-4">
                  {careerStats.map((career, index) => (
                    <div key={index} className="career-stat mb-4">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">{career.carrera}</h6>
                        <Badge bg="light" text="dark">{career.alumnos} alumnos</Badge>
                      </div>
                      <div className="progress-container">
                        <ProgressBar now={career.progreso} className="custom-progress" variant="info" />
                        <small className="text-muted">{career.progreso}% progreso promedio</small>
                      </div>
                      <small className="text-muted">{career.proyectos} proyectos activos</small>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {activeTab === "documentos" && (
          <Row>
            <Col>
              <Card className="shadow-sm modern-card">
                <Card.Header className="bg-white border-0 p-4">
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-file-earmark-text-fill me-2 text-primary"></i>
                    Documentos Recientes
                  </h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <ListGroup variant="flush">
                    {recentDocuments.map((doc) => (
                      <ListGroup.Item key={doc.id} className="document-item p-4 border-0">
                        <div className="d-flex align-items-center">
                          <i className={`bi ${getFileIcon(doc.tipo)} fs-2 me-3`}></i>
                          <div className="flex-grow-1">
                            <h6 className="mb-1">{doc.nombre}</h6>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <small className="text-muted me-3">Por: {doc.autor}</small>
                                <small className="text-muted me-3">{doc.fecha}</small>
                                <small className="text-muted">{doc.tamaño}</small>
                              </div>
                              <div>
                                <Button variant="outline-primary" size="sm" className="me-2">
                                  <i className="bi bi-download"></i>
                                </Button>
                                <Button variant="outline-secondary" size="sm">
                                  <i className="bi bi-eye"></i>
                                </Button>
                              </div>
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
        )}
      </Container>
    </>
  );
};

export default DashboardAdmin;