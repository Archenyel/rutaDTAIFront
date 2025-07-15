// Kanban.jsx – vista para Administrador con asignación de responsables, progreso y comentarios
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Button as RBButton,
  Form as RBForm,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../Kanban/AdminKanban/AdminnKanban.css";

/* -------------------- Miembros -------------------- */
const members = [
  "Administrador",
  "Ana García",
  "Carlos López",
  "María Rodríguez",
  "Diego Martínez",
];

/* -------------------- Datos iniciales -------------------- */
const initialData = {
  "Por hacer": [
    {
      id: "1",
      title: "Diseñar login",
      description: "Pantalla limpia de inicio",
      priority: "alta",
      assignee: "Administrador",
      progress: 0,
      comments: [],                             // <- ahora serán objetos {author, text}
    },
  ],
  "En progreso": [
    {
      id: "2",
      title: "Backend usuarios",
      description: "Crear endpoints REST",
      priority: "media",
      assignee: "Ana García",
      progress: 40,
      comments: [{ author: "Ana García", text: "Pendiente validar JWT" }],
    },
  ],
  "En revisión": [],
  "Hecho": [
    {
      id: "3",
      title: "Diseño final",
      description: "Mockups aprobados",
      priority: "baja",
      assignee: "Carlos López",
      progress: 100,
      comments: [{ author: "Carlos López", text: "Aprobado por el cliente" }],
    },
  ],
};

const AdminnKanban = () => {
  /* ------------ Usuario actual (ajusta según tu auth) ------------ */
  const currentUser = "Administrador";

  const [columns, setColumns] = useState(initialData);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "Por hacer",
    priority: "media",
    assignee: "Administrador",
    progress: 0,
  });
  const [theme, setTheme] = useState("light");
  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskData, setEditedTaskData] = useState({
    title: "",
    description: "",
    assignee: "Administrador",
    progress: 0,
  });
  const [showComments, setShowComments] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newComment, setNewComment] = useState("");

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("kanban-theme", theme);
  }, [theme]);

  useEffect(() => {
    const saved = localStorage.getItem("kanban-theme");
    if (saved) setTheme(saved);
  }, []);

  const navigate = useNavigate();

  /* -------------------- Drag & Drop -------------------- */
  const handleDragEnd = ({ source, destination }) => {
    if (!destination) return;
    const srcTasks = Array.from(columns[source.droppableId]);
    const destTasks = Array.from(columns[destination.droppableId]);
    const [moved] = srcTasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      srcTasks.splice(destination.index, 0, moved);
      setColumns({ ...columns, [source.droppableId]: srcTasks });
    } else {
      destTasks.splice(destination.index, 0, moved);
      setColumns({
        ...columns,
        [source.droppableId]: srcTasks,
        [destination.droppableId]: destTasks,
      });
    }
  };

  /* -------------------- CRUD de tareas -------------------- */
  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    const task = { ...newTask, id: Date.now().toString(), comments: [] };
    setColumns({
      ...columns,
      [newTask.status]: [...columns[newTask.status], task],
    });
    setNewTask({
      title: "",
      description: "",
      status: "Por hacer",
      priority: "media",
      assignee: "Administrador",
      progress: 0,
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

  /* -------------------- Comentarios -------------------- */
  const openComments = (task) => {
    setSelectedTask(task);
    setShowComments(true);
  };

  const addComment = () => {
    if (!newComment.trim()) return;

    // 1. Localizar la columna de la tarea seleccionada
    const colName = Object.keys(columns).find((c) =>
      columns[c].some((t) => t.id === selectedTask.id)
    );
    if (!colName) return;

    // 2. Nuevo comentario con autor
    const commentObj = { author: currentUser, text: newComment };

    // 3. Actualizar columnas
    const updatedTasks = columns[colName].map((t) =>
      t.id === selectedTask.id
        ? { ...t, comments: [...t.comments, commentObj] }
        : t
    );
    setColumns({ ...columns, [colName]: updatedTasks });

    // 4. Refrescar el modal DESPUÉS de 4 s
    const updatedSelected = {
      ...selectedTask,
      comments: [...selectedTask.comments, commentObj],
    };
    setTimeout(() => {
      setSelectedTask(updatedSelected);
    }, 4000);

    setNewComment("");
  };

  /* -------------------- Estilos / utilidades -------------------- */
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
      {/* ---------- BOTONES FIJOS ---------- */}
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

      {/* ---------- HEADER ---------- */}
      <div className="container-fluid py-4">
        <header className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-2">Kanban Board</h1>
          <p className="lead text-muted">
            Gestiona tus tareas de forma visual y eficiente
          </p>
        </header>

        {/* ---------- NUEVA TAREA ---------- */}
        <section className="card shadow-lg border-0 mb-5">
          <div className={`card-header bg-gradient ${labelColor}`}>
            <h3 className="card-title mb-0">
              <i className="bi bi-plus-circle me-2" /> Nueva tarea
            </h3>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {/* Título y Descripción */}
              {["title", "description"].map((field) => (
                <div key={field} className="col-lg-3 col-md-6">
                  <label className={`form-label fw-semibold ${labelColor}`}>
                    {field === "title" ? "Título" : "Descripción"}
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder={
                      field === "title"
                        ? "Título de la tarea"
                        : "Descripción"
                    }
                    value={newTask[field]}
                    onChange={(e) =>
                      setNewTask({ ...newTask, [field]: e.target.value })
                    }
                  />
                </div>
              ))}

              {/* Columna */}
              <div className="col-lg-2 col-md-4">
                <label className={`form-label fw-semibold ${labelColor}`}>
                  Columna
                </label>
                <select
                  className="form-select form-select-lg"
                  value={newTask.status}
                  onChange={(e) =>
                    setNewTask({ ...newTask, status: e.target.value })
                  }
                >
                  {Object.keys(columns).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Prioridad */}
              <div className="col-lg-2 col-md-4">
                <label className={`form-label fw-semibold ${labelColor}`}>
                  Prioridad
                </label>
                <select
                  className="form-select form-select-lg"
                  value={newTask.priority}
                  onChange={(e) =>
                    setNewTask({ ...newTask, priority: e.target.value })
                  }
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              {/* Responsable */}
              <div className="col-lg-2 col-md-4">
                <label className={`form-label fw-semibold ${labelColor}`}>
                  Responsable
                </label>
                <select
                  className="form-select form-select-lg"
                  value={newTask.assignee}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignee: e.target.value })
                  }
                >
                  {members.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Botón Agregar */}
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

        {/* ---------- TABLERO ---------- */}
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
                                  {/* ----- Título + acciones ----- */}
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

                                  {/* ----- Descripción ----- */}
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

                                  {/* ----- Responsable & Prioridad ----- */}
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

                                  {/* ----- Barra de progreso ----- */}
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

                                  {/* ----- Comentarios y ID ----- */}
                                  <div className="d-flex align-items-center justify-content-between">
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

      {/* ---------- MODAL COMENTARIOS ---------- */}
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
    </div>
  );
};

export default AdminnKanban;
