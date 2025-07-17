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

        {/* Navegación por pestañas */}
        <Nav variant="pills" className="admin-nav mb-4">
          <Nav.Item>
            <Nav.Link active={activeTab === "proyectos"} onClick={() => setActiveTab("proyectos")}>
              <i className="bi bi-folder me-2"></i>
              Proyectos
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link active={activeTab === "alumnos"} onClick={() => setActiveTab("alumnos")}>
              <i className="bi bi-person-lines-fill me-2"></i>
              Alumnos
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link active={activeTab === "admins"} onClick={() => setActiveTab("admins")}>
              <i className="bi bi-person-gear me-2"></i>
              Administradores
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {activeTab === "proyectos" && (
          <Card className="shadow-sm modern-card">
            <Card.Header className="bg-white border-0 p-4 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-folder-check me-2 text-primary"></i>
                Gestión de Proyectos
              </h5>
              <Button variant="primary" onClick={() => setShowProyectoModal(true)}>
                <i className="bi bi-plus-circle me-2"></i>
                Agregar Proyecto
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Participantes</th>
                      <th>Estado</th>
                      <th>Prioridad</th>
                      <th>Inicio</th>
                      <th>Fin</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proyectos.map((p) => (
                      <tr key={p.id}>
                        <td>{p.nombre}</td>
                        <td>{p.tipo}</td>
                        <td>{p.participantes}</td>
                        <td>
                          <Badge bg={p.estado === "Finalizado" ? "success" : "primary"}>{p.estado}</Badge>
                        </td>
                        <td>
                          <Badge bg={p.prioridad === "Alta" ? "danger" : p.prioridad === "Media" ? "warning" : "secondary"}>
                            {p.prioridad}
                          </Badge>
                        </td>
                        <td>{p.inicio}</td>
                        <td>{p.fin}</td>
                        <td>
                          <div className="action-buttons space-between">
                            <Button variant="warning" size="sm" onClick={() => handleEditProyecto(p)}>
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteProyecto(p.id)}>
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        )}

        <Modal show={showProyectoModal} onHide={() => setShowProyectoModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{newProyecto.id ? "Editar Proyecto" : "Agregar Nuevo Proyecto"}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
            <Form onSubmit={handleAddOrEditProyecto}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={newProyecto.nombre}
                  onChange={(e) => setNewProyecto({ ...newProyecto, nombre: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Tipo</Form.Label>
                <Form.Select
                  value={newProyecto.tipo}
                  onChange={(e) => setNewProyecto({ ...newProyecto, tipo: e.target.value })}
                >
                  <option>Proyecto Estratégico</option>
                  <option>Proyecto Operativo</option>
                  <option>Proyecto de Cumplimiento</option>
                  <option>Proyecto de Innovacion</option>
                  <option>Proyecto de Mantenimiento</option>
                  <option>Proyecto de Cliente</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Participantes</Form.Label>
                <Form.Control
                  type="number"
                  value={newProyecto.participantes}
                  onChange={(e) => setNewProyecto({ ...newProyecto, participantes: e.target.value })}
                  min="1"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={newProyecto.estado}
                  onChange={(e) => setNewProyecto({ ...newProyecto, estado: e.target.value })}
                >
                  <option>En progreso</option>
                  <option>Finalizado</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Prioridad</Form.Label>
                <Form.Select
                  value={newProyecto.prioridad}
                  onChange={(e) => setNewProyecto({ ...newProyecto, prioridad: e.target.value })}
                >
                  <option>Alta</option>
                  <option>Media</option>
                  <option>Baja</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de Inicio</Form.Label>
                <Form.Control
                  type="date"
                  value={newProyecto.inicio}
                  onChange={(e) => setNewProyecto({ ...newProyecto, inicio: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de Fin</Form.Label>
                <Form.Control
                  type="date"
                  value={newProyecto.fin}
                  onChange={(e) => setNewProyecto({ ...newProyecto, fin: e.target.value })}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                {newProyecto.id ? "Actualizar Proyecto" : "Guardar Proyecto"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {activeTab === "alumnos" && (
          <Card className="shadow-sm modern-card">
            <Card.Header className="bg-white border-0 p-4 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-people-fill me-2 text-primary"></i>
                Alumnos del Sistema
              </h5>
              <Button variant="primary" onClick={() => setShowAlumnoModal(true)}>
                <i className="bi bi-plus-circle me-2"></i>
                Agregar Alumno
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Carrera</th>
                      <th>Proyectos Asignados</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alumnos.map((a) => (
                      <tr key={a.id}>
                        <td>{a.nombre}</td>
                        <td>{a.carrera}</td>
                        <td>{a.proyectos}</td>
                        <td>
                          <Badge bg={a.estado === "Activo" ? "success" : "secondary"}>{a.estado}</Badge>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Button variant="warning" size="sm" onClick={() => handleEditAlumno(a)}>
                              <i className="bi bi-pencil"></i> Editar
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteAlumno(a.id)}>
                              <i className="bi bi-trash"></i> Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        )}

        <Modal show={showAlumnoModal} onHide={() => setShowAlumnoModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{newAlumno.id ? "Editar Alumno" : "Agregar Nuevo Alumno"}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
            <Form onSubmit={handleAddOrEditAlumno}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={newAlumno.nombre}
                  onChange={(e) => setNewAlumno({ ...newAlumno, nombre: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Carrera</Form.Label>
                <Form.Control
                  type="text"
                  value={newAlumno.carrera}
                  onChange={(e) => setNewAlumno({ ...newAlumno, carrera: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Proyectos Asignados</Form.Label>
                <Form.Control
                  type="number"
                  value={newAlumno.proyectos}
                  onChange={(e) => setNewAlumno({ ...newAlumno, proyectos: e.target.value })}
                  min="0"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={newAlumno.estado}
                  onChange={(e) => setNewAlumno({ ...newAlumno, estado: e.target.value })}
                >
                  <option>Activo</option>
                  <option>Inactivo</option>
                </Form.Select>
              </Form.Group>
              <Button variant="primary" type="submit">
                {newAlumno.id ? "Actualizar Alumno" : "Guardar Alumno"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>

        {activeTab === "admins" && (
          <Card className="shadow-sm modern-card">
            <Card.Header className="bg-white border-0 p-4 d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-person-gear me-2 text-primary"></i>
                Administradores del Sistema
              </h5>
              <Button variant="primary" onClick={() => setShowAdminModal(true)}>
                <i className="bi bi-plus-circle me-2"></i>
                Agregar Administrador
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Nombre</th>
                      <th>Proyectos Asignados</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {administradores.map((adm) => (
                      <tr key={adm.id}>
                        <td>{adm.nombre}</td>
                        <td>{adm.proyectos}</td>
                        <td>
                          <Badge bg={adm.estado === "Activo" ? "success" : "secondary"}>{adm.estado}</Badge>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Button variant="warning" size="sm" onClick={() => handleEditAdmin(adm)}>
                              <i className="bi bi-pencil"></i> Editar
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => handleDeleteAdmin(adm.id)}>
                              <i className="bi bi-trash"></i> Eliminar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        )}

        <Modal show={showAdminModal} onHide={() => setShowAdminModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{newAdmin.id ? "Editar Administrador" : "Agregar Nuevo Administrador"}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
            <Form onSubmit={handleAddOrEditAdmin}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={newAdmin.nombre}
                  onChange={(e) => setNewAdmin({ ...newAdmin, nombre: e.target.value })}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Proyectos Asignados</Form.Label>
                <Form.Control
                  type="number"
                  value={newAdmin.proyectos}
                  onChange={(e) => setNewAdmin({ ...newAdmin, proyectos: e.target.value })}
                  min="0"
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={newAdmin.estado}
                  onChange={(e) => setNewAdmin({ ...newAdmin, estado: e.target.value })}
                >
                  <option>Activo</option>
                  <option>Inactivo</option>
                </Form.Select>
              </Form.Group>
              <Button variant="primary" type="submit">
                {newAdmin.id ? "Actualizar Administrador" : "Guardar Administrador"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </Layout>
  );
};

export default DashboardSuperadmin;