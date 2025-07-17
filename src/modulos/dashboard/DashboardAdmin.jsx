import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Modal,
  Collapse,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./DashboardAdmin.css";

const DashboardAdmin = ({ user }) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [greeting, setGreeting] = useState("");
  const [activeTab, setActiveTab] = useState("general");
  const [dateFilter, setDateFilter] = useState("7");
  const [careerFilter, setCareerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Estados para proyectos
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editProjectData, setEditProjectData] = useState({});
  const [newProject, setNewProject] = useState({
    nombre: "",
    participantes: "",
    estado: "Planificación",
    prioridad: "media",
    fechaInicio: "",
    fechaFin: "",
    descripcion: ""
  });

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
    totalGestionProyectos: 12,

  };

  const [projectsData, setProjectsData] = useState([
    { 
      id: 1, 
      nombre: "Sistema de Gestión Escolar", 
      participantes: 8, 
      progreso: 85, 
      estado: "En progreso", 
      prioridad: "alta", 
      fechaInicio: "2025-06-15", 
      fechaFin: "2025-08-30",
      descripcion: "Sistema integral para la gestión de estudiantes, profesores, calificaciones y recursos académicos. Incluye módulos de inscripción, seguimiento académico y reportes administrativos."
    },
    { 
      id: 2, 
      nombre: "App Móvil de Biblioteca", 
      participantes: 5, 
      progreso: 60, 
      estado: "En desarrollo", 
      prioridad: "media", 
      fechaInicio: "2025-07-01", 
      fechaFin: "2025-09-15",
      descripcion: "Aplicación móvil para consultar el catálogo de la biblioteca, reservar libros, renovar préstamos y recibir notificaciones sobre fechas de devolución."
    },
    { 
      id: 3, 
      nombre: "Portal de Recursos Digitales", 
      participantes: 12, 
      progreso: 100, 
      estado: "Finalizado", 
      prioridad: "alta", 
      fechaInicio: "2025-05-01", 
      fechaFin: "2025-07-10",
      descripcion: "Plataforma web centralizada para acceso a recursos digitales educativos, incluyendo libros electrónicos, videos educativos, simuladores y material de apoyo."
    },
    { 
      id: 4, 
      nombre: "Sistema de Evaluación Online", 
      participantes: 6, 
      progreso: 35, 
      estado: "Planificación", 
      prioridad: "baja", 
      fechaInicio: "2025-07-10", 
      fechaFin: "2025-10-30",
      descripcion: "Sistema para crear, administrar y calificar exámenes en línea. Incluye banco de preguntas, generación automática de exámenes y análisis estadístico de resultados."
    },
  ]);

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

  const handleCardClick = (path) => {
    if (path) {
      navigate(path);
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

  // Funciones para manejar proyectos
  const handleNewProjectChange = (field, value) => {
    setNewProject(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitProject = (e) => {
    e.preventDefault();
    const newId = Math.max(...projectsData.map(p => p.id)) + 1;
    const projectToAdd = {
      ...newProject,
      id: newId,
      participantes: parseInt(newProject.participantes) || 0,
      progreso: 0
    };
    
    setProjectsData(prev => [...prev, projectToAdd]);
    setNewProject({
      nombre: "",
      participantes: "",
      estado: "Planificación",
      prioridad: "media",
      fechaInicio: "",
      fechaFin: "",
      descripcion: ""
    });
    setShowProjectForm(false);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
      setProjectsData(prev => prev.filter(p => p.id !== projectId));
    }
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setEditProjectData(project);
    setIsEditingProject(false);
    setShowProjectDetails(true);
  };

  const toggleExpandProject = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const handleEditProject = () => {
    setIsEditingProject(true);
  };

  const handleCancelEdit = () => {
    setIsEditingProject(false);
    setEditProjectData(selectedProject);
  };

  const handleSaveEdit = () => {
    // Aquí actualizarías el proyecto en el estado
    setProjectsData(prev => prev.map(p => 
      p.id === selectedProject.id ? { ...editProjectData } : p
    ));
    
    // Actualizar el proyecto seleccionado
    setSelectedProject(editProjectData);
    setIsEditingProject(false);
    
    // Mostrar confirmación
    alert(`Proyecto "${editProjectData.nombre}" editado exitosamente!`);
  };

  const handleEditProjectChange = (field, value) => {
    setEditProjectData(prev => ({
      ...prev,
      [field]: value
    }));
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
            {
              key: "gestionProyectos",
              label: "Gestion de Proyectos",
              icon: "bi-briefcase-fill",
              value: generalStats.totalGestionProyectos,
              subtitle: "Total de proyectos",
              bgGradient: "gradient-purple",
              to: "/gestionProyectos",
            },
          ].map((card, index) => (
            <Col md={6} lg={3} key={card.key}>
              <Card 
                className={`admin-stat-card shadow-sm border-0 text-center ${card.bgGradient} fade-in`} 
                style={{ animationDelay: `${index * 0.1}s`, cursor: card.to ? 'pointer' : 'default' }}
                onClick={() => handleCardClick(card.to)}>
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
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">
                      <i className="bi bi-folder-fill me-2 text-primary"></i>
                      Gestión de Proyectos
                    </h5>
                    <Button 
                      variant="primary" 
                      className="btn-add-project"
                      onClick={() => setShowProjectForm(!showProjectForm)}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      {showProjectForm ? "Cancelar" : "Nuevo Proyecto"}
                    </Button>
                  </div>
                </Card.Header>
                
                {/* Formulario de nuevo proyecto */}
                <Collapse in={showProjectForm}>
                  <div>
                    <Card.Body className="border-bottom bg-light">
                      <Form onSubmit={handleSubmitProject} className="project-form">
                        <Row className="g-3">
                          <Col md={6}>
                            <Form.Group>
                              <Form.Label className="fw-semibold">Nombre del Proyecto *</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Ingresa el nombre del proyecto"
                                value={newProject.nombre}
                                onChange={(e) => handleNewProjectChange("nombre", e.target.value)}
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group>
                              <Form.Label className="fw-semibold">Participantes *</Form.Label>
                              <Form.Control
                                type="number"
                                placeholder="Número"
                                min="1"
                                value={newProject.participantes}
                                onChange={(e) => handleNewProjectChange("participantes", e.target.value)}
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group>
                              <Form.Label className="fw-semibold">Estado</Form.Label>
                              <Form.Select
                                value={newProject.estado}
                                onChange={(e) => handleNewProjectChange("estado", e.target.value)}
                              >
                                <option value="Planificación">Planificación</option>
                                <option value="En desarrollo">En desarrollo</option>
                                <option value="En progreso">En progreso</option>
                                <option value="Finalizado">Finalizado</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label className="fw-semibold">Prioridad</Form.Label>
                              <Form.Select
                                value={newProject.prioridad}
                                onChange={(e) => handleNewProjectChange("prioridad", e.target.value)}
                              >
                                <option value="baja">Baja</option>
                                <option value="media">Media</option>
                                <option value="alta">Alta</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label className="fw-semibold">Fecha de Inicio *</Form.Label>
                              <Form.Control
                                type="date"
                                value={newProject.fechaInicio}
                                onChange={(e) => handleNewProjectChange("fechaInicio", e.target.value)}
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group>
                              <Form.Label className="fw-semibold">Fecha de Fin *</Form.Label>
                              <Form.Control
                                type="date"
                                value={newProject.fechaFin}
                                onChange={(e) => handleNewProjectChange("fechaFin", e.target.value)}
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label className="fw-semibold">Descripción</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Describe brevemente el proyecto..."
                                value={newProject.descripcion}
                                onChange={(e) => handleNewProjectChange("descripcion", e.target.value)}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={12}>
                            <div className="d-flex gap-2 justify-content-end">
                              <Button 
                                variant="outline-secondary" 
                                onClick={() => setShowProjectForm(false)}
                              >
                                Cancelar
                              </Button>
                              <Button variant="primary" type="submit">
                                <i className="bi bi-save me-2"></i>
                                Crear Proyecto
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Form>
                    </Card.Body>
                  </div>
                </Collapse>

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
                          <React.Fragment key={project.id}>
                            <tr>
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
                                <div className="action-buttons">
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>Ver detalles</Tooltip>}
                                  >
                                    <Button 
                                      variant="outline-info" 
                                      size="sm" 
                                      className="me-1"
                                      onClick={() => toggleExpandProject(project.id)}
                                    >
                                      <i className={`bi ${expandedProject === project.id ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                    </Button>
                                  </OverlayTrigger>
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>Ver en modal</Tooltip>}
                                  >
                                    <Button 
                                      variant="outline-primary" 
                                      size="sm" 
                                      className="me-1"
                                      onClick={() => handleViewDetails(project)}
                                    >
                                      <i className="bi bi-window"></i>
                                    </Button>
                                  </OverlayTrigger>
                                  <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip>Eliminar proyecto</Tooltip>}
                                  >
                                    <Button 
                                      variant="outline-danger" 
                                      size="sm"
                                      onClick={() => handleDeleteProject(project.id)}
                                    >
                                      <i className="bi bi-trash"></i>
                                    </Button>
                                  </OverlayTrigger>
                                </div>
                              </td>
                            </tr>
                            {/* Fila expandible con detalles */}
                            <Collapse in={expandedProject === project.id}>
                              <tr>
                                <td colSpan="7" className="project-details-row">
                                  <div className="project-details-content">
                                    <Row>
                                      <Col md={8}>
                                        <h6 className="text-primary mb-2">
                                          <i className="bi bi-info-circle me-2"></i>
                                          Descripción del Proyecto
                                        </h6>
                                        <p className="text-muted mb-3">{project.descripcion}</p>
                                      </Col>
                                      <Col md={4}>
                                        <h6 className="text-primary mb-2">
                                          <i className="bi bi-calendar me-2"></i>
                                          Información Adicional
                                        </h6>
                                        <div className="detail-item">
                                          <strong>Fecha de Inicio:</strong> {project.fechaInicio}
                                        </div>
                                        <div className="detail-item">
                                          <strong>Duración estimada:</strong> {
                                            Math.ceil((new Date(project.fechaFin) - new Date(project.fechaInicio)) / (1000 * 60 * 60 * 24))
                                          } días
                                        </div>
                                        <div className="detail-item">
                                          <strong>Progreso:</strong> {project.progreso}% completado
                                        </div>
                                      </Col>
                                    </Row>
                                  </div>
                                </td>
                              </tr>
                            </Collapse>
                          </React.Fragment>
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

        {/* Modal para ver detalles del proyecto */}
        <Modal 
          show={showProjectDetails} 
          onHide={() => setShowProjectDetails(false)}
          size="lg"
          centered
          scrollable
        >
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>
              <i className={`bi ${isEditingProject ? 'bi-pencil-square' : 'bi-folder-open'} me-2`}></i>
              {isEditingProject ? 'Editar Proyecto' : 'Detalles del Proyecto'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            {selectedProject && (
              <div>
                <Row className="mb-4">
                  <Col>
                    {isEditingProject ? (
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">Nombre del Proyecto</Form.Label>
                        <Form.Control
                          type="text"
                          value={editProjectData.nombre || ''}
                          onChange={(e) => handleEditProjectChange('nombre', e.target.value)}
                          className="fs-4"
                        />
                      </Form.Group>
                    ) : (
                      <h4 className="text-primary mb-3">{selectedProject.nombre}</h4>
                    )}
                    
                    {isEditingProject ? (
                      <Form.Group>
                        <Form.Label className="fw-semibold">Descripción</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={editProjectData.descripcion || ''}
                          onChange={(e) => handleEditProjectChange('descripcion', e.target.value)}
                        />
                      </Form.Group>
                    ) : (
                      <p className="lead text-muted">{selectedProject.descripcion}</p>
                    )}
                  </Col>
                </Row>
                
                <Row className="g-4">
                  <Col md={6}>
                    <div className="info-card">
                      <h6 className="text-secondary mb-2">
                        <i className="bi bi-people me-2"></i>
                        Información General
                      </h6>
                      
                      {isEditingProject ? (
                        <>
                          <Form.Group className="mb-3">
                            <Form.Label>Participantes</Form.Label>
                            <Form.Control
                              type="number"
                              min="1"
                              value={editProjectData.participantes || ''}
                              onChange={(e) => handleEditProjectChange('participantes', parseInt(e.target.value))}
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Estado</Form.Label>
                            <Form.Select
                              value={editProjectData.estado || ''}
                              onChange={(e) => handleEditProjectChange('estado', e.target.value)}
                            >
                              <option value="Planificación">Planificación</option>
                              <option value="En desarrollo">En desarrollo</option>
                              <option value="En progreso">En progreso</option>
                              <option value="Finalizado">Finalizado</option>
                            </Form.Select>
                          </Form.Group>
                          
                          <Form.Group>
                            <Form.Label>Prioridad</Form.Label>
                            <Form.Select
                              value={editProjectData.prioridad || ''}
                              onChange={(e) => handleEditProjectChange('prioridad', e.target.value)}
                            >
                              <option value="baja">Baja</option>
                              <option value="media">Media</option>
                              <option value="alta">Alta</option>
                            </Form.Select>
                          </Form.Group>
                        </>
                      ) : (
                        <>
                          <div className="info-item">
                            <strong>Participantes:</strong> {selectedProject.participantes} alumnos
                          </div>
                          <div className="info-item">
                            <strong>Estado:</strong> 
                            <Badge bg={getStatusBadge(selectedProject.estado)} className="ms-2 rounded-pill">
                              {selectedProject.estado}
                            </Badge>
                          </div>
                          <div className="info-item">
                            <strong>Prioridad:</strong> 
                            <Badge bg={getPriorityBadge(selectedProject.prioridad)} className="ms-2 rounded-pill">
                              {selectedProject.prioridad}
                            </Badge>
                          </div>
                        </>
                      )}
                    </div>
                  </Col>
                  
                  <Col md={6}>
                    <div className="info-card">
                      <h6 className="text-secondary mb-2">
                        <i className="bi bi-calendar me-2"></i>
                        Cronograma
                      </h6>
                      
                      {isEditingProject ? (
                        <>
                          <Form.Group className="mb-3">
                            <Form.Label>Fecha de Inicio</Form.Label>
                            <Form.Control
                              type="date"
                              value={editProjectData.fechaInicio || ''}
                              onChange={(e) => handleEditProjectChange('fechaInicio', e.target.value)}
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Fecha de Fin</Form.Label>
                            <Form.Control
                              type="date"
                              value={editProjectData.fechaFin || ''}
                              onChange={(e) => handleEditProjectChange('fechaFin', e.target.value)}
                            />
                          </Form.Group>
                          
                          <Form.Group>
                            <Form.Label>Progreso (%)</Form.Label>
                            <Form.Control
                              type="number"
                              min="0"
                              max="100"
                              step="5"
                              value={editProjectData.progreso === 0 ? '' : editProjectData.progreso || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value === '') {
                                  handleEditProjectChange('progreso', 0);
                                } else {
                                  const numValue = parseInt(value);
                                  if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                                    handleEditProjectChange('progreso', numValue);
                                  }
                                }
                              }}
                              placeholder="0"
                            />
                            <Form.Text className="text-muted">
                              Escribe el porcentaje deseado (0-100)
                            </Form.Text>
                          </Form.Group>
                        </>
                      ) : (
                        <>
                          <div className="info-item">
                            <strong>Fecha de Inicio:</strong> {selectedProject.fechaInicio}
                          </div>
                          <div className="info-item">
                            <strong>Fecha de Fin:</strong> {selectedProject.fechaFin}
                          </div>
                          <div className="info-item">
                            <strong>Duración:</strong> {
                              Math.ceil((new Date(selectedProject.fechaFin) - new Date(selectedProject.fechaInicio)) / (1000 * 60 * 60 * 24))
                            } días
                          </div>
                        </>
                      )}
                    </div>
                  </Col>
                </Row>
                
                {!isEditingProject && (
                  <Row className="mt-4">
                    <Col>
                      <div className="info-card">
                        <h6 className="text-secondary mb-3">
                          <i className="bi bi-graph-up me-2"></i>
                          Progreso del Proyecto
                        </h6>
                        <div className="progress-container-modal">
                          <ProgressBar 
                            now={selectedProject.progreso} 
                            className="custom-progress mb-2" 
                            style={{ height: '12px' }}
                          />
                          <div className="d-flex justify-content-between">
                            <span className="text-muted">Progreso actual</span>
                            <span className="fw-bold text-primary">{selectedProject.progreso}%</span>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {isEditingProject ? (
              <>
                <Button variant="outline-secondary" onClick={handleCancelEdit}>
                  <i className="bi bi-x-circle me-2"></i>
                  Cancelar
                </Button>
                <Button variant="success" onClick={handleSaveEdit}>
                  <i className="bi bi-check-circle me-2"></i>
                  Guardar Cambios
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline-secondary" onClick={() => setShowProjectDetails(false)}>
                  Cerrar
                </Button>
                <Button variant="primary" onClick={handleEditProject}>
                  <i className="bi bi-pencil me-2"></i>
                  Editar Proyecto
                </Button>
              </>
            )}
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default DashboardAdmin;