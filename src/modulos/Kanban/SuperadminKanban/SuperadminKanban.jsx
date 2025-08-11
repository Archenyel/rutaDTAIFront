import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Button as RBButton,
  Form as RBForm,
  Badge,
  ListGroup
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./SuperadminKanban.css";
import { projectsData, tasksData } from "./Superadmindata";

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
  const [projects, setProjects] = useState(projectsData);
  const [selectedProject, setSelectedProject] = useState(null);
  const [filteredColumns, setFilteredColumns] = useState(initialData);
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
  const [showComments, setShowComments] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [showDocuments, setShowDocuments] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  useEffect(() => {
    // Cargar datos iniciales
    const initialColumns = JSON.parse(JSON.stringify(initialData));
    tasksData.forEach(task => {
      initialColumns[task.status].push(task);
    });
    setColumns(initialColumns);
    setFilteredColumns(initialColumns);
  }, []);

  useEffect(() => {
    // Filtrar columnas cuando cambia el proyecto seleccionado
    if (!selectedProject) {
      setFilteredColumns(columns);
      return;
    }

    const filtered = {
      "Por hacer": columns["Por hacer"].filter(task => task.projectId === selectedProject.id),
      "En progreso": columns["En progreso"].filter(task => task.projectId === selectedProject.id),
      "En revisión": columns["En revisión"].filter(task => task.projectId === selectedProject.id),
      "Hecho": columns["Hecho"].filter(task => task.projectId === selectedProject.id)
    };
    setFilteredColumns(filtered);
  }, [selectedProject, columns]);

  useEffect(() => {
    // Aplicar filtros adicionales
    const applyFilters = () => {
      let result = JSON.parse(JSON.stringify(columns));
      
      if (selectedProject) {
        Object.keys(result).forEach(status => {
          result[status] = result[status].filter(task => task.projectId === selectedProject.id);
        });
      }

      if (filterStatus !== "all") {
        Object.keys(result).forEach(status => {
          if (status !== filterStatus) {
            result[status] = [];
          }
        });
      }

      if (filterPriority !== "all") {
        Object.keys(result).forEach(status => {
          result[status] = result[status].filter(task => task.priority === filterPriority);
        });
      }

      setFilteredColumns(result);
    };

    applyFilters();
  }, [selectedProject, columns, filterStatus, filterPriority]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("kanban-theme", theme);
  }, [theme]);

  useEffect(() => {
    const saved = localStorage.getItem("kanban-theme");
    if (saved) setTheme(saved);
  }, []);

  const navigate = useNavigate();

  const handleDragEnd = (result) => {
  const { source, destination } = result;

  // Si no hay destino o es el mismo lugar, no hacer nada
  if (!destination || 
      (source.droppableId === destination.droppableId && 
       source.index === destination.index)) {
    return;
  }

  // Copiar el estado actual
  const newColumns = JSON.parse(JSON.stringify(columns));
  
  // Obtener la tarea movida
  const [movedTask] = newColumns[source.droppableId].splice(source.index, 1);
  
  // Actualizar el estado de la tarea si cambia de columna
  if (source.droppableId !== destination.droppableId) {
    movedTask.status = destination.droppableId;
  }

  newColumns[destination.droppableId].splice(destination.index, 0, movedTask);

  setColumns(newColumns);
};

  const handleAddTask = () => {
  if (!newTask.title.trim() || !newTask.startDate || !newTask.endDate || !selectedProject) return;
  
  const task = { 
    ...newTask, 
    id: Date.now().toString(), 
    comments: [],
    documents: [],
    projectId: selectedProject.id,
    status: newTask.status 
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
};

  const handleDeleteTask = (col, idx) => {
    const updated = { ...columns };
    updated[col].splice(idx, 1);
    setColumns(updated);
  };

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

  const saveEditedTask = (colName, index) => {
    const updatedTasks = [...columns[colName]];
    updatedTasks[index] = {
      ...updatedTasks[index],
      ...editedTaskData,
    };
    setColumns({ ...columns, [colName]: updatedTasks });
    setEditingTask(null);
  };

  const openComments = (task) => {
    setSelectedTask(task);
    setShowComments(true);
  };

  const openDocuments = (task) => {
    setSelectedTask(task);
    setShowDocuments(true);
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    const colName = Object.keys(columns).find((c) =>
      columns[c].some((t) => t.id === selectedTask.id)
    );
    if (!colName) return;

    const commentObj = { author: currentUser, text: newComment };
    const updatedTasks = columns[colName].map((t) =>
      t.id === selectedTask.id
        ? { ...t, comments: [...t.comments, commentObj] }
        : t
    );
    setColumns({ ...columns, [colName]: updatedTasks });

    const updatedSelected = {
      ...selectedTask,
      comments: [...selectedTask.comments, commentObj],
    };
    setTimeout(() => {
      setSelectedTask(updatedSelected);
    }, 4000);

    setNewComment("");
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
    return project ? project.name : "Sin proyecto";
  };

  const columnStyle = {
    "Por hacer": "border-danger bg-danger-subtle",
    "En progreso": "border-warning bg-warning-subtle",
    "En revisión": "border-info bg-info-subtle",
    Hecho: "border-success bg-success-subtle",
  };

  const columnIcon = {
    "Por hacer": "📋",
    "En progreso": "⚡",
    "En revisión": "👀",
    Hecho: "✅",
  };

  const priorityBadge = {
    alta: "bg-danger",
    media: "bg-warning",
    baja: "bg-success",
  };

  const labelColor = theme === "light" ? "text-dark" : "text-white";

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
          <h1 className="display-4 fw-bold mb-2">Tablero Kanban</h1>
          <p className="lead text-muted">
            Gestión avanzada de tareas para Superadministrador
          </p>
        </header>

        {/* Selector de proyecto */}
        <div className="card shadow-lg mb-4">
          <div className={`card-header bg-gradient ${labelColor}`}>
            <h3 className="card-title mb-0">
              <i className="bi bi-folder me-2" /> Seleccionar Proyecto
            </h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <select
                  className="form-select form-select-lg mb-3"
                  value={selectedProject ? selectedProject.id : ""}
                  onChange={(e) => {
                    const projectId = parseInt(e.target.value);
                    setSelectedProject(projects.find(p => p.id === projectId) || null);
                  }}
                >
                  <option value="">Todos los proyectos</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedProject && (
                <div className="col-md-6">
                  <div className="project-info">
                    <h5>{selectedProject.name}</h5>
                    <p>{selectedProject.description}</p>
                    <small>
                      {new Date(selectedProject.startDate).toLocaleDateString()} - {new Date(selectedProject.endDate).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filtros adicionales */}
        <div className="filter-container mb-4">
          <h5 className="mb-3">Filtros</h5>
          <div className="row">
            <div className="col-md-4">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                {Object.keys(columns).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Prioridad</label>
              <select
                className="form-select"
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
              >
                <option value="all">Todas las prioridades</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSelectedProject(null);
                  setFilterStatus("all");
                  setFilterPriority("all");
                }}
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Formulario nueva tarea */}
        {selectedProject && (
          <section className="card shadow-lg border-0 mb-5">
            <div className={`card-header bg-gradient ${labelColor}`}>
              <h3 className="card-title mb-0">
                <i className="bi bi-plus-circle me-2" /> Nueva tarea para {selectedProject.name}
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
            {Object.entries(filteredColumns).map(([colName, tasks]) => (
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
                        {tasks.map((task, index) => (
                          <Draggable
                            draggableId={task.id}
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
                                    <div className="d-flex">
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

                                  <div className="d-flex align-items-center justify-content-between mt-2">
                                    <RBButton
                                      variant="outline-secondary"
                                      size="sm"
                                      onClick={() => openComments(task)}
                                    >
                                      <i className="bi bi-chat-left-text me-1" />
                                      {task.comments.length}
                                    </RBButton>
                                    <small className="text-muted">ID: {task.id}</small>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
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

      <Modal show={showComments} onHide={() => setShowComments(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Comentarios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask && (
            <>
              <div className="mb-3">
                <h5 className="fw-semibold mb-2">{selectedTask.title}</h5>
                <ul className="list-group">
                  {selectedTask.comments.length === 0 && (
                    <li className="list-group-item text-muted">Sin comentarios</li>
                  )}
                  {selectedTask.comments.map((c, i) => (
                    <li key={i} className="list-group-item">
                      <strong>{c.author}:</strong> {c.text}
                    </li>
                  ))}
                </ul>
              </div>
              <RBForm
                onSubmit={(e) => {
                  e.preventDefault();
                  addComment();
                }}
              >
                <RBForm.Control
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Añadir comentario…"
                  className="mb-2"
                />
                <RBButton type="submit">Agregar</RBButton>
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
