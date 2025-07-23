// AdminnKanban.jsx – Vista para Administrador con asignación de responsables, progreso y comentarios
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

/* -------------------- Miembros -------------------- */
const members = [
  "Administrador",
  "Ana García",
  "Carlos López",
  "María Rodríguez",
  "Diego Martínez",
];

const AdminnKanban = () => {
  /* ------------ Usuario actual y parámetros ------------ */
  const currentUser = "Administrador";
  const { id: proyectoId } = useParams();
  const navigate = useNavigate();

  /* ------------ Estados principales ------------ */
  const [tareas, setTareas] = useState([]);
  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  /* ------------ Estados para nueva tarea ------------ */
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "Por hacer",
    priority: "media",
    assignee: "Administrador",
    progress: 0,
  });

  /* ------------ Estados de UI ------------ */
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedTaskData, setEditedTaskData] = useState({
    title: "",
    description: "",
    assignee: "Administrador",
    progress: 0,
    status: "Por hacer",
    priority: "media",
  });
  const [showComments, setShowComments] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newComment, setNewComment] = useState("");

  /* ------------ Efectos ------------ */
  useEffect(() => {
    if (proyectoId) {
      loadProyectoData();
      loadTareas();
    }
  }, [proyectoId]);

  /* ------------ Funciones de carga de datos ------------ */
  const loadProyectoData = async () => {
    try {
      const response = await api.get(`/proyectos/${proyectoId}`);
      setProyecto(response.data);
    } catch (error) {
      console.error('Error loading proyecto:', error);
      setError(`Error al cargar proyecto: ${error.response?.data?.message || error.message}`);
    }
  };

  const loadTareas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/tareas/proyecto/${proyectoId}`);
      const tareasData = response.data;

      if (!Array.isArray(tareasData)) {
        throw new Error('La respuesta no es un array válido');
      }

      // Filtrar duplicados por ID
      const tareasUnicas = tareasData.filter((tarea, index, self) => 
        index === self.findIndex(t => t.id === tarea.id)
      );

      setTareas(tareasUnicas);
      
    } catch (error) {
      console.error('Error loading tareas:', error);
      setError(`Error al cargar tareas: ${error.response?.data?.message || error.message}`);
      setTareas([]);
    } finally {
      setLoading(false);
    }
  };

  /* ------------ CRUD de tareas ------------ */
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    
    try {
      setLoading(true);
      setError(null);

      const tareaData = {
        titulo: newTask.title,
        descripcion: newTask.description,
        estado: newTask.status,
        prioridad: newTask.priority,
        responsable: newTask.assignee,
        progreso: newTask.progress,
        proyectoId: proyectoId,
        comentarios: []
      };

      const response = await api.post('/tareas/nuevaTarea', tareaData);
      
      const newTaskForUI = {
        id: response.data.id,
        titulo: response.data.titulo,
        descripcion: response.data.descripcion,
        estado: response.data.estado,
        prioridad: response.data.prioridad,
        responsable: response.data.responsable,
        progreso: response.data.progreso,
        comentarios: response.data.comentarios || [],
        archivoUrl: response.data.archivoUrl || "",
        proyectoId: proyectoId
      };

      setTareas([...tareas, newTaskForUI]);

      setNewTask({
        title: "",
        description: "",
        status: "Por hacer",
        priority: "media",
        assignee: "Administrador",
        progress: 0,
      });

      setShowForm(false);
      setSuccess('Tarea creada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Error creating task:', error);
      setError(`Error al crear tarea: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (tarea) => {
    setEditedTaskData({
      title: tarea.titulo,
      description: tarea.descripcion,
      assignee: tarea.responsable,
      progress: tarea.progreso,
      status: tarea.estado,
      priority: tarea.prioridad,
    });
    setEditingTask(tarea);
    setShowEditModal(true);
  };

  const saveEditedTask = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      const updatedData = {
        titulo: editedTaskData.title,
        descripcion: editedTaskData.description,
        responsable: editedTaskData.assignee,
        progreso: editedTaskData.progress,
        estado: editedTaskData.status,
        prioridad: editedTaskData.priority,
        proyectoId: proyectoId
      };

      const response = await api.put(`/tareas/${editingTask.id}`, updatedData);

      setTareas(tareas.map(t =>
        t.id === editingTask.id ? {
          ...t,
          titulo: response.data.titulo,
          descripcion: response.data.descripcion,
          responsable: response.data.responsable,
          progreso: response.data.progreso,
          estado: response.data.estado,
          prioridad: response.data.prioridad,
        } : t
      ));

      setShowEditModal(false);
      setEditingTask(null);
      setSuccess('Tarea actualizada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Error updating task:', error);
      setError(`Error al actualizar tarea: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (tarea) => {
    if (!window.confirm(`¿Está seguro de que desea eliminar la tarea "${tarea.titulo}"?`)) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await api.delete(`/tareas/${tarea.id}`);

      setTareas(tareas.filter(t => t.id !== tarea.id));
      setSuccess('Tarea eliminada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Error deleting task:', error);
      setError(`Error al eliminar tarea: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /* ------------ Comentarios ------------ */
  const openComments = (tarea) => {
    setSelectedTask(tarea);
    setShowComments(true);
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      const commentObj = { author: currentUser, text: newComment };
      const updatedComments = [...(selectedTask.comentarios || []), commentObj];

      await api.put(`/tareas/${selectedTask.id}`, {
        titulo: selectedTask.titulo,
        descripcion: selectedTask.descripcion,
        estado: selectedTask.estado,
        prioridad: selectedTask.prioridad,
        responsable: selectedTask.responsable,
        progreso: selectedTask.progreso,
        proyectoId: proyectoId,
        comentarios: updatedComments
      });

      setTareas(tareas.map(t =>
        t.id === selectedTask.id
          ? { ...t, comentarios: updatedComments }
          : t
      ));

      setSelectedTask({
        ...selectedTask,
        comentarios: updatedComments,
      });

      setNewComment("");
      setSuccess('Comentario agregado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Error adding comment:', error);
      setError(`Error al agregar comentario: ${error.response?.data?.message || error.message}`);
    }
  };

  /* ------------ Utilidades ------------ */
  const getEstadoBadge = (estado) => {
    const badges = {
      'Por hacer': 'secondary',
      'En progreso': 'primary',
      'En revisión': 'info',
      'Hecho': 'success'
    };
    return badges[estado] || 'secondary';
  };

  const getPrioridadBadge = (prioridad) => {
    const badges = {
      'alta': 'danger',
      'media': 'warning',
      'baja': 'success'
    };
    return badges[prioridad] || 'secondary';
  };

  // Loading inicial
  if (loading && tareas.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Cargando tareas...</p>
        </div>
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
                Volver
              </Button>
              <h1 className="display-6 fw-bold mb-2 d-inline">
                <i className="bi bi-list-task me-3 text-primary"></i>
                {proyecto ? `Tareas - ${proyecto.nombre}` : 'Gestión de Tareas'}
              </h1>
            </div>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => setShowForm(true)}
              disabled={loading}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Nueva Tarea
            </Button>
          </div>
          {proyecto && (
            <p className="text-muted lead">
              Gestiona todas las tareas del proyecto: {proyecto.nombre}
            </p>
          )}
        </Col>
      </Row>

      {/* Alertas */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess(null)} className="mb-4">
          <i className="bi bi-check-circle me-2"></i>
          {success}
        </Alert>
      )}

      {/* Formulario de nueva tarea */}
      <Modal show={showForm} onHide={() => setShowForm(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-plus-circle me-2"></i>
            Nueva Tarea
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddTask}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Título *</Form.Label>
                  <Form.Control
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Título de la tarea"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Estado</Form.Label>
                  <Form.Select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  >
                    <option value="Por hacer">Por hacer</option>
                    <option value="En progreso">En progreso</option>
                    <option value="En revisión">En revisión</option>
                    <option value="Hecho">Hecho</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Prioridad</Form.Label>
                  <Form.Select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Responsable</Form.Label>
                  <Form.Select
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  >
                    {members.map(member => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Progreso: {newTask.progress}%</Form.Label>
                  <Form.Range
                    value={newTask.progress}
                    onChange={(e) => setNewTask({ ...newTask, progress: parseInt(e.target.value) })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Descripción de la tarea"
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-secondary" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Guardando...
                  </>
                ) : (
                  'Crear Tarea'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Lista de tareas */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white border-0 p-4">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-list-check me-2 text-primary"></i>
                  Lista de Tareas
                </h5>
                <Badge bg="primary" className="fs-6">
                  {tareas.length} tarea{tareas.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {loading && tareas.length === 0 ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3 text-muted">Cargando tareas...</p>
                </div>
              ) : tareas.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-list-task display-1 text-muted"></i>
                  <h5 className="mt-3 text-muted">No hay tareas</h5>
                  <p className="text-muted">
                    Comience creando su primera tarea
                  </p>
                </div>
              ) : (
                <Table responsive hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Tarea</th>
                      <th>Estado</th>
                      <th>Prioridad</th>
                      <th>Responsable</th>
                      <th>Progreso</th>
                      <th>Archivo</th>
                      <th>Comentarios</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tareas.map((tarea) => (
                      <tr key={tarea.id}>
                        <td>
                          <div>
                            <h6 className="mb-1 fw-bold">{tarea.titulo}</h6>
                            <small className="text-muted">
                              {tarea.descripcion || 'Sin descripción'}
                            </small>
                          </div>
                        </td>
                        <td>
                          <Badge bg={getEstadoBadge(tarea.estado)}>
                            {tarea.estado}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={getPrioridadBadge(tarea.prioridad)}>
                            {tarea.prioridad}
                          </Badge>
                        </td>
                        <td>
                          <span className="d-flex align-items-center">
                            <i className="bi bi-person-circle me-2"></i>
                            {tarea.responsable}
                          </span>
                        </td>
                        <td>
                          <div style={{ width: '100px' }}>
                            <div className="progress" style={{ height: '8px' }}>
                              <div
                                className="progress-bar bg-primary"
                                style={{ width: `${tarea.progreso}%` }}
                              />
                            </div>
                            <small className="text-muted">{tarea.progreso}%</small>
                          </div>
                        </td>
                        <td>
                          {tarea.archivoUrl ? (
                            <div className="d-flex flex-column gap-1">
                              <a 
                                href={tarea.archivoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-sm btn-outline-success d-flex align-items-center"
                                title="Ver archivo en Google Drive"
                              >
                                <i className="bi bi-file-earmark-text me-1"></i>
                                Ver
                              </a>
                              <small className="text-muted text-center">
                                <i className="bi bi-google"></i>
                                Drive
                              </small>
                            </div>
                          ) : (
                            <div className="text-center">
                              <i className="bi bi-file-earmark-x text-muted"></i>
                              <br />
                              <small className="text-muted">Sin archivo</small>
                            </div>
                          )}
                        </td>
                        <td>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => openComments(tarea)}
                          >
                            <i className="bi bi-chat-left-text me-1"></i>
                            {tarea.comentarios?.length || 0}
                          </Button>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEditTask(tarea)}
                              disabled={loading}
                              title="Editar tarea"
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteTask(tarea)}
                              disabled={loading}
                              title="Eliminar tarea"
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
        </Col>
      </Row>

      {/* Modal de edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil-square me-2"></i>
            Editar Tarea
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={saveEditedTask}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Título *</Form.Label>
                  <Form.Control
                    type="text"
                    value={editedTaskData.title}
                    onChange={(e) => setEditedTaskData({ ...editedTaskData, title: e.target.value })}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Estado</Form.Label>
                  <Form.Select
                    value={editedTaskData.status}
                    onChange={(e) => setEditedTaskData({ ...editedTaskData, status: e.target.value })}
                  >
                    <option value="Por hacer">Por hacer</option>
                    <option value="En progreso">En progreso</option>
                    <option value="En revisión">En revisión</option>
                    <option value="Hecho">Hecho</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Prioridad</Form.Label>
                  <Form.Select
                    value={editedTaskData.priority}
                    onChange={(e) => setEditedTaskData({ ...editedTaskData, priority: e.target.value })}
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Responsable</Form.Label>
                  <Form.Select
                    value={editedTaskData.assignee}
                    onChange={(e) => setEditedTaskData({ ...editedTaskData, assignee: e.target.value })}
                  >
                    {members.map(member => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Progreso: {editedTaskData.progress}%</Form.Label>
                  <Form.Range
                    value={editedTaskData.progress}
                    onChange={(e) => setEditedTaskData({ ...editedTaskData, progress: parseInt(e.target.value) })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editedTaskData.description}
                onChange={(e) => setEditedTaskData({ ...editedTaskData, description: e.target.value })}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-secondary" onClick={() => setShowEditModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal de comentarios */}
      <Modal show={showComments} onHide={() => setShowComments(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-chat-left-text me-2"></i>
            Comentarios - {selectedTask?.titulo}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask && (
            <>
              {/* Información del archivo adjunto */}
              {selectedTask.archivoUrl && (
                <div className="alert alert-info mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <i className="bi bi-paperclip me-2"></i>
                      <strong>Archivo adjunto:</strong>
                    </div>
                    <a 
                      href={selectedTask.archivoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="bi bi-box-arrow-up-right me-1"></i>
                      Abrir en Drive
                    </a>
                  </div>
                </div>
              )}

              <div className="mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {(!selectedTask.comentarios || selectedTask.comentarios.length === 0) ? (
                  <div className="text-center text-muted py-3">
                    <i className="bi bi-chat-left display-1"></i>
                    <p className="mt-2">No hay comentarios</p>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {selectedTask.comentarios.map((comentario, index) => (
                      <div key={index} className="list-group-item border-0 px-0">
                        <div className="d-flex align-items-start">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3">
                            <i className="bi bi-person text-primary"></i>
                          </div>
                          <div className="flex-grow-1">
                            <h6 className="mb-1 fw-bold">{comentario.author}</h6>
                            <p className="mb-0 text-muted">{comentario.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Form onSubmit={(e) => { e.preventDefault(); addComment(); }}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Nuevo comentario</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe tu comentario..."
                  />
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button type="submit" disabled={loading || !newComment.trim()}>
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Agregando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Agregar Comentario
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default AdminnKanban;
