import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Table,
  Badge,
  ProgressBar,
  InputGroup,
  Alert,
  Tabs,
  Tab,
  ListGroup,
  OverlayTrigger,
  Tooltip,
  Spinner
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./GestionProyectos.css";

const GestionProyectos = ({ user }) => {
  const [theme, setTheme] = useState("light");
  const [activeView, setActiveView] = useState("grid");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("nombre");
  const [sortOrder, setSortOrder] = useState("asc");
  
  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Estados para proyectos
  const [proyectos, setProyectos] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Estados para formularios
  const [newProject, setNewProject] = useState({
    nombre: "",
    descripcion: "",
    programa: "",
    responsable: "",
    equipo: [],
    alumnos: [],
    fechaInicio: "",
    fechaFin: "",
    presupuesto: "",
    estado: "planificacion",
    prioridad: "media",
    progreso: 0,
    objetivos: [],
    hitos: [],
    riesgos: [],
    documentos: []
  });
  
  const [editProject, setEditProject] = useState({});
  
  // Datos estáticos
  const programasDisponibles = [
    "Ingeniería de Software",
    "Sistemas Computacionales", 
    "Redes y Telecomunicaciones",
    "Desarrollo Web",
    "Ciencia de Datos",
    "Ciberseguridad"
  ];
  
  const responsablesDisponibles = [
    "Dr. Juan Pérez",
    "Ing. María García", 
    "Dr. Carlos López",
    "Mtra. Ana Rodríguez",
    "Ing. Pedro Martínez",
    "Dra. Laura Sánchez"
  ];

  // Lista estática de alumnos disponibles
  const alumnosDisponibles = [
    { id: 1, nombre: "Juan Pérez", matricula: "A12345", carrera: "Ingeniería de Software" },
    { id: 2, nombre: "María García", matricula: "A67890", carrera: "Sistemas Computacionales" },
    { id: 3, nombre: "Carlos López", matricula: "B12345", carrera: "Redes y Telecomunicaciones" },
    { id: 4, nombre: "Ana Rodríguez", matricula: "B67890", carrera: "Desarrollo Web" },
    { id: 5, nombre: "Pedro Martínez", matricula: "C12345", carrera: "Ciencia de Datos" }
  ];
  
  const estadosProyecto = [
    { value: "planificacion", label: "Planificación", color: "warning" },
    { value: "iniciado", label: "Iniciado", color: "info" },
    { value: "en_progreso", label: "En Progreso", color: "primary" },
    { value: "revision", label: "En Revisión", color: "secondary" },
    { value: "finalizado", label: "Finalizado", color: "success" },
    { value: "cancelado", label: "Cancelado", color: "danger" },
    { value: "pausado", label: "Pausado", color: "dark" }
  ];
  
  const prioridadesProyecto = [
    { value: "baja", label: "Baja", color: "secondary" },
    { value: "media", label: "Media", color: "warning" },
    { value: "alta", label: "Alta", color: "danger" },
    { value: "critica", label: "Crítica", color: "danger" }
  ];

  // Inicializar proyectos de ejemplo
  useEffect(() => {
    const proyectosIniciales = [
      {
        id: 1,
        nombre: "Sistema de Gestión Académica",
        descripcion: "Desarrollo de un sistema integral para la gestión de estudiantes, calificaciones y programas académicos.",
        programa: "Ingeniería de Software",
        responsable: "Dr. Juan Pérez",
        equipo: ["Ana García", "Carlos López", "María Rodríguez"],
        alumnos: [1, 3],
        fechaInicio: "2024-01-15",
        fechaFin: "2024-12-15",
        presupuesto: "150000",
        estado: "en_progreso",
        prioridad: "alta",
        progreso: 65,
        objetivos: [
          "Implementar módulo de inscripciones",
          "Desarrollar sistema de calificaciones",
          "Crear dashboard administrativo"
        ],
        hitos: [
          { nombre: "Análisis de requerimientos", fecha: "2024-02-15", completado: true },
          { nombre: "Diseño de arquitectura", fecha: "2024-03-30", completado: true },
          { nombre: "Desarrollo frontend", fecha: "2024-06-30", completado: false },
          { nombre: "Pruebas y deployment", fecha: "2024-11-30", completado: false }
        ],
        riesgos: [
          { descripcion: "Retraso en entrega de requerimientos", impacto: "medio", probabilidad: "baja" },
          { descripcion: "Cambios en tecnología", impacto: "alto", probabilidad: "media" }
        ],
        documentos: [
          { nombre: "Especificaciones.pdf", tipo: "pdf", fecha: "2024-01-20" },
          { nombre: "Mockups.fig", tipo: "design", fecha: "2024-02-10" }
        ]
      },
      {
        id: 2,
        nombre: "Plataforma de E-Learning",
        descripcion: "Creación de una plataforma educativa online con capacidades de videoconferencia y evaluación automática.",
        programa: "Desarrollo Web",
        responsable: "Ing. María García",
        equipo: ["Pedro Martínez", "Laura Sánchez"],
        alumnos: [2, 4],
        fechaInicio: "2024-03-01",
        fechaFin: "2024-10-30",
        presupuesto: "200000",
        estado: "planificacion",
        prioridad: "media",
        progreso: 25,
        objetivos: [
          "Desarrollar sistema de videoconferencias",
          "Implementar evaluaciones automáticas",
          "Crear biblioteca de recursos"
        ],
        hitos: [
          { nombre: "Investigación de mercado", fecha: "2024-03-15", completado: true },
          { nombre: "Prototipo inicial", fecha: "2024-05-30", completado: false }
        ],
        riesgos: [
          { descripcion: "Competencia en el mercado", impacto: "alto", probabilidad: "alta" }
        ],
        documentos: [
          { nombre: "Plan_Proyecto.docx", tipo: "doc", fecha: "2024-03-05" }
        ]
      }
    ];
    setProyectos(proyectosIniciales);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  // Funciones de filtrado y búsqueda
  const filteredProjects = proyectos.filter(proyecto => {
    const matchesSearch = proyecto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proyecto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proyecto.programa.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || proyecto.estado === filterStatus;
    const matchesPriority = filterPriority === "all" || proyecto.prioridad === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  }).sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Función para obtener información de alumno por ID
  const getAlumnoById = (id) => {
    return alumnosDisponibles.find(alumno => alumno.id === id);
  };

  // Función para manejar selección de alumnos
  const handleAlumnoSelection = (alumnoId, isChecked, isEditMode = false) => {
    if (isEditMode) {
      setEditProject(prev => {
        const newAlumnos = isChecked 
          ? [...(prev.alumnos || []), alumnoId]
          : (prev.alumnos || []).filter(id => id !== alumnoId);
        return { ...prev, alumnos: newAlumnos };
      });
    } else {
      setNewProject(prev => {
        const newAlumnos = isChecked 
          ? [...prev.alumnos, alumnoId]
          : prev.alumnos.filter(id => id !== alumnoId);
        return { ...prev, alumnos: newAlumnos };
      });
    }
  };

  // Función para verificar si un alumno está asignado
  const isAlumnoAsignado = (alumnoId, proyecto) => {
    return proyecto.alumnos && proyecto.alumnos.includes(alumnoId);
  };

  // Funciones para manejar proyectos
  const handleCreateProject = () => {
    setLoading(true);
    setTimeout(() => {
      const newId = Math.max(...proyectos.map(p => p.id)) + 1;
      const projectToAdd = {
        ...newProject,
        id: newId,
        equipo: newProject.equipo.filter(member => member.trim() !== ""),
        alumnos: newProject.alumnos,
        objetivos: newProject.objetivos.filter(obj => obj.trim() !== ""),
        presupuesto: parseFloat(newProject.presupuesto) || 0,
        hitos: [],
        riesgos: [],
        documentos: []
      };
      
      setProyectos(prev => [...prev, projectToAdd]);
      setNewProject({
        nombre: "",
        descripcion: "",
        programa: "",
        responsable: "",
        equipo: [],
        alumnos: [],
        fechaInicio: "",
        fechaFin: "",
        presupuesto: "",
        estado: "planificacion",
        prioridad: "media",
        progreso: 0,
        objetivos: [],
        hitos: [],
        riesgos: [],
        documentos: []
      });
      setShowCreateModal(false);
      setLoading(false);
    }, 1000);
  };

  const handleEditProject = () => {
    setLoading(true);
    setTimeout(() => {
      setProyectos(prev => prev.map(p => 
        p.id === selectedProject.id ? { ...editProject } : p
      ));
      setShowEditModal(false);
      setSelectedProject(editProject);
      setLoading(false);
    }, 800);
  };

  const handleDeleteProject = () => {
    setLoading(true);
    setTimeout(() => {
      setProyectos(prev => prev.filter(p => p.id !== selectedProject.id));
      setShowDeleteModal(false);
      setSelectedProject(null);
      setLoading(false);
    }, 500);
  };

  const openEditModal = (proyecto) => {
    setSelectedProject(proyecto);
    setEditProject({ ...proyecto });
    setShowEditModal(true);
  };

  const openDetailModal = (proyecto) => {
    setSelectedProject(proyecto);
    setShowDetailModal(true);
  };

  const openDeleteModal = (proyecto) => {
    setSelectedProject(proyecto);
    setShowDeleteModal(true);
  };

  const getBadgeColor = (type, value) => {
    if (type === "estado") {
      return estadosProyecto.find(e => e.value === value)?.color || "secondary";
    } else if (type === "prioridad") {
      return prioridadesProyecto.find(p => p.value === value)?.color || "secondary";
    }
    return "secondary";
  };

  const getStatusLabel = (estado) => {
    return estadosProyecto.find(e => e.value === estado)?.label || estado;
  };

  const getPriorityLabel = (prioridad) => {
    return prioridadesProyecto.find(p => p.value === prioridad)?.label || prioridad;
  };

  const calculateDaysRemaining = (fechaFin) => {
    const today = new Date();
    const endDate = new Date(fechaFin);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressColor = (progreso) => {
    if (progreso < 30) return "danger";
    if (progreso < 70) return "warning";
    return "success";
  };

  const navigate = useNavigate();

  // Renderizar vista de tarjetas
const renderGridView = () => (
    <Row className="g-4">
      {filteredProjects.map(proyecto => (
        <Col key={proyecto.id} lg={4} md={6}>
          <Card className="project-card h-100 shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Badge bg={getBadgeColor("estado", proyecto.estado)} className="rounded-pill">
                {getStatusLabel(proyecto.estado)}
              </Badge>
              <Badge bg={getBadgeColor("prioridad", proyecto.prioridad)} className="rounded-pill">
                {getPriorityLabel(proyecto.prioridad)}
              </Badge>
            </Card.Header>
            <Card.Body>
              <Card.Title className="h5 mb-3">{proyecto.nombre}</Card.Title>
              <Card.Text className="text-muted mb-3" style={{ fontSize: "0.9rem", lineHeight: "1.4" }}>
                {proyecto.descripcion.length > 100 
                  ? `${proyecto.descripcion.substring(0, 100)}...` 
                  : proyecto.descripcion}
              </Card.Text>
              
              <div className="project-info mb-3">
                <div className="info-item">
                  <i className="bi bi-person-badge me-2 text-primary"></i>
                  <small><strong>Responsable:</strong> {proyecto.responsable}</small>
                </div>
                <div className="info-item">
                  <i className="bi bi-mortarboard me-2 text-success"></i>
                  <small><strong>Programa:</strong> {proyecto.programa}</small>
                </div>
                <div className="info-item">
                  <i className="bi bi-people me-2 text-info"></i>
                  <small><strong>Equipo:</strong> {proyecto.equipo.length} miembros</small>
                </div>
                <div className="info-item">
                  <i className="bi bi-person-video3 me-2 text-secondary"></i>
                  <small><strong>Alumnos:</strong> {proyecto.alumnos?.length || 0}</small>
                </div>
                <div className="info-item">
                  <i className="bi bi-calendar me-2 text-warning"></i>
                  <small><strong>Finaliza:</strong> {proyecto.fechaFin}</small>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small className="text-muted">Progreso</small>
                  <small className="fw-bold">{proyecto.progreso}%</small>
                </div>
                <ProgressBar 
                  now={proyecto.progreso} 
                  variant={getProgressColor(proyecto.progreso)}
                  style={{ height: "8px" }}
                />
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  {calculateDaysRemaining(proyecto.fechaFin) > 0 
                    ? `${calculateDaysRemaining(proyecto.fechaFin)} días restantes`
                    : "Proyecto vencido"}
                </small>
                <span className="text-success fw-bold">
                  ${parseFloat(proyecto.presupuesto).toLocaleString()}
                </span>
              </div>
            </Card.Body>
            <Card.Footer className="bg-transparent border-0">
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => openDetailModal(proyecto)}
                  className="flex-fill"
                >
                  <i className="bi bi-eye me-1"></i>
                  Ver
                </Button>
                
                <Button 
                  variant="outline-info" 
                  size="sm" 
                  onClick={() => navigate(`/adminKanban/${proyecto.id}`)}
                  className="flex-fill"
                >
                  <i className="bi bi-list-task me-1"></i>
                  Tareas
                </Button>
                
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  onClick={() => openEditModal(proyecto)}
                  className="flex-fill"
                >
                  <i className="bi bi-pencil me-1"></i>
                  Editar
                </Button>
                
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={() => openDeleteModal(proyecto)}
                >
                  <i className="bi bi-trash"></i>
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );

  // Renderizar vista de tabla
  const renderTableView = () => (
    <Card className="shadow-sm">
      <Card.Body className="p-0">
        <div className="table-responsive">
          <Table hover className="mb-0">
            <thead className="table-light">
              <tr>
                <th>Proyecto</th>
                <th>Programa</th>
                <th>Responsable</th>
                <th>Estado</th>
                <th>Prioridad</th>
                <th>Progreso</th>
                <th>Alumnos</th>
                <th>Fecha Fin</th>
                <th>Presupuesto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(proyecto => (
                <tr key={proyecto.id}>
                  <td>
                    <div>
                      <h6 className="mb-0">{proyecto.nombre}</h6>
                      <small className="text-muted">{proyecto.equipo.length} miembros</small>
                    </div>
                  </td>
                  <td>{proyecto.programa}</td>
                  <td>{proyecto.responsable}</td>
                  <td>
                    <Badge bg={getBadgeColor("estado", proyecto.estado)} className="rounded-pill">
                      {getStatusLabel(proyecto.estado)}
                    </Badge>
                  </td>
                  <td>
                    <Badge bg={getBadgeColor("prioridad", proyecto.prioridad)} className="rounded-pill">
                      {getPriorityLabel(proyecto.prioridad)}
                    </Badge>
                  </td>
                  <td>
                    <div style={{ width: "100px" }}>
                      <ProgressBar 
                        now={proyecto.progreso} 
                        variant={getProgressColor(proyecto.progreso)}
                        style={{ height: "6px" }}
                      />
                      <small>{proyecto.progreso}%</small>
                    </div>
                  </td>
                  <td>
                    <Badge bg="info" className="rounded-pill">
                      {proyecto.alumnos?.length || 0}
                    </Badge>
                  </td>
                  <td>
                    <small>{proyecto.fechaFin}</small>
                  </td>
                  <td>
                    <span className="text-success fw-bold">
                      ${parseFloat(proyecto.presupuesto).toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-1">
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Ver detalles</Tooltip>}
                      >
                        <Button 
                          variant="outline-primary" 
                          size="sm" 
                          onClick={() => openDetailModal(proyecto)}
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Editar proyecto</Tooltip>}
                      >
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          onClick={() => openEditModal(proyecto)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip>Eliminar proyecto</Tooltip>}
                      >
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          onClick={() => openDeleteModal(proyecto)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <>
      {/* Botón de cambio de tema */}
      <button
        className="btn btn-outline-secondary position-fixed theme-toggle"
        onClick={toggleTheme}
        aria-label="Cambiar tema"
        title={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
      >
        <i className={`bi ${theme === "light" ? "bi-moon-stars-fill" : "bi-sun-fill"} theme-icon`}></i>
      </button>

      <button
        className="btn btn-outline-secondary position-fixed back-button"
        onClick={() => navigate('/dashboardAdmin')}
      >
        <i className="bi bi-arrow-left" />
      </button>

      <Container fluid className="gestion-proyectos pb-5">
        {/* Header */}
        <div className="projects-header mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h1 className="display-6 fw-bold mb-2 projects-title">
                <i className="bi bi-kanban me-3 text-primary"></i>
                Gestión de Proyectos
              </h1>
              <p className="text-muted lead">Administra y supervisa todos los proyectos académicos</p>
            </div>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => setShowCreateModal(true)}
              className="create-project-btn"
            >
              <i className="bi bi-plus-circle me-2"></i>
              Nuevo Proyecto
            </Button>
          </div>

          {/* Filtros y búsqueda */}
          <Card className="filters-card shadow-sm">
            <Card.Body>
              <Row className="g-3">
                <Col md={4}>
                  <InputGroup>
                    <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Buscar proyectos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <Form.Select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">Todos los estados</option>
                    {estadosProyecto.map(estado => (
                      <option key={estado.value} value={estado.value}>
                        {estado.label}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Select 
                    value={filterPriority} 
                    onChange={(e) => setFilterPriority(e.target.value)}
                  >
                    <option value="all">Todas las prioridades</option>
                    {prioridadesProyecto.map(prioridad => (
                      <option key={prioridad.value} value={prioridad.value}>
                        {prioridad.label}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="nombre">Ordenar por nombre</option>
                    <option value="fechaFin">Ordenar por fecha</option>
                    <option value="progreso">Ordenar por progreso</option>
                    <option value="prioridad">Ordenar por prioridad</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <div className="d-flex gap-2">
                    <Button
                      variant={activeView === "grid" ? "primary" : "outline-primary"}
                      onClick={() => setActiveView("grid")}
                    >
                      <i className="bi bi-grid-3x3-gap"></i>
                    </Button>
                    <Button
                      variant={activeView === "table" ? "primary" : "outline-primary"}
                      onClick={() => setActiveView("table")}
                    >
                      <i className="bi bi-table"></i>
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>

        {/* Estadísticas rápidas */}
        <Row className="g-4 mb-4">
          <Col md={3}>
            <Card className="stats-card text-center">
              <Card.Body>
                <i className="bi bi-folder-check stats-icon text-primary"></i>
                <h3 className="fw-bold mb-0">{proyectos.length}</h3>
                <small className="text-muted">Total Proyectos</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card text-center">
              <Card.Body>
                <i className="bi bi-play-circle stats-icon text-success"></i>
                <h3 className="fw-bold mb-0">
                  {proyectos.filter(p => p.estado === "en_progreso").length}
                </h3>
                <small className="text-muted">En Progreso</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card text-center">
              <Card.Body>
                <i className="bi bi-person-video3 stats-icon text-info"></i>
                <h3 className="fw-bold mb-0">
                  {proyectos.reduce((sum, p) => sum + (p.alumnos?.length || 0), 0)}
                </h3>
                <small className="text-muted">Alumnos Participando</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="stats-card text-center">
              <Card.Body>
                <i className="bi bi-currency-dollar stats-icon text-warning"></i>
                <h3 className="fw-bold mb-0">
                  ${proyectos.reduce((sum, p) => sum + parseFloat(p.presupuesto), 0).toLocaleString()}
                </h3>
                <small className="text-muted">Presupuesto Total</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Contenido principal */}
        {filteredProjects.length === 0 ? (
          <Card className="text-center py-5">
            <Card.Body>
              <i className="bi bi-folder-x display-1 text-muted mb-3"></i>
              <h3 className="text-muted">No se encontraron proyectos</h3>
              <p className="text-muted">
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Crea tu primer proyecto"}
              </p>
              {!searchTerm && (
                <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Crear Primer Proyecto
                </Button>
              )}
            </Card.Body>
          </Card>
        ) : (
          <>
            {activeView === "grid" ? renderGridView() : renderTableView()}
          </>
        )}

        {/* Modal Crear Proyecto */}
        <Modal 
          show={showCreateModal} 
          onHide={() => setShowCreateModal(false)}
          size="xl"
          centered
        >
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>
              <i className="bi bi-plus-circle me-2"></i>
              Crear Nuevo Proyecto
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Tabs defaultActiveKey="general" id="create-project-tabs">
                <Tab eventKey="general" title="Información General">
                  <div className="p-3">
                    <Row className="g-3">
                      <Col md={8}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">Nombre del Proyecto *</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Ingrese el nombre del proyecto"
                            value={newProject.nombre}
                            onChange={(e) => setNewProject(prev => ({...prev, nombre: e.target.value}))}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">Programa *</Form.Label>
                          <Form.Select
                            value={newProject.programa}
                            onChange={(e) => setNewProject(prev => ({...prev, programa: e.target.value}))}
                            required
                          >
                            <option value="">Seleccionar programa</option>
                            {programasDisponibles.map(programa => (
                              <option key={programa} value={programa}>{programa}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">Descripción *</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Describe el proyecto, sus objetivos y alcance"
                            value={newProject.descripcion}
                            onChange={(e) => setNewProject(prev => ({...prev, descripcion: e.target.value}))}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">Responsable del Proyecto *</Form.Label>
                          <Form.Select
                            value={newProject.responsable}
                            onChange={(e) => setNewProject(prev => ({...prev, responsable: e.target.value}))}
                            required
                          >
                            <option value="">Seleccionar responsable</option>
                            {responsablesDisponibles.map(responsable => (
                              <option key={responsable} value={responsable}>{responsable}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">Presupuesto (USD)</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>$</InputGroup.Text>
                            <Form.Control
                              type="number"
                              placeholder="0.00"
                              value={newProject.presupuesto}
                              onChange={(e) => setNewProject(prev => ({...prev, presupuesto: e.target.value}))}
                            />
                          </InputGroup>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">Estado Inicial</Form.Label>
                          <Form.Select
                            value={newProject.estado}
                            onChange={(e) => setNewProject(prev => ({...prev, estado: e.target.value}))}
                          >
                            {estadosProyecto.map(estado => (
                              <option key={estado.value} value={estado.value}>{estado.label}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">Prioridad</Form.Label>
                          <Form.Select
                            value={newProject.prioridad}
                            onChange={(e) => setNewProject(prev => ({...prev, prioridad: e.target.value}))}
                          >
                            {prioridadesProyecto.map(prioridad => (
                              <option key={prioridad.value} value={prioridad.value}>{prioridad.label}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">Progreso Inicial (%)</Form.Label>
                          <Form.Control
                            type="number"
                            min="0"
                            max="100"
                            placeholder="0"
                            value={newProject.progreso}
                            onChange={(e) => setNewProject(prev => ({...prev, progreso: parseInt(e.target.value) || 0}))}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">Fecha de Inicio *</Form.Label>
                          <Form.Control
                            type="date"
                            value={newProject.fechaInicio}
                            onChange={(e) => setNewProject(prev => ({...prev, fechaInicio: e.target.value}))}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">Fecha de Finalización *</Form.Label>
                          <Form.Control
                            type="date"
                            value={newProject.fechaFin}
                            onChange={(e) => setNewProject(prev => ({...prev, fechaFin: e.target.value}))}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </Tab>
                
                <Tab eventKey="equipo" title="Equipo y Alumnos">
                  <div className="p-3">
                    <Row className="g-3">
                      {/*<Col md={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">Miembros del Equipo</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Ingrese los nombres separados por comas (ej: Juan Pérez, María García)"
                            value={newProject.equipo.join(", ")}
                            onChange={(e) => setNewProject(prev => ({
                              ...prev, 
                              equipo: e.target.value.split(",").map(name => name.trim())
                            }))}
                          />
                          <Form.Text className="text-muted">
                            Separe los nombres con comas para agregar múltiples miembros
                          </Form.Text>
                        </Form.Group>
                      </Col>*/}
                      
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">Asignar Alumnos al Proyecto</Form.Label>
                          <Card className="mb-3">
                            <Card.Body style={{ maxHeight: '200px', overflowY: 'auto' }}>
                              {alumnosDisponibles.map(alumno => (
                                <Form.Check 
                                  key={alumno.id}
                                  type="checkbox"
                                  id={`alumno-create-${alumno.id}`}
                                  label={`${alumno.nombre} (${alumno.matricula}) - ${alumno.carrera}`}
                                  checked={newProject.alumnos.includes(alumno.id)}
                                  onChange={(e) => handleAlumnoSelection(alumno.id, e.target.checked)}
                                />
                              ))}
                            </Card.Body>
                          </Card>
                          {/*<Form.Text className="text-muted">
                            Seleccione los alumnos que participarán en este proyecto
                          </Form.Text>*/}
                        </Form.Group>
                      </Col>
                      
                      <Col md={12}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">Objetivos del Proyecto</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Ingrese los objetivos separados por saltos de línea"
                            value={newProject.objetivos.join("\n")}
                            onChange={(e) => setNewProject(prev => ({
                              ...prev, 
                              objetivos: e.target.value.split("\n").filter(obj => obj.trim() !== "")
                            }))}
                          />
                          <Form.Text className="text-muted">
                            Escriba cada objetivo en una línea separada
                          </Form.Text>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </Tab>
              </Tabs>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={handleCreateProject}
              disabled={loading || !newProject.nombre || !newProject.programa}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                  Creando...
                </>
              ) : (
                <>
                  <i className="bi bi-save me-2"></i>
                  Crear Proyecto
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Editar Proyecto */}
        <Modal 
          show={showEditModal} 
          onHide={() => setShowEditModal(false)}
          size="xl"
          centered
        >
          <Modal.Header closeButton className="bg-warning text-dark">
            <Modal.Title>
              <i className="bi bi-pencil-square me-2"></i>
              Editar Proyecto
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedProject && (
              <Form>
                <Tabs defaultActiveKey="general" id="edit-project-tabs">
                  <Tab eventKey="general" title="Información General">
                    <div className="p-3">
                      <Row className="g-3">
                        <Col md={8}>
                          <Form.Group>
                            <Form.Label className="fw-semibold">Nombre del Proyecto</Form.Label>
                            <Form.Control
                              type="text"
                              value={editProject.nombre || ""}
                              onChange={(e) => setEditProject(prev => ({...prev, nombre: e.target.value}))}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="fw-semibold">Programa</Form.Label>
                            <Form.Select
                              value={editProject.programa || ""}
                              onChange={(e) => setEditProject(prev => ({...prev, programa: e.target.value}))}
                            >
                              {programasDisponibles.map(programa => (
                                <option key={programa} value={programa}>{programa}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={12}>
                          <Form.Group>
                            <Form.Label className="fw-semibold">Descripción</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={editProject.descripcion || ""}
                              onChange={(e) => setEditProject(prev => ({...prev, descripcion: e.target.value}))}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold">Responsable</Form.Label>
                            <Form.Select
                              value={editProject.responsable || ""}
                              onChange={(e) => setEditProject(prev => ({...prev, responsable: e.target.value}))}
                            >
                              {responsablesDisponibles.map(responsable => (
                                <option key={responsable} value={responsable}>{responsable}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold">Presupuesto (USD)</Form.Label>
                            <InputGroup>
                              <InputGroup.Text>$</InputGroup.Text>
                              <Form.Control
                                type="number"
                                value={editProject.presupuesto || ""}
                                onChange={(e) => setEditProject(prev => ({...prev, presupuesto: e.target.value}))}
                              />
                            </InputGroup>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="fw-semibold">Estado</Form.Label>
                            <Form.Select
                              value={editProject.estado || ""}
                              onChange={(e) => setEditProject(prev => ({...prev, estado: e.target.value}))}
                            >
                              {estadosProyecto.map(estado => (
                                <option key={estado.value} value={estado.value}>{estado.label}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="fw-semibold">Prioridad</Form.Label>
                            <Form.Select
                              value={editProject.prioridad || ""}
                              onChange={(e) => setEditProject(prev => ({...prev, prioridad: e.target.value}))}
                            >
                              {prioridadesProyecto.map(prioridad => (
                                <option key={prioridad.value} value={prioridad.value}>{prioridad.label}</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="fw-semibold">Progreso (%)</Form.Label>
                            <Form.Control
                              type="number"
                              min="0"
                              max="100"
                              value={editProject.progreso || 0}
                              onChange={(e) => setEditProject(prev => ({...prev, progreso: parseInt(e.target.value) || 0}))}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold">Fecha de Inicio</Form.Label>
                            <Form.Control
                              type="date"
                              value={editProject.fechaInicio || ""}
                              onChange={(e) => setEditProject(prev => ({...prev, fechaInicio: e.target.value}))}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold">Fecha de Finalización</Form.Label>
                            <Form.Control
                              type="date"
                              value={editProject.fechaFin || ""}
                              onChange={(e) => setEditProject(prev => ({...prev, fechaFin: e.target.value}))}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  </Tab>
                  
                  <Tab eventKey="equipo" title="Equipo y Alumnos">
                    <div className="p-3">
                      <Row className="g-3">
                        <Col md={12}>
                          <Form.Group>
                            <Form.Label className="fw-semibold">Miembros del Equipo</Form.Label>
                            <Form.Control
                              type="text"
                              value={(editProject.equipo || []).join(", ")}
                              onChange={(e) => setEditProject(prev => ({
                                ...prev, 
                                equipo: e.target.value.split(",").map(name => name.trim()).filter(name => name !== "")
                              }))}
                            />
                          </Form.Group>
                        </Col>
                        
                        <Col md={12}>
                          <Form.Group>
                            <Form.Label className="fw-semibold">Asignar Alumnos al Proyecto</Form.Label>
                            <Card className="mb-3">
                              <Card.Body style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {alumnosDisponibles.map(alumno => (
                                  <Form.Check 
                                    key={alumno.id}
                                    type="checkbox"
                                    id={`alumno-edit-${alumno.id}`}
                                    label={`${alumno.nombre} (${alumno.matricula}) - ${alumno.carrera}`}
                                    checked={(editProject.alumnos || []).includes(alumno.id)}
                                    onChange={(e) => handleAlumnoSelection(alumno.id, e.target.checked, true)}
                                  />
                                ))}
                              </Card.Body>
                            </Card>
                          </Form.Group>
                        </Col>
                        
                        <Col md={12}>
                          <Form.Group>
                            <Form.Label className="fw-semibold">Objetivos del Proyecto</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={4}
                              value={(editProject.objetivos || []).join("\n")}
                              onChange={(e) => setEditProject(prev => ({
                                ...prev, 
                                objetivos: e.target.value.split("\n").filter(obj => obj.trim() !== "")
                              }))}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </div>
                  </Tab>
                </Tabs>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button 
              variant="warning" 
              onClick={handleEditProject}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                  Guardando...
                </>
              ) : (
                <>
                  <i className="bi bi-save me-2"></i>
                  Guardar Cambios
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Ver Detalles */}
        <Modal 
          show={showDetailModal} 
          onHide={() => setShowDetailModal(false)}
          size="xl"
          centered
          scrollable
        >
          <Modal.Header closeButton className="bg-info text-white">
            <Modal.Title>
              <i className="bi bi-eye me-2"></i>
              Detalles del Proyecto
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedProject && (
              <>
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h2 className="text-primary mb-2">{selectedProject.nombre}</h2>
                      <p className="lead text-muted">{selectedProject.descripcion}</p>
                    </div>
                    <div className="text-end">
                      <Badge bg={getBadgeColor("estado", selectedProject.estado)} className="rounded-pill mb-2 fs-6">
                        {getStatusLabel(selectedProject.estado)}
                      </Badge>
                      <br />
                      <Badge bg={getBadgeColor("prioridad", selectedProject.prioridad)} className="rounded-pill fs-6">
                        {getPriorityLabel(selectedProject.prioridad)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Tabs defaultActiveKey="general" id="detail-project-tabs">
                  <Tab eventKey="general" title="Información General">
                    <div className="p-3">
                      <Row className="g-4">
                        <Col md={6}>
                          <Card className="h-100 detail-info-card">
                            <Card.Header>
                              <h6 className="mb-0">
                                <i className="bi bi-info-circle me-2"></i>
                                Información del Proyecto
                              </h6>
                            </Card.Header>
                            <Card.Body>
                              <div className="detail-item">
                                <strong>Programa:</strong> {selectedProject.programa}
                              </div>
                              <div className="detail-item">
                                <strong>Responsable:</strong> {selectedProject.responsable}
                              </div>
                              <div className="detail-item">
                                <strong>Presupuesto:</strong> 
                                <span className="text-success fw-bold ms-2">
                                  ${parseFloat(selectedProject.presupuesto).toLocaleString()}
                                </span>
                              </div>
                              <div className="detail-item">
                                <strong>Progreso:</strong> 
                                <div className="mt-2">
                                  <ProgressBar 
                                    now={selectedProject.progreso} 
                                    variant={getProgressColor(selectedProject.progreso)}
                                    style={{ height: "10px" }}
                                  />
                                  <small className="text-muted">{selectedProject.progreso}% completado</small>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                        
                        <Col md={6}>
                          <Card className="h-100 detail-info-card">
                            <Card.Header>
                              <h6 className="mb-0">
                                <i className="bi bi-calendar me-2"></i>
                                Cronograma
                              </h6>
                            </Card.Header>
                            <Card.Body>
                              <div className="detail-item">
                                <strong>Fecha de Inicio:</strong> {selectedProject.fechaInicio}
                              </div>
                              <div className="detail-item">
                                <strong>Fecha de Finalización:</strong> {selectedProject.fechaFin}
                              </div>
                              <div className="detail-item">
                                <strong>Duración:</strong> {
                                  Math.ceil((new Date(selectedProject.fechaFin) - new Date(selectedProject.fechaInicio)) / (1000 * 60 * 60 * 24))
                                } días
                              </div>
                              <div className="detail-item">
                                <strong>Días Restantes:</strong> 
                                <span className={`ms-2 ${calculateDaysRemaining(selectedProject.fechaFin) > 0 ? 'text-success' : 'text-danger'}`}>
                                  {calculateDaysRemaining(selectedProject.fechaFin) > 0 
                                    ? `${calculateDaysRemaining(selectedProject.fechaFin)} días`
                                    : "Proyecto vencido"}
                                </span>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                        
                        <Col md={12}>
                          <Card className="detail-info-card">
                            <Card.Header>
                              <h6 className="mb-0">
                                <i className="bi bi-people me-2"></i>
                                Equipo de Trabajo ({selectedProject.equipo.length} miembros)
                              </h6>
                            </Card.Header>
                            <Card.Body>
                              {selectedProject.equipo.length > 0 ? (
                                <div className="d-flex flex-wrap gap-2">
                                  {selectedProject.equipo.map((miembro, index) => (
                                    <Badge key={index} bg="light" text="dark" className="rounded-pill px-3 py-2">
                                      <i className="bi bi-person me-1"></i>
                                      {miembro}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-muted mb-0">No hay miembros asignados al equipo</p>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                        
                        <Col md={12}>
                          <Card className="detail-info-card">
                            <Card.Header>
                              <h6 className="mb-0">
                                <i className="bi bi-person-video3 me-2"></i>
                                Alumnos Asignados ({selectedProject.alumnos?.length || 0})
                              </h6>
                            </Card.Header>
                            <Card.Body>
                              {selectedProject.alumnos && selectedProject.alumnos.length > 0 ? (
                                <Table hover>
                                  <thead>
                                    <tr>
                                      <th>Nombre</th>
                                      <th>Matrícula</th>
                                      <th>Carrera</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {selectedProject.alumnos.map(alumnoId => {
                                      const alumno = getAlumnoById(alumnoId);
                                      return alumno ? (
                                        <tr key={alumno.id}>
                                          <td>{alumno.nombre}</td>
                                          <td>{alumno.matricula}</td>
                                          <td>{alumno.carrera}</td>
                                        </tr>
                                      ) : null;
                                    })}
                                  </tbody>
                                </Table>
                              ) : (
                                <p className="text-muted mb-0">No hay alumnos asignados a este proyecto</p>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </div>
                  </Tab>
                  
                  {/* ... (otros tabs como objetivos, hitos, documentos) ... */}
                </Tabs>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowDetailModal(false)}>
              Cerrar
            </Button>
            <Button variant="warning" onClick={() => {
              setShowDetailModal(false);
              openEditModal(selectedProject);
            }}>
              <i className="bi bi-pencil me-2"></i>
              Editar Proyecto
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Confirmar Eliminación */}
        <Modal 
          show={showDeleteModal} 
          onHide={() => setShowDeleteModal(false)}
          centered
        >
          <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title>
              <i className="bi bi-exclamation-triangle me-2"></i>
              Confirmar Eliminación
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedProject && (
              <div className="text-center">
                <i className="bi bi-trash display-1 text-danger mb-3"></i>
                <h5>¿Estás seguro de que deseas eliminar este proyecto?</h5>
                <p className="text-muted">
                  <strong>"{selectedProject.nombre}"</strong>
                </p>
                <Alert variant="warning" className="text-start">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Esta acción no se puede deshacer. Se eliminarán todos los datos asociados al proyecto.
                </Alert>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteProject}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" className="me-2" />
                  Eliminando...
                </>
              ) : (
                <>
                  <i className="bi bi-trash me-2"></i>
                  Eliminar Proyecto
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default GestionProyectos;