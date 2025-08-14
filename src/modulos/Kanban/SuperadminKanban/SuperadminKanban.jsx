import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Button as RBButton,
  Form as RBForm,
  Badge,
  ListGroup,
  Alert
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./SuperadminKanban.css";
import api from "../../../api/api";

const members = [
  "Superadmin",
  "Ana García",
  "Carlos López",
  "María Rodríguez",
  "Diego Martínez",
];

const initialData = {
  "Por hacer": [],
  "En progreso": [],
  "En revisión": [],
  "Hecho": []
};

const SuperadminKanban = () => {
  const currentUser = "Superadmin";
  const [columns, setColumns] = useState(initialData);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "Por hacer",
    priority: "media",
    assignee: "Superadmin",
    progress: 0,
    startDate: "",
    endDate: "",
    documents: [],
    projectId: null
  });
  const [theme, setTheme] = useState("light");
  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskData, setEditedTaskData] = useState({
    title: "",
    description: "",
    assignee: "Superadmin",
    progress: 0,
    startDate: "",
    endDate: "",
    documents: [],
    projectId: null
  });
  
  // Estados para modal de archivo
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  
  // Estados para modal de comentarios
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [showDocuments, setShowDocuments] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
    loadAllTasks();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadTasksByProject(selectedProject.id);
    } else {
      loadAllTasks();
    }
  }, [selectedProject]);

  /* ------------ Funciones de carga de datos ------------ */
  const loadProjects = async () => {
    try {
      const response = await api.get('/proyectos');
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Error al cargar proyectos');
    }
  };

  const loadAllTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/tareas');
      const tareasData = response.data;

      if (!Array.isArray(tareasData)) {
        throw new Error('La respuesta no es un array válido');
      }

      // Organizar tareas por estado/columna
      const newColumns = {
        "Por hacer": [],
        "En progreso": [],
        "En revisión": [],
        "Hecho": []
      };
      
      tareasData.forEach(tarea => {
        const estado = tarea.estado || "Por hacer";
        
        if (newColumns[estado]) {
          newColumns[estado].push({
            id: tarea.id,
            title: tarea.titulo || tarea.nombre,
            description: tarea.descripcion || "",
            priority: tarea.prioridad || "media",
            assignee: tarea.responsable || "Sin asignar",
            progress: tarea.progreso || 0,
            status: estado,
            startDate: tarea.fechaInicio || "",
            endDate: tarea.fechaFin || "",
            fileUrl: tarea.archivoUrl || "",
            comments: tarea.comentarios || [],
            documents: tarea.documentos || [],
            projectId: tarea.proyectoId
          });
        }
      });

      setColumns(newColumns);
      
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError(`Error al cargar tareas: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const loadTasksByProject = async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/tareas/proyecto/${projectId}`);
      const tareasData = response.data;

      if (!Array.isArray(tareasData)) {
        throw new Error('La respuesta no es un array válido');
      }

      // Organizar tareas por estado/columna
      const newColumns = {
        "Por hacer": [],
        "En progreso": [],
        "En revisión": [],
        "Hecho": []
      };
      
      tareasData.forEach(tarea => {
        const estado = tarea.estado || "Por hacer";
        
        if (newColumns[estado]) {
          newColumns[estado].push({
            id: tarea.id,
            title: tarea.titulo || tarea.nombre,
            description: tarea.descripcion || "",
            priority: tarea.prioridad || "media",
            assignee: tarea.responsable || "Sin asignar",
            progress: tarea.progreso || 0,
            status: estado,
            startDate: tarea.fechaInicio || "",
            endDate: tarea.fechaFin || "",
            fileUrl: tarea.archivoUrl || "",
            comments: tarea.comentarios || [],
            documents: tarea.documentos || [],
            projectId: tarea.proyectoId
          });
        }
      });

      setColumns(newColumns);
      
    } catch (error) {
      console.error('Error loading project tasks:', error);
      setError(`Error al cargar tareas del proyecto: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async ({ source, destination }) => {
    if (!destination) return;
    
    const srcTasks = Array.from(columns[source.droppableId]);
    const destTasks = Array.from(columns[destination.droppableId]);
    const [moved] = srcTasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      srcTasks.splice(destination.index, 0, moved);
      setColumns({ ...columns, [source.droppableId]: srcTasks });
    } else {
      // Actualizar estado en el backend
      try {
        const updatedTask = { ...moved, status: destination.droppableId };
        
        await api.put(`/tareas/actualizarEstado/${moved.id}`, {
          titulo: moved.title,
          descripcion: moved.description,
          estado: destination.droppableId,
          prioridad: moved.priority,
          responsable: moved.assignee,
          progreso: moved.progress,
          proyectoId: moved.projectId,
          archivoUrl: moved.fileUrl || "",
          fechaInicio: moved.startDate,
          fechaFin: moved.endDate
        });

        destTasks.splice(destination.index, 0, updatedTask);
        setColumns({
          ...columns,
          [source.droppableId]: srcTasks,
          [destination.droppableId]: destTasks,
        });

        setSuccess('Estado de tarea actualizado correctamente');
        setTimeout(() => setSuccess(null), 3000);
        
      } catch (error) {
        console.error('Error updating task state:', error);
        setError('Error al actualizar el estado de la tarea');
        setTimeout(() => setError(null), 3000);
        // Revertir cambio visual en caso de error
        if (selectedProject) {
          loadTasksByProject(selectedProject.id);
        } else {
          loadAllTasks();
        }
      }
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim() || !newTask.startDate || !newTask.endDate || !selectedProject) return;
    
    try {
      setLoading(true);
      
      const taskData = {
        titulo: newTask.title,
        descripcion: newTask.description,
        estado: newTask.status,
        prioridad: newTask.priority,
        responsable: newTask.assignee,
        progreso: newTask.progress,
        proyectoId: selectedProject.id,
        fechaInicio: newTask.startDate,
        fechaFin: newTask.endDate,
        archivoUrl: "",
        comentarios: []
      };

      const response = await api.post('/tareas', taskData);
      
      const task = {
        id: response.data.id,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        assignee: newTask.assignee,
        progress: newTask.progress,
        startDate: newTask.startDate,
        endDate: newTask.endDate,
        fileUrl: "",
        comments: [],
        documents: [],
        projectId: selectedProject.id
      };

      setColumns(prevColumns => ({
        ...prevColumns,
        [newTask.status]: [...prevColumns[newTask.status], task]
      }));

      setNewTask({
        title: "",
        description: "",
        status: "Por hacer",
        priority: "media",
        assignee: "Superadmin",
        progress: 0,
        startDate: "",
        endDate: "",
        documents: [],
        projectId: selectedProject.id
      });

      setSuccess('Tarea creada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Error al crear la tarea');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (col, idx) => {
    const taskToDelete = columns[col][idx];
    
    try {
      await api.delete(`/tareas/${taskToDelete.id}`);
      
      const updated = { ...columns };
      updated[col].splice(idx, 1);
      setColumns(updated);
      
      setSuccess('Tarea eliminada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Error al eliminar la tarea');
      setTimeout(() => setError(null), 3000);
    }
  };

  const saveEditedTask = async (colName, index) => {
    const taskId = columns[colName][index].id;
    
    try {
      setLoading(true);
      
      await api.put(`/tareas/${taskId}`, {
        titulo: editedTaskData.title,
        descripcion: editedTaskData.description,
        estado: colName,
        prioridad: columns[colName][index].priority,
        responsable: editedTaskData.assignee,
        progreso: editedTaskData.progress,
        proyectoId: editedTaskData.projectId,
        fechaInicio: editedTaskData.startDate,
        fechaFin: editedTaskData.endDate,
        archivoUrl: columns[colName][index].fileUrl || "",
        comentarios: columns[colName][index].comments || []
      });

      const updatedTasks = [...columns[colName]];
      updatedTasks[index] = {
        ...updatedTasks[index],
        title: editedTaskData.title,
        description: editedTaskData.description,
        assignee: editedTaskData.assignee,
        progress: editedTaskData.progress,
        startDate: editedTaskData.startDate,
        endDate: editedTaskData.endDate,
        projectId: editedTaskData.projectId
      };
      
      setColumns({ ...columns, [colName]: updatedTasks });
      setEditingTask(null);
      
      setSuccess('Tarea actualizada exitosamente');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Error al actualizar la tarea');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  /* ------------ Funciones de archivo ------------ */
  const handleAddFile = (task) => {
    setSelectedTask(task);
    setFileUrl(task.fileUrl || "");
    setShowFileModal(true);
  };

  const saveFileUrl = async () => {
    if (!selectedTask) return;

    try {
      setLoading(true);
      
      await api.put(`/tareas/archivoUrl/${selectedTask.id}`, {
        titulo: selectedTask.title,
        descripcion: selectedTask.description,
        estado: selectedTask.status,
        prioridad: selectedTask.priority,
        responsable: selectedTask.assignee,
        progreso: selectedTask.progress,
        proyectoId: selectedTask.projectId,
        fechaInicio: selectedTask.startDate,
        fechaFin: selectedTask.endDate,
        archivoUrl: fileUrl
      });

      // Actualizar la tarea en el estado local
      const updatedColumns = { ...columns };
      Object.keys(updatedColumns).forEach(columnName => {
        updatedColumns[columnName] = updatedColumns[columnName].map(task => 
          task.id === selectedTask.id 
            ? { ...task, fileUrl: fileUrl }
            : task
        );
      });
      setColumns(updatedColumns);

      setShowFileModal(false);
      setSelectedTask(null);
      setFileUrl("");
      setSuccess('Archivo adjuntado correctamente');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Error saving file URL:', error);
      setError('Error al guardar el archivo');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  /* ------------ Funciones de comentarios ------------ */
  const openComments = (task) => {
    setSelectedTask(task);
    setShowComments(true);
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      
      const commentObj = { 
        author: currentUser,
        text: newComment,
        timestamp: new Date().toISOString()
      };
      
      const updatedComments = [...(selectedTask.comments || []), commentObj];

      await api.put(`/tareas/${selectedTask.id}`, {
        titulo: selectedTask.title,
        descripcion: selectedTask.description,
        estado: selectedTask.status,
        prioridad: selectedTask.priority,
        responsable: selectedTask.assignee,
        progreso: selectedTask.progress,
        proyectoId: selectedTask.projectId,
        fechaInicio: selectedTask.startDate,
        fechaFin: selectedTask.endDate,
        archivoUrl: selectedTask.fileUrl || "",
        comentarios: updatedComments
      });

      // Actualizar la tarea en el estado local
      const updatedColumns = { ...columns };
      Object.keys(updatedColumns).forEach(columnName => {
        updatedColumns[columnName] = updatedColumns[columnName].map(task => 
          task.id === selectedTask.id 
            ? { ...task, comments: updatedComments }
            : task
        );
      });
      setColumns(updatedColumns);

      setSelectedTask({
        ...selectedTask,
        comments: updatedComments,
      });

      setNewComment("");
      setSuccess('Comentario agregado exitosamente');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Error al agregar comentario');
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
    localStorage.setItem("kanban-theme", theme);
  }, [theme]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditedTaskData({
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      progress: task.progress,
      startDate: task.startDate,
      endDate: task.endDate,
      documents: task.documents,
      projectId: task.projectId
    });
  };

  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} días` : "Vencido";
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.nombre : "Sin proyecto";
  };

  const openDocuments = (task) => {
    setSelectedTask(task);
    setShowDocuments(true);
  };

  const columnStyle = {
    "Por hacer": "border-danger bg-danger-subtle",
    "En progreso": "border-warning bg-warning-subtle",
    "En revisión": "border-info bg-info-subtle",
    "Hecho": "border-success bg-success-subtle",
  };

  const columnIcon = {
    "Por hacer": "📋",
    "En progreso": "⚡",
    "En revisión": "👀",
    "Hecho": "✅",
  };

  const priorityBadge = {
    alta: "bg-danger",
    media: "bg-warning",
    baja: "bg-success",
  };

  const labelColor = theme === "light" ? "text-dark" : "text-white";

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="kanban-modern-container">
      <button
        className="btn btn-outline-secondary position-fixed theme-toggle"
        onClick={toggleTheme}
      >
        <i
          className={`bi ${
            theme === "light" ? "bi-moon-stars-fill" : "bi-sun-fill"
          } theme-icon`}
        />
      </button>

      <button
        className="btn btn-outline-secondary position-fixed back-button"
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left" />
      </button>

      <div className="container-fluid py-4">
        <header className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-2">Tablero Kanban Superadmin</h1>
          <p className="lead text-muted">
            Gestión avanzada de tareas para Superadministrador
          </p>
          
          {/* Botón para ir a Lista de Proyectos */}
          <div className="mt-4">
            <div className="alert alert-info d-inline-block mb-3">
              <i className="bi bi-info-circle me-2"></i>
              <span className="fw-semibold">Para un mejor control de las tareas y proyectos, utiliza la vista completa</span>
            </div>
            <div>
              <RBButton 
                variant="outline-primary" 
                size="lg"
                onClick={() => navigate('/listaProyectos')}
                className="px-4 py-2"
              >
                <i className="bi bi-list-ul me-2"></i>
                Ir a Lista de Proyectos
              </RBButton>
            </div>
          </div>
        </header>

        {/* Alertas */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess(null)}>
            <i className="bi bi-check-circle me-2"></i>
            {success}
          </Alert>
        )}

        {/* Formulario nueva tarea */}
        {selectedProject && (
          <section className="card shadow-lg border-0 mb-5">
            <div className={`card-header bg-gradient ${labelColor}`}>
              <h3 className="card-title mb-0">
                <i className="bi bi-plus-circle me-2" /> Nueva tarea para {selectedProject.nombre}
              </h3>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-lg-3 col-md-6">
                  <label className={`form-label fw-semibold ${labelColor}`}>Título</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Título de la tarea"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                <div className="col-lg-3 col-md-6">
                  <label className={`form-label fw-semibold ${labelColor}`}>Descripción</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Descripción"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  />
                </div>
                <div className="col-lg-2 col-md-4">
                  <label className={`form-label fw-semibold ${labelColor}`}>Estado</label>
                  <select
                    className="form-select form-select-lg"
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                  >
                    {Object.keys(columns).map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-2 col-md-4">
                  <label className={`form-label fw-semibold ${labelColor}`}>Prioridad</label>
                  <select
                    className="form-select form-select-lg"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                  </select>
                </div>
                <div className="col-lg-2 col-md-4">
                  <label className={`form-label fw-semibold ${labelColor}`}>Responsable</label>
                  <select
                    className="form-select form-select-lg"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  >
                    {members.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-3 col-md-6">
                  <label className={`form-label fw-semibold ${labelColor}`}>Fecha Inicio</label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    value={newTask.startDate}
                    onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                  />
                </div>
                <div className="col-lg-3 col-md-6">
                  <label className={`form-label fw-semibold ${labelColor}`}>Fecha Fin</label>
                  <input
                    type="date"
                    className="form-control form-control-lg"
                    value={newTask.endDate}
                    onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
                  />
                </div>
                <div className="col-lg-2 col-md-4 d-grid">
                  <label className="form-label fw-semibold invisible">Añadir</label>
                  <button
                    className="btn btn-primary btn-lg fw-bold"
                    onClick={handleAddTask}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tablero Kanban */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="row g-4">
            {Object.entries(columns).map(([colName, tasks]) => (
              <div className="col-xl-3 col-lg-6 col-md-6" key={colName}>
                <div
                  className={`card h-100 shadow-lg border-3 ${columnStyle[colName]}`}
                >
                  <div className="card-header text-center py-3">
                    <h4 className="card-title mb-0 fw-bold d-flex align-items-center justify-content-between text-dark">
                      <span className="d-flex align-items-center">
                        <span className="fs-3 me-2">{columnIcon[colName]}</span>
                        {colName}
                      </span>
                      <span className="badge bg-white text-dark fs-6">
                        {tasks.length}
                      </span>
                    </h4>
                  </div>
                  <Droppable droppableId={colName}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`card-body kanban-drop-zone ${
                          snapshot.isDraggingOver ? "drag-over" : ""
                        }`}
                        style={{ minHeight: "420px" }}
                      >
                        {tasks.length === 0 ? (
                          <div className="text-center text-muted py-4">
                            <i className="bi bi-inbox display-1 opacity-25"></i>
                            <p className="mt-2 small">No hay tareas</p>
                          </div>
                        ) : (
                          tasks.map((task, index) => (
                            <Draggable
                              draggableId={task.id.toString()}
                              index={index}
                              key={task.id}
                            >
                              {(prov, snap) => (
                                <div
                                  ref={prov.innerRef}
                                  {...prov.draggableProps}
                                  {...prov.dragHandleProps}
                                  className={`card mb-3 shadow-sm task-card ${
                                    snap.isDragging ? "dragging" : ""
                                  }`}
                                >
                                  <div className="card-body p-3">
                                    <div className="task-project">
                                      {getProjectName(task.projectId)}
                                    </div>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                      {editingTask === task.id ? (
                                        <input
                                          type="text"
                                          className="form-control form-control-sm"
                                          value={editedTaskData.title}
                                          onChange={(e) =>
                                            setEditedTaskData({
                                              ...editedTaskData,
                                              title: e.target.value,
                                            })
                                          }
                                        />
                                      ) : (
                                        <h6 className="card-title fw-bold mb-0 flex-grow-1">
                                          {task.title}
                                        </h6>
                                      )}
                                      <div className="d-flex align-items-center gap-1">
                                        <button
                                          className="btn btn-sm btn-outline-primary"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddFile(task);
                                          }}
                                          title="Adjuntar archivo"
                                        >
                                          <i className="bi bi-paperclip"></i>
                                        </button>
                                        {editingTask === task.id ? (
                                          <button
                                            className="btn btn-sm btn-success ms-2"
                                            onClick={() => saveEditedTask(colName, index)}
                                          >
                                            <i className="bi bi-check-lg" />
                                          </button>
                                        ) : (
                                          <button
                                            className="btn btn-sm btn-outline-primary ms-2"
                                            onClick={() => startEditing(task)}
                                          >
                                            <i className="bi bi-pencil" />
                                          </button>
                                        )}
                                        <button
                                          className="btn btn-sm btn-outline-danger ms-2"
                                          onClick={() => handleDeleteTask(colName, index)}
                                        >
                                          <i className="bi bi-x" />
                                        </button>
                                      </div>
                                    </div>

                                    {editingTask === task.id ? (
                                      <textarea
                                        className="form-control form-control-sm mb-2"
                                        value={editedTaskData.description}
                                        onChange={(e) =>
                                          setEditedTaskData({
                                            ...editedTaskData,
                                            description: e.target.value,
                                          })
                                        }
                                      />
                                    ) : (
                                      <p className="card-text text-muted small mb-3">
                                        {task.description}
                                      </p>
                                    )}

                                    {editingTask === task.id ? (
                                      <>
                                        <div className="mb-2">
                                          <label className="form-label small fw-semibold">
                                            Responsable
                                          </label>
                                          <select
                                            className="form-select form-select-sm"
                                            value={editedTaskData.assignee}
                                            onChange={(e) =>
                                              setEditedTaskData({
                                                ...editedTaskData,
                                                assignee: e.target.value,
                                              })
                                            }
                                          >
                                            {members.map((m) => (
                                              <option key={m}>{m}</option>
                                            ))}
                                          </select>
                                        </div>
                                        <div className="mb-2">
                                          <label className="form-label small fw-semibold">
                                            Progreso: {editedTaskData.progress}%
                                          </label>
                                          <input
                                            type="range"
                                            min={0}
                                            max={100}
                                            value={editedTaskData.progress}
                                            className="form-range"
                                            onChange={(e) =>
                                              setEditedTaskData({
                                                ...editedTaskData,
                                                progress: parseInt(e.target.value, 10),
                                              })
                                            }
                                          />
                                        </div>
                                        <div className="date-input-group mb-2">
                                          <div className="date-input">
                                            <label className="form-label small fw-semibold">
                                              Inicio
                                            </label>
                                            <input
                                              type="date"
                                              className="form-control form-control-sm"
                                              value={editedTaskData.startDate}
                                              onChange={(e) =>
                                                setEditedTaskData({
                                                  ...editedTaskData,
                                                  startDate: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                          <div className="date-input">
                                            <label className="form-label small fw-semibold">
                                              Fin
                                            </label>
                                            <input
                                              type="date"
                                              className="form-control form-control-sm"
                                              value={editedTaskData.endDate}
                                              onChange={(e) =>
                                                setEditedTaskData({
                                                  ...editedTaskData,
                                                  endDate: e.target.value,
                                                })
                                              }
                                            />
                                          </div>
                                        </div>
                                      </>
                                    ) : (
                                      <div className="mb-2 d-flex justify-content-between align-items-center">
                                        <span className="small text-muted d-flex align-items-center">
                                          <i className="bi bi-person-circle me-1" />
                                          {task.assignee}
                                        </span>
                                        <span
                                          className={`badge ${priorityBadge[task.priority]} me-2`}
                                        >
                                          {task.priority}
                                        </span>
                                      </div>
                                    )}

                                    <div className="mb-2">
                                      <div className="progress" style={{ height: "6px" }}>
                                        <div
                                          className="progress-bar bg-primary"
                                          role="progressbar"
                                          style={{ width: `${task.progress}%` }}
                                          aria-valuenow={task.progress}
                                          aria-valuemin="0"
                                          aria-valuemax="100"
                                        />
                                      </div>
                                    </div>

                                    {!editingTask && task.endDate && (
                                      <div className="task-dates">
                                        <span className="text-muted">
                                          {new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}
                                        </span>
                                        <span className="days-remaining">
                                          {calculateDaysRemaining(task.endDate)}
                                        </span>
                                      </div>
                                    )}

                                    {task.documents && task.documents.length > 0 && (
                                      <div className="documents-container">
                                        <small className="text-muted">Documentos:</small>
                                        {task.documents.map((doc, idx) => (
                                          <Badge 
                                            key={idx} 
                                            bg="light" 
                                            text="dark" 
                                            className="document-badge me-1"
                                            onClick={() => openDocuments(task)}
                                          >
                                            <i className="bi bi-file-earmark me-1" />
                                            {doc.split('.')[0]}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}

                                    {/* Mostrar archivo adjunto si existe */}
                                    {task.fileUrl && (
                                      <div className="mb-2">
                                        <a 
                                          href={task.fileUrl} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="btn btn-sm btn-outline-success d-flex align-items-center"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <i className="bi bi-file-earmark-text me-1"></i>
                                          Ver archivo
                                        </a>
                                      </div>
                                    )}

                                    <div className="d-flex align-items-center justify-content-between mt-2">
                                      <RBButton
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => openComments(task)}
                                      >
                                        <i className="bi bi-chat-left-text me-1" />
                                        {task.comments ? task.comments.length : 0}
                                      </RBButton>
                                      <small className="text-muted">ID: {task.id}</small>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Modal para adjuntar archivo */}
      <Modal show={showFileModal} onHide={() => setShowFileModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-paperclip me-2"></i>
            Adjuntar Archivo - {selectedTask?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RBForm>
            <RBForm.Group className="mb-3">
              <RBForm.Label className="fw-semibold">
                <i className="bi bi-link-45deg me-2"></i>
                URL del archivo de Google Drive
              </RBForm.Label>
              <RBForm.Control
                type="url"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
                placeholder="https://drive.google.com/file/d/..."
              />
              <RBForm.Text className="text-muted">
                Pega aquí el enlace compartible de tu archivo de Google Drive
              </RBForm.Text>
            </RBForm.Group>
            {fileUrl && (
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Vista previa:</strong>
                <br />
                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                  {fileUrl}
                </a>
              </div>
            )}
          </RBForm>
        </Modal.Body>
        <Modal.Footer>
          <RBButton variant="outline-secondary" onClick={() => setShowFileModal(false)}>
            Cancelar
          </RBButton>
          <RBButton 
            variant="primary" 
            onClick={saveFileUrl}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Guardando...
              </>
            ) : (
              <>
                <i className="bi bi-check me-2"></i>
                Guardar
              </>
            )}
          </RBButton>
        </Modal.Footer>
      </Modal>

      {/* Modal de comentarios actualizado */}
      <Modal show={showComments} onHide={() => setShowComments(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-chat-left-text me-2"></i>
            Comentarios - {selectedTask?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask && (
            <>
              {/* Información del archivo adjunto si existe */}
              {selectedTask.fileUrl && (
                <div className="alert alert-info mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <i className="bi bi-paperclip me-2"></i>
                      <strong>Archivo adjunto:</strong>
                    </div>
                    <a 
                      href={selectedTask.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="bi bi-box-arrow-up-right me-1"></i>
                      Abrir archivo
                    </a>
                  </div>
                </div>
              )}

              {/* Lista de comentarios */}
              <div className="mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {(!selectedTask.comments || selectedTask.comments.length === 0) ? (
                  <div className="text-center text-muted py-4">
                    <i className="bi bi-chat-left display-1 opacity-25"></i>
                    <p className="mt-2">No hay comentarios</p>
                    <small>Sé el primero en comentar esta tarea</small>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {selectedTask.comments.map((comentario, index) => (
                      <div key={index} className="list-group-item border-0 px-0 py-3">
                        <div className="d-flex align-items-start">
                          <div className="bg-primary bg-opacity-10 rounded-circle p-2 me-3 flex-shrink-0">
                            <i className="bi bi-person text-primary"></i>
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <h6 className="mb-0 fw-bold">{comentario.author}</h6>
                              {comentario.timestamp && (
                                <small className="text-muted">
                                  {new Date(comentario.timestamp).toLocaleDateString()}
                                </small>
                              )}
                            </div>
                            <p className="mb-0 text-muted">{comentario.text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Formulario para nuevo comentario */}
              <RBForm onSubmit={(e) => { e.preventDefault(); addComment(); }}>
                <RBForm.Group className="mb-3">
                  <RBForm.Label className="fw-semibold">
                    <i className="bi bi-chat-left-dots me-2"></i>
                    Nuevo comentario
                  </RBForm.Label>
                  <RBForm.Control
                    as="textarea"
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe tu comentario aquí..."
                  />
                </RBForm.Group>
                <div className="d-flex justify-content-end gap-2">
                  <RBButton 
                    variant="outline-secondary" 
                    onClick={() => setShowComments(false)}
                  >
                    Cerrar
                  </RBButton>
                  <RBButton 
                    type="submit" 
                    variant="primary"
                    disabled={loading || !newComment.trim()}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Enviar Comentario
                      </>
                    )}
                  </RBButton>
                </div>
              </RBForm>
            </>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showDocuments} onHide={() => setShowDocuments(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Documentos de la tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask && (
            <>
              <h5 className="fw-semibold mb-3">{selectedTask.title}</h5>
              <ListGroup>
                {selectedTask.documents.length === 0 ? (
                  <ListGroup.Item className="text-muted">
                    No hay documentos adjuntos
                  </ListGroup.Item>
                ) : (
                  selectedTask.documents.map((doc, idx) => (
                    <ListGroup.Item key={idx} className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-file-earmark me-2" />
                        {doc}
                      </div>
                      <div>
                        <RBButton variant="outline-primary" size="sm" className="me-2">
                          <i className="bi bi-eye me-1" /> Ver
                        </RBButton>
                        <RBButton variant="outline-success" size="sm">
                          <i className="bi bi-download me-1" /> Descargar
                        </RBButton>
                      </div>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
              <div className="mt-3">
                <RBButton variant="primary">
                  <i className="bi bi-plus-circle me-1" /> Agregar documento
                </RBButton>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SuperadminKanban;
