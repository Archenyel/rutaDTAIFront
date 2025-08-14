import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Alert,
  Spinner,
  Modal,
  Form,
  Table
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import api from "../../../api/api";

const AdminKanban = () => {

  // Usuario y parámetros
  const currentUser = localStorage.getItem("userName") || "Administrador";
  const { id: proyectoId } = useParams();
  const navigate = useNavigate();

  // Estados principales
  const [tareas, setTareas] = useState([]);
  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState({
    general: true,
    acciones: false
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Estados para formularios
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    titulo: "",
    descripcion: "",
    estado: "Por hacer",
    prioridad: "media",
    responsable: currentUser,
    estudianteAsignado: "", // Cambio: un solo estudiante
    progreso: 0,
    proyectoId: proyectoId
  });

  // Estados para edición
  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Estados para comentarios
  const [showComments, setShowComments] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newComment, setNewComment] = useState("");

  // Estados para firma/aprobación
  const [showSignModal, setShowSignModal] = useState(false);
  const [signComment, setSignComment] = useState("");

  // Lista de miembros del equipo y estudiantes
  const [members, setMembers] = useState([currentUser]);
  const [estudiantes, setEstudiantes] = useState([]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(prev => ({...prev, general: true}));
        
        // Cargar proyecto
        const proyectoResponse = await api.get(`/proyectos/${proyectoId}`);
        setProyecto(proyectoResponse.data);
        
        // Cargar miembros del equipo
        const equipo = proyectoResponse.data.equipo || [];
        setMembers([currentUser, ...equipo]);
        
        // Cargar estudiantes del proyecto
        try {
          const estudiantesResponse = await api.get(`/proyectos/alumnos/${proyectoId}`);
          setEstudiantes(estudiantesResponse.data.alumnos || []);
          console.log('Estudiantes cargados:', estudiantesResponse.data);
        } catch (error) {
          console.warn('No se pudieron cargar los estudiantes:', error);
          setEstudiantes([]);
        }
        
        // Cargar tareas
        const tareasResponse = await api.get(`/tareas/proyecto/${proyectoId}`);
        setTareas(tareasResponse.data);
        
      } catch (error) {
        setError(`Error al cargar datos: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(prev => ({...prev, general: false}));
      }
    };

    if (proyectoId) {
      loadInitialData();
    }
  }, [proyectoId]);

  // Manejar creación de tarea
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.titulo.trim()) return;
    
    try {
      setLoading(prev => ({...prev, acciones: true}));
      setError(null);

      const taskData = {
        ...newTask,
        estudianteAsignado: newTask.estudianteAsignado || null
      };

      const response = await api.post('/tareas/nuevaTarea', taskData);
      
      setTareas([...tareas, response.data]);
      setNewTask({
        titulo: "",
        descripcion: "",
        estado: "Por hacer",
        prioridad: "media",
        responsable: currentUser,
        estudianteAsignado: "",
        progreso: 0,
        proyectoId: proyectoId
      });
      setShowForm(false);
      setSuccess('Tarea creada exitosamente');
      
    } catch (error) {
      setError(`Error al crear tarea: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(prev => ({...prev, acciones: false}));
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // Manejar edición de tarea
  const handleEditTask = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(prev => ({...prev, acciones: true}));
      setError(null);

      const response = await api.put(`/tareas/${editingTask.id}`, editingTask);
      
      setTareas(tareas.map(t => 
        t.id === editingTask.id ? response.data : t
      ));
      setShowEditModal(false);
      setEditingTask(null);
      setSuccess('Tarea actualizada exitosamente');
      
    } catch (error) {
      setError(`Error al actualizar tarea: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(prev => ({...prev, acciones: false}));
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // Manejar eliminación de tarea
  const handleDeleteTask = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar esta tarea?")) return;
    
    try {
      setLoading(prev => ({...prev, acciones: true}));
      setError(null);

      await api.delete(`/tareas/${id}`);
      setTareas(tareas.filter(t => t.id !== id));
      setSuccess('Tarea eliminada exitosamente');
      
    } catch (error) {
      setError(`Error al eliminar tarea: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(prev => ({...prev, acciones: false}));
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // Manejar firma/aprobación de tarea
  const handleSignTask = async () => {
    if (!selectedTask) return;

    try {
      setLoading(prev => ({...prev, acciones: true}));
      setError(null);

      const signatureData = {
        comentarioFirma: signComment.trim() || "Documentos y tarea aprobados",
        firmadoPor: currentUser,
      };

      // Usar endpoint específico para firmar
      const response = await api.put(`/tareas/${selectedTask.id}/firmar`, signatureData);
      
      // Actualizar la tarea en el estado local
      setTareas(tareas.map(t => 
        t.id === selectedTask.id ? response.data.tarea : t
      ));
      
      setShowSignModal(false);
      setSelectedTask(null);
      setSignComment("");
      setSuccess(response.data.message || 'Tarea firmada y aprobada exitosamente');
      
    } catch (error) {
      console.error('Error al firmar tarea:', error);
      setError(`Error al firmar tarea: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(prev => ({...prev, acciones: false}));
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // Manejar comentarios
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(prev => ({...prev, acciones: true}));
      setError(null);

      const comment = {
        autor: currentUser,
        texto: newComment,
        fecha: new Date().toISOString()
      };

      const updatedTask = {
        ...selectedTask,
        comentarios: [...(selectedTask.comentarios || []), comment]
      };
      

      const response = await api.put(`/tareas/${selectedTask.id}`, updatedTask);
      
      setTareas(tareas.map(t => 
        t.id === selectedTask.id ? response.data : t
      ));
      setSelectedTask(response.data);
      setNewComment("");
      setSuccess('Comentario agregado exitosamente');
      
    } catch (error) {
      setError(`Error al agregar comentario: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(prev => ({...prev, acciones: false}));
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  // Funciones de utilidad
  const getBadgeVariant = (type, value) => {
    const estados = {
      'Por hacer': 'secondary',
      'En progreso': 'primary',
      'En revisión': 'info',
      'Hecho': 'success'
    };
    
    const prioridades = {
      'alta': 'danger',
      'media': 'warning',
      'baja': 'secondary'
    };

    return type === 'estado' 
      ? estados[value] || 'secondary'
      : prioridades[value] || 'secondary';
  };

  // Función para obtener nombre de estudiante asignado
  const getEstudianteNombre = (estudianteId) => {
    if (!estudianteId) return 'Sin asignar';
    
    const estudiante = estudiantes.find(est => est.id === estudianteId);
    return estudiante ? estudiante.nombre : `ID: ${estudianteId}`;
  };

  // Vista de carga
  if (loading.general && tareas.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <Spinner animation="border" variant="primary" />
        <span className="ms-3">Cargando tablero de tareas...</span>
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate(-1)}
                className="me-3"
              >
                <i className="bi bi-arrow-left me-2"></i>
                Volver a proyectos
              </Button>
              <h1 className="display-6 fw-bold mb-2 d-inline">
                <i className="bi bi-kanban me-3 text-primary"></i>
                {proyecto?.nombre || 'Tablero de tareas'}
              </h1>
            </div>
            <Button 
              variant="primary" 
              onClick={() => setShowForm(true)}
              disabled={loading.acciones}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Nueva Tarea
            </Button>
          </div>
          
          {proyecto && (
            <div className="mt-3">
              <Badge bg={getBadgeVariant('estado', proyecto.estado)} className="me-2">
                {proyecto.estado}
              </Badge>
              <span className="text-muted me-3">
                <i className="bi bi-person-fill me-1"></i>
                {proyecto.responsable}
              </span>
              <span className="text-muted">
                <i className="bi bi-calendar me-1"></i>
                Finaliza: {new Date(proyecto.fechaFin).toLocaleDateString()}
              </span>
            </div>
          )}
        </Col>
      </Row>

      {/* Alertas */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)}>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
          <i className="bi bi-check-circle-fill me-2"></i>
          {success}
        </Alert>
      )}

      {/* Estadísticas */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                  <i className="bi bi-list-task text-primary fs-4"></i>
                </div>
                <div>
                  <h5 className="mb-0">{tareas.length}</h5>
                  <small className="text-muted">Total tareas</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                  <i className="bi bi-check-circle text-success fs-4"></i>
                </div>
                <div>
                  <h5 className="mb-0">
                    {tareas.filter(t => t.estado === 'Hecho').length}
                  </h5>
                  <small className="text-muted">Completadas</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 p-3 rounded me-3">
                  <i className="bi bi-exclamation-triangle text-warning fs-4"></i>
                </div>
                <div>
                  <h5 className="mb-0">
                    {tareas.filter(t => t.prioridad === 'alta').length}
                  </h5>
                  <small className="text-muted">Prioridad alta</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center">
                <div className="bg-info bg-opacity-10 p-3 rounded me-3">
                  <i className="bi bi-people text-info fs-4"></i>
                </div>
                <div>
                  <h5 className="mb-0">{members.length}</h5>
                  <small className="text-muted">Miembros</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Lista de tareas */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">
              <i className="bi bi-list-check me-2"></i>
              Todas las tareas
            </h5>
            <div>
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={() => loadInitialData()}
                disabled={loading.acciones}
                className="me-2"
              >
                <i className="bi bi-arrow-clockwise"></i>
              </Button>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={() => setShowForm(true)}
                disabled={loading.acciones}
              >
                <i className="bi bi-plus-lg me-1"></i>
                Nueva
              </Button>
            </div>
          </div>
        </Card.Header>
        
        <Card.Body className="p-0">
          {tareas.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
              <h5 className="mt-3 text-muted">No hay tareas</h5>
              <p className="text-muted">Comienza creando tu primera tarea</p>
              <Button 
                variant="primary" 
                onClick={() => setShowForm(true)}
                disabled={loading.acciones}
              >
                <i className="bi bi-plus-lg me-1"></i>
                Crear tarea
              </Button>
            </div>
          ) : (
            <Table hover responsive className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Tarea</th>
                  <th>Estado</th>
                  <th>Prioridad</th>
                  <th>Responsable</th>
                  <th>Progreso</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {tareas.map(tarea => (
                  <tr key={tarea.id}>
                    <td>
                      <div>
                        <h6 className="mb-1 fw-bold">{tarea.titulo}</h6>
                        <small className="text-muted">
                          {tarea.descripcion || 'Sin descripción'}
                        </small>
                        {tarea.firmadoPor && (
                          <div className="mt-1">
                            <small className="text-success">
                              <i className="bi bi-check-circle-fill me-1"></i>
                              Firmado por {tarea.firmadoPor}
                            </small>
                          </div>
                        )}
                        {tarea.archivoUrl && (
                          <div className="mt-1">
                            <small className="text-info">
                              <i className="bi bi-file-earmark-pdf me-1"></i>
                              Archivo adjunto
                            </small>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <Badge bg={getBadgeVariant('estado', tarea.estado)}>
                        {tarea.estado}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={getBadgeVariant('prioridad', tarea.prioridad)}>
                        {tarea.prioridad}
                      </Badge>
                    </td>
                    <td>
                      <span className="d-flex align-items-center">
                        <i className="bi bi-person-circle me-2"></i>
                        {tarea.responsable}
                      </span>
                      {tarea.estudianteAsignado && (
                        <div className="mt-1">
                          <small className="text-muted">
                            <i className="bi bi-person-fill me-1"></i>
                            Estudiante: {getEstudianteNombre(tarea.estudianteAsignado)}
                          </small>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div style={{ width: '80px' }} className="me-2">
                          <div className="progress" style={{ height: '6px' }}>
                            <div 
                              className="progress-bar" 
                              style={{ 
                                width: `${tarea.progreso}%`,
                                backgroundColor: tarea.progreso === 100 ? 
                                  '#198754' : 
                                  tarea.progreso > 50 ? 
                                    '#0d6efd' : 
                                    '#6c757d'
                              }}
                            ></div>
                          </div>
                        </div>
                        <small>{tarea.progreso}%</small>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            setEditingTask(tarea);
                            setShowEditModal(true);
                          }}
                          disabled={loading.acciones}
                          title="Editar"
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => {
                            setSelectedTask(tarea);
                            setShowComments(true);
                          }}
                          disabled={loading.acciones}
                          title="Comentarios"
                        >
                          <i className="bi bi-chat-left-text"></i>
                          <span className="ms-1">{tarea.comentarios?.length || 0}</span>
                        </Button>

                        {tarea.archivoUrl && (
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => window.open(tarea.archivoUrl, '_blank')}
                            disabled={loading.acciones}
                            title="Ver archivo PDF"
                          >
                            <i className="bi bi-file-earmark-pdf"></i>
                          </Button>
                        )}

                        {!tarea.firmadoPor && tarea.estado === 'En revisión' && (
                          <Button
                            variant="outline-warning"
                            size="sm"
                            onClick={() => {
                              setSelectedTask(tarea);
                              setShowSignModal(true);
                            }}
                            disabled={loading.acciones}
                            title="Firmar y aprobar tarea"
                          >
                            <i className="bi bi-patch-check"></i>
                          </Button>
                        )}
                        
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteTask(tarea.id)}
                          disabled={loading.acciones}
                          title="Eliminar"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Modal para nueva tarea */}
      <Modal show={showForm} onHide={() => setShowForm(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-plus-circle me-2"></i>
            Nueva Tarea
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddTask}>
            <Row className="g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label>Título *</Form.Label>
                  <Form.Control
                    type="text"
                    value={newTask.titulo}
                    onChange={(e) => setNewTask({...newTask, titulo: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Prioridad</Form.Label>
                  <Form.Select
                    value={newTask.prioridad}
                    onChange={(e) => setNewTask({...newTask, prioridad: e.target.value})}
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newTask.descripcion}
                    onChange={(e) => setNewTask({...newTask, descripcion: e.target.value})}
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={newTask.estado}
                    onChange={(e) => setNewTask({...newTask, estado: e.target.value})}
                  >
                    <option value="Por hacer">Por hacer</option>
                    <option value="En progreso">En progreso</option>
                    <option value="En revisión">En revisión</option>
                    <option value="Hecho">Hecho</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Responsable</Form.Label>
                  <Form.Select
                    value={newTask.responsable}
                    onChange={(e) => setNewTask({...newTask, responsable: e.target.value})}
                  >
                    {members.map(member => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Estudiante Asignado</Form.Label>
                  <Form.Select
                    value={newTask.estudianteAsignado}
                    onChange={(e) => setNewTask({...newTask, estudianteAsignado: e.target.value})}
                  >
                    <option value="">Seleccionar estudiante (opcional)</option>
                    {estudiantes.map(estudiante => (
                      <option key={estudiante.id} value={estudiante.id}>
                        {estudiante.nombre} ({estudiante.email})
                      </option>
                    ))}
                  </Form.Select>
                  {estudiantes.length === 0 && (
                    <Form.Text className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      No hay estudiantes registrados en este proyecto
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Progreso: {newTask.progreso}%</Form.Label>
                  <Form.Range
                    min="0"
                    max="100"
                    value={newTask.progreso}
                    onChange={(e) => setNewTask({...newTask, progreso: parseInt(e.target.value)})}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end mt-4 gap-2">
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </Button>
              
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading.acciones}
              >
                {loading.acciones ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Guardando...
                  </>
                ) : 'Crear Tarea'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para editar tarea */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil-square me-2"></i>
            Editar Tarea
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingTask && (
            <Form onSubmit={handleEditTask}>
              <Row className="g-3">
                <Col md={8}>
                  <Form.Group>
                    <Form.Label>Título *</Form.Label>
                    <Form.Control
                      type="text"
                      value={editingTask.titulo}
                      onChange={(e) => setEditingTask({...editingTask, titulo: e.target.value})}
                      required
                    />
                  </Form.Group>
                </Col>
                
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Prioridad</Form.Label>
                    <Form.Select
                      value={editingTask.prioridad}
                      onChange={(e) => setEditingTask({...editingTask, prioridad: e.target.value})}
                    >
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={editingTask.descripcion}
                      onChange={(e) => setEditingTask({...editingTask, descripcion: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Estado</Form.Label>
                    <Form.Select
                      value={editingTask.estado}
                      onChange={(e) => setEditingTask({...editingTask, estado: e.target.value})}
                    >
                      <option value="Por hacer">Por hacer</option>
                      <option value="En progreso">En progreso</option>
                      <option value="En revisión">En revisión</option>
                      <option value="Hecho">Hecho</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Responsable</Form.Label>
                    <Form.Select
                      value={editingTask.responsable}
                      onChange={(e) => setEditingTask({...editingTask, responsable: e.target.value})}
                    >
                      {members.map(member => (
                        <option key={member} value={member}>{member}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Estudiante Asignado</Form.Label>
                    <Form.Select
                      value={editingTask.estudianteAsignado || ""}
                      onChange={(e) => setEditingTask({...editingTask, estudianteAsignado: e.target.value})}
                    >
                      <option value="">Seleccionar estudiante (opcional)</option>
                      {estudiantes.map(estudiante => (
                        <option key={estudiante.id} value={estudiante.id}>
                          {estudiante.nombre} ({estudiante.email})
                        </option>
                      ))}
                    </Form.Select>
                    {estudiantes.length === 0 && (
                      <Form.Text className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        No hay estudiantes registrados en este proyecto
                      </Form.Text>
                    )}
                  </Form.Group>
                </Col>
                
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Progreso: {editingTask.progreso}%</Form.Label>
                    <Form.Range
                      min="0"
                      max="100"
                      value={editingTask.progreso}
                      onChange={(e) => setEditingTask({...editingTask, progreso: parseInt(e.target.value)})}
                    />
                  </Form.Group>
                </Col>

                {/* Mostrar archivo adjunto si existe */}
                {editingTask.archivoUrl && (
                  <Col md={12}>
                    <div className="alert alert-info">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <i className="bi bi-file-earmark-pdf me-2"></i>
                          <strong>Archivo PDF adjunto:</strong>
                        </div>
                        <a 
                          href={editingTask.archivoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="bi bi-box-arrow-up-right me-1"></i>
                          Ver PDF
                        </a>
                      </div>
                      <div className="mt-2">
                        <small className="text-muted">
                          URL: {editingTask.archivoUrl.length > 60 ? 
                            editingTask.archivoUrl.substring(0, 60) + '...' : 
                            editingTask.archivoUrl}
                        </small>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
              
              <div className="d-flex justify-content-end mt-4 gap-2">
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </Button>
                
                <Button 
                  variant="primary" 
                  type="submit"
                  disabled={loading.acciones}
                >
                  {loading.acciones ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Guardando...
                    </>
                  ) : 'Guardar Cambios'}
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal para comentarios */}
      <Modal show={showComments} onHide={() => setShowComments(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-chat-left-text me-2"></i>
            Comentarios: {selectedTask?.titulo}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask && (
            <>
              {/* Información del archivo adjunto si existe */}
              {selectedTask.archivoUrl && (
                <div className="alert alert-info mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <i className="bi bi-file-earmark-pdf me-2"></i>
                      <strong>Archivo PDF adjunto:</strong>
                    </div>
                    <a 
                      href={selectedTask.archivoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="bi bi-box-arrow-up-right me-1"></i>
                      Abrir PDF
                    </a>
                  </div>
                </div>
              )}

              <div 
                style={{ 
                  maxHeight: '300px', 
                  overflowY: 'auto',
                  marginBottom: '20px'
                }}
              >
                {selectedTask.comentarios?.length > 0 ? (
                  selectedTask.comentarios.map((comentario, index) => (
                    <Card key={index} className="mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <strong>{comentario.author}</strong>
                          <small className="text-muted">
                            {new Date(comentario.timestamp).toLocaleDateString()}
                          </small>
                        </div>
                        <p className="mb-0">{comentario.text}</p>
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-chat-square-text" style={{ fontSize: '2rem' }}></i>
                    <p className="mt-2">No hay comentarios</p>
                  </div>
                )}
              </div>
              
              <Form.Group>
                <Form.Label>Nuevo comentario</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe tu comentario..."
                />
              </Form.Group>
              
              <div className="d-flex justify-content-end mt-3">
                <Button
                  variant="primary"
                  onClick={handleAddComment}
                  disabled={loading.acciones || !newComment.trim()}
                >
                  {loading.acciones ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-1"></i>
                      Enviar comentario
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Modal para firma/aprobación */}
      <Modal show={showSignModal} onHide={() => setShowSignModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-patch-check-fill me-2 text-warning"></i>
            Firmar y Aprobar Tarea
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask && (
            <>
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Importante:</strong> Al firmar esta tarea confirmas que:
                <ul className="mt-2 mb-0">
                  <li>Los documentos entregados están completos y correctos</li>
                  <li>La tarea cumple con todos los requisitos</li>
                  <li>El trabajo está aprobado oficialmente</li>
                  <li>La tarea se marcará como "Completada" automáticamente</li>
                </ul>
              </div>

              <div className="mb-3">
                <h6 className="fw-bold">Tarea a firmar:</h6>
                <div className="bg-light p-3 rounded">
                  <h6 className="mb-1">{selectedTask.titulo}</h6>
                  <p className="mb-1 text-muted">{selectedTask.descripcion}</p>
                  <div className="d-flex gap-3">
                    <small>
                      <strong>Estado:</strong> {selectedTask.estado}
                    </small>
                    <small>
                      <strong>Progreso:</strong> {selectedTask.progreso}%
                    </small>
                  </div>
                  {selectedTask.estudianteAsignado && (
                    <small className="text-muted">
                      <strong>Estudiante:</strong> {getEstudianteNombre(selectedTask.estudianteAsignado)}
                    </small>
                  )}
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">
                  <i className="bi bi-chat-left-quote me-1"></i>
                  Comentario de aprobación (opcional)
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={signComment}
                  onChange={(e) => setSignComment(e.target.value)}
                  placeholder="Ejemplo: Documentos completos y correctos. Trabajo aprobado según especificaciones."
                />
                <Form.Text className="text-muted">
                  Este comentario se guardará como registro de la aprobación
                </Form.Text>
              </Form.Group>

              <div className="bg-warning bg-opacity-10 border border-warning rounded p-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
                  <strong>Atención:</strong>
                </div>
                <p className="mb-0 mt-1 small">
                  Una vez firmada, la tarea no podrá ser editada ni eliminada. 
                  Esta acción es permanente.
                </p>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="outline-secondary" 
            onClick={() => {
              setShowSignModal(false);
              setSignComment("");
            }}
          >
            <i className="bi bi-x-lg me-2"></i>
            Cancelar
          </Button>
          <Button
            variant="warning"
            onClick={handleSignTask}
            disabled={loading.acciones}
          >
            {loading.acciones ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Firmando...
              </>
            ) : (
              <>
                <i className="bi bi-patch-check-fill me-2"></i>
                Firmar y Aprobar
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminKanban;