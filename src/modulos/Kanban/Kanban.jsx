// Kanban.jsx
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Kanban.css";

const initialData = {
  "Por hacer": [
    { id: "1", title: "Diseñar login", description: "Pantalla limpia de inicio", priority: "alta" },
  ],
  "En progreso": [
    { id: "2", title: "Backend usuarios", description: "Crear endpoints REST", priority: "media" },
  ],
  "En revisión": [],
  "Hecho": [
    { id: "3", title: "Diseño final", description: "Mockups aprobados", priority: "baja" },
  ],
};

const Kanban = () => {
  const [columns, setColumns] = useState(initialData);
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "Por hacer", priority: "media" });
  const [theme, setTheme] = useState("light");
  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskData, setEditedTaskData] = useState({ title: "", description: "" });

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

  const navigate = useNavigate();

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

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    const task = { ...newTask, id: Date.now().toString() };
    setColumns({ ...columns, [newTask.status]: [...columns[newTask.status], task] });
    setNewTask({ title: "", description: "", status: "Por hacer", priority: "media" });
  };

  const handleDeleteTask = (col, idx) => {
    const updated = { ...columns };
    updated[col].splice(idx, 1);
    setColumns(updated);
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditedTaskData({ title: task.title, description: task.description });
  };

  const saveEditedTask = (colName, index) => {
    const updatedTasks = [...columns[colName]];
    updatedTasks[index] = {
      ...updatedTasks[index],
      title: editedTaskData.title,
      description: editedTaskData.description,
    };
    setColumns({ ...columns, [colName]: updatedTasks });
    setEditingTask(null);
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

  return (
    <div className="kanban-modern-container">
      <button className="btn btn-outline-secondary position-fixed theme-toggle" onClick={toggleTheme}>
        <i className={`bi ${theme === "light" ? "bi-moon-stars-fill" : "bi-sun-fill"} theme-icon`} />
      </button>

      <button className="btn btn-outline-secondary position-fixed back-button" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left" />
      </button>

      <div className="container-fluid py-4">
        <header className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-2">Kanban Board</h1>
          <p className="lead text-muted">Gestiona tus tareas de forma visual y eficiente</p>
        </header>

        <section className="card shadow-lg border-0 mb-5">
          <div className={`card-header bg-gradient ${labelColor}`}>
            <h3 className="card-title mb-0">
              <i className="bi bi-plus-circle me-2" /> Nueva tarea
            </h3>
          </div>
          <div className="card-body">
            <div className="row g-3">
              {['title', 'description'].map((field, i) => (
                <div key={field} className="col-lg-3 col-md-6">
                  <label className={`form-label fw-semibold ${labelColor}`}>{field === 'title' ? 'Título' : 'Descripción'}</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder={field === 'title' ? 'Título de la tarea' : 'Descripción'}
                    value={newTask[field]}
                    onChange={(e) => setNewTask({ ...newTask, [field]: e.target.value })}
                  />
                </div>
              ))}
              <div className="col-lg-2 col-md-4">
                <label className={`form-label fw-semibold ${labelColor}`}>Columna</label>
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
              <div className="col-lg-2 col-md-4 d-grid">
                <label className={`form-label fw-semibold invisible ${labelColor}`}>Añadir</label>
                <button className="btn btn-primary btn-lg fw-bold" onClick={handleAddTask}>Agregar</button>
              </div>
            </div>
          </div>
        </section>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="row g-4">
            {Object.entries(columns).map(([colName, tasks]) => (
              <div className="col-xl-3 col-lg-6 col-md-6" key={colName}>
                <div className={`card h-100 shadow-lg border-3 ${columnStyle[colName]}`}>
                  <div className="card-header text-center py-3">
<h4 className="card-title mb-0 fw-bold d-flex align-items-center justify-content-between text-dark">
                      <span className="d-flex align-items-center">
                        <span className="fs-3 me-2">{columnIcon[colName]}</span>
                        {colName}
                      </span>
                      <span className="badge bg-white text-dark fs-6">{tasks.length}</span>
                    </h4>
                  </div>
                  <Droppable droppableId={colName}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`card-body kanban-drop-zone ${snapshot.isDraggingOver ? "drag-over" : ""}`}
                        style={{ minHeight: "420px" }}
                      >
                        {tasks.map((task, index) => (
                          <Draggable draggableId={task.id} index={index} key={task.id}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`card mb-3 shadow-sm task-card ${snapshot.isDragging ? "dragging" : ""}`}
                              >
                                <div className="card-body p-3">
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    {editingTask === task.id ? (
                                      <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        value={editedTaskData.title}
                                        onChange={(e) => setEditedTaskData({ ...editedTaskData, title: e.target.value })}
                                      />
                                    ) : (
                                      <h6 className="card-title fw-bold mb-0 flex-grow-1">{task.title}</h6>
                                    )}
                                    <div className="d-flex">
                                      {editingTask === task.id ? (
                                        <button className="btn btn-sm btn-success ms-2" onClick={() => saveEditedTask(colName, index)}>
                                          <i className="bi bi-check-lg" />
                                        </button>
                                      ) : (
                                        <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => startEditing(task)}>
                                          <i className="bi bi-pencil" />
                                        </button>
                                      )}
                                      <button className="btn btn-sm btn-outline-danger ms-2" onClick={() => handleDeleteTask(colName, index)}>
                                        <i className="bi bi-x" />
                                      </button>
                                    </div>
                                  </div>
                                  {editingTask === task.id ? (
                                    <textarea
                                      className="form-control form-control-sm mb-2"
                                      value={editedTaskData.description}
                                      onChange={(e) => setEditedTaskData({ ...editedTaskData, description: e.target.value })}
                                    />
                                  ) : (
                                    <p className="card-text text-muted small mb-3">{task.description}</p>
                                  )}
                                  <div className="d-flex align-items-center justify-content-between">
                                    <span className={`badge ${priorityBadge[task.priority]} me-2`}>{task.priority}</span>
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
    </div>
  );
};

export default Kanban;
