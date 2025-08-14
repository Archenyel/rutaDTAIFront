// Kanban.jsx
import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Kanban.css";
import api from "../../api/api";

const Kanban = () => {
  const [columns, setColumns] = useState({
    "Por hacer": [],
    "En progreso": [],
    "En revisión": [],
    "Hecho": []
  });
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proyecto, setProyecto] = useState(null);
  
  // Estados para modal de archivo
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(null);

  // Estados para modal de comentarios
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const { id: proyectoId } = useParams();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

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

  useEffect(() => {
    // Cargar todas las tareas al montar el componente
    loadTareas();
    
    // Solo cargar proyecto si hay proyectoId
    if (proyectoId) {
      loadProyectoData();
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
      
      // Cambiar endpoint para traer las tareas del usuario
      const response = await api.get(`/tareas/usuario/${userId}`);
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
            estado: estado,
            responsable: tarea.responsable || "Sin asignar",
            progress: tarea.progreso || 0,
            fileUrl: tarea.archivoUrl || "",
            comentarios: tarea.comentarios || [],
            estudianteAsignado: tarea.estudianteAsignado || "Sin asignar",
            proyectoId: tarea.proyectoId || proyectoId,
            firmadoPor: tarea.firmadoPor || null,
            fechaFirma: tarea.fechaFirma || null
          });
        }
      });

      setColumns(newColumns);
      
    } catch (error) {
      console.error('Error loading tareas:', error);
      setError(`Error al cargar tareas: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async ({ source, destination }) => {
    if (!destination) return;
    
    // Prevenir que el usuario arrastre tareas al estado "Hecho"
    if (destination.droppableId === "Hecho") {
      setError('No puedes mover tareas directamente al estado "Hecho". Deben ser aprobadas por un administrador.');
      setTimeout(() => setError(null), 5000);
      return;
    }
    
    const srcTasks = Array.from(columns[source.droppableId]);
    const destTasks = Array.from(columns[destination.droppableId]);
    const [moved] = srcTasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      srcTasks.splice(destination.index, 0, moved);
      setColumns({ ...columns, [source.droppableId]: srcTasks });
    } else {
      // Actualizar estado en el backend
      try {
        const updatedTask = { ...moved, estado: destination.droppableId };
        
        await api.put(`/tareas/actualizarEstado/${moved.id}`, {
          titulo: moved.title,
          descripcion: moved.description,
          estado: destination.droppableId,
          prioridad: moved.priority,
          responsable: moved.responsable,
          progreso: moved.progress,
          proyectoId: proyectoId,
          archivoUrl: moved.fileUrl || ""
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
        loadTareas();
      }
    }
  };

  const handleAddFile = (task) => {
    setSelectedTask(task);
    setFileUrl(task.fileUrl || "");
    setSelectedFile(null);
    setShowFileModal(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea un archivo PDF
      if (file.type !== 'application/pdf') {
        setError('Solo se permiten archivos PDF');
        setTimeout(() => setError(null), 3000);
        return;
      }
      setSelectedFile(file);
      setFileUrl(""); // Limpiar URL manual si se selecciona archivo
    }
  };

  const handleUploadToGCS = async () => {
    if (!selectedFile) {
      setError('Por favor, selecciona un archivo PDF primero.');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Envía el archivo al endpoint de backend
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setFileUrl(result.publicUrl);
        setSuccess(`¡Archivo subido con éxito!`);
        setTimeout(() => setSuccess(null), 3000);
        // Guardar automáticamente la URL después de la subida
        await saveFileUrlToTask(result.publicUrl);
      } else {
        setError(`Error del servidor: ${result.error}`);
        setTimeout(() => setError(null), 3000);
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      setError('Hubo un error de conexión al servidor.');
      setTimeout(() => setError(null), 3000);
    } finally {
      setUploading(false);
    }
  };

  const saveFileUrlToTask = async (url = fileUrl) => {
    if (!selectedTask) return;

    try {
      setLoading(true);
      
      await api.put(`/tareas/archivoUrl/${selectedTask.id}`, {
        titulo: selectedTask.title,
        descripcion: selectedTask.description,
        estado: selectedTask.estado || "Por hacer",
        prioridad: selectedTask.priority,
        responsable: selectedTask.responsable,
        progreso: selectedTask.progress,
        proyectoId: proyectoId,
        archivoUrl: url
      });

      // Actualizar la tarea en el estado local
      const updatedColumns = { ...columns };
      Object.keys(updatedColumns).forEach(columnName => {
        updatedColumns[columnName] = updatedColumns[columnName].map(task => 
          task.id === selectedTask.id 
            ? { ...task, fileUrl: url }
            : task
        );
      });
      setColumns(updatedColumns);

      setShowFileModal(false);
      setSelectedTask(null);
      setFileUrl("");
      setSelectedFile(null);
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
        author: userName,
        text: newComment,
        timestamp: new Date().toISOString()
      };
      
      const updatedComments = [...(selectedTask.comentarios || []), commentObj];

      await api.put(`/tareas/${selectedTask.id}`, {
        titulo: selectedTask.title,
        estudianteAsignado: selectedTask.estudianteAsignado,
        estado: selectedTask.estado || "Por hacer",
        descripcion: selectedTask.description,
        prioridad: selectedTask.priority,
        responsable: selectedTask.responsable,
        progreso: selectedTask.progress,
        proyectoId: selectedTask.proyectoId,
        archivoUrl: selectedTask.fileUrl || "",
        comentarios: updatedComments
      });

      // Actualizar la tarea en el estado local
      const updatedColumns = { ...columns };
      Object.keys(updatedColumns).forEach(columnName => {
        updatedColumns[columnName] = updatedColumns[columnName].map(task => 
          task.id === selectedTask.id 
            ? { ...task, comentarios: updatedComments }
            : task
        );
      });
      setColumns(updatedColumns);

      setSelectedTask({
        ...selectedTask,
        comentarios: updatedComments,
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
    <>
      <div className="kanban-modern-container">
        {/* Botones fijos */}
        <button className="btn btn-outline-secondary position-fixed theme-toggle" onClick={toggleTheme}>
          <i className={`bi ${theme === "light" ? "bi-moon-stars-fill" : "bi-sun-fill"} theme-icon`} />
        </button>

        <button className="btn btn-outline-secondary position-fixed back-button" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left" />
        </button>

        <div className="container-fluid py-4">
          {/* Header */}
          <header className="text-center mb-4">
            <h1 className="display-5 fw-bold mb-2">
              <i className="bi bi-kanban me-3 text-primary"></i>
              {proyecto ? `${proyecto.nombre} - Tablero` : 'Tablero de Tareas'}
            </h1>
            <p className="lead text-muted">
              Arrastra las tareas entre columnas para actualizar su estado
            </p>
          </header>

          {/* Alertas */}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
              <button type="button" className="btn-close" onClick={() => setError(null)}></button>
            </div>
          )}

          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <i className="bi bi-check-circle me-2"></i>
              {success}
              <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
            </div>
          )}

          {/* Tablero Kanban */}
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
                          className={`card-body kanban-drop-zone ${
                            snapshot.isDraggingOver ? "drag-over" : ""
                          }`}
                          style={{ 
                            minHeight: "420px"
                          }}
                        >
                          {tasks.length === 0 ? (
                            <div className="text-center text-muted py-4">
                              <i className="bi bi-inbox display-1 opacity-25"></i>
                              <p className="mt-2 small">No hay tareas</p>
                            </div>
                          ) : (
                            tasks.map((task, index) => (
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
                                        <h6 className="card-title fw-bold mb-0 flex-grow-1">{task.title}</h6>
                                        <div className="d-flex align-items-center gap-1">
                                          <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleAddFile(task);
                                            }}
                                            title="Adjuntar PDF"
                                          >
                                            <i className="bi bi-file-earmark-pdf"></i>
                                          </button>
                                          <button
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              openComments(task);
                                            }}
                                            title="Ver comentarios"
                                          >
                                            <i className="bi bi-chat-left-text"></i>
                                            {task.comentarios && task.comentarios.length > 0 && (
                                              <span className="badge bg-danger rounded-pill ms-1">
                                                {task.comentarios.length}
                                              </span>
                                            )}
                                          </button>
                                          <i className="bi bi-grip-vertical text-muted" title="Arrastra para mover"></i>
                                        </div>
                                      </div>
                                      <p className="card-text text-muted small mb-2">{task.description}</p>
                                      
                                      {/* Mostrar alumno asignado */}
                                      <div className="mb-2">
                                        <small className="text-muted">
                                          <i className="bi bi-person me-1"></i>
                                          {task.responsable}
                                        </small>
                                      </div>

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
                                            <i className="bi bi-file-earmark-pdf me-1"></i>
                                            Ver PDF
                                          </a>
                                        </div>
                                      )}

                                      {/* Mostrar si está firmada */}
                                      {task.firmadoPor && (
                                        <div className="mb-2">
                                          <div className="badge bg-success text-white small">
                                            <i className="bi bi-check-circle-fill me-1"></i>
                                            Aprobada por {task.firmadoPor}
                                          </div>
                                        </div>
                                      )}

                                      <div className="d-flex align-items-center justify-content-between">
                                        <span className={`badge ${priorityBadge[task.priority]} me-2`}>
                                          <i className="bi bi-flag-fill me-1"></i>
                                          {task.priority}
                                        </span>
                                        <small className="text-muted">
                                          <i className="bi bi-hash"></i>
                                          {task.id}
                                        </small>
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
        <Modal show={showFileModal} onHide={() => setShowFileModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="bi bi-paperclip me-2"></i>
              Adjuntar Archivo PDF - {selectedTask?.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              {/* Opción 1: Subir archivo a Google Cloud Storage */}
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-header bg-primary text-white">
                    <h6 className="mb-0">
                      <i className="bi bi-cloud-upload me-2"></i>
                      Subir archivo PDF
                    </h6>
                  </div>
                  <div className="card-body">
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        Seleccionar archivo PDF
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        disabled={uploading}
                      />
                      <Form.Text className="text-muted">
                        Solo se aceptan archivos PDF (máximo 10MB)
                      </Form.Text>
                    </Form.Group>
                    
                    {selectedFile && (
                      <div className="alert alert-info">
                        <i className="bi bi-file-earmark-pdf me-2"></i>
                        <strong>Archivo seleccionado:</strong><br />
                        {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    )}

                    <Button 
                      variant="primary" 
                      onClick={handleUploadToGCS}
                      disabled={!selectedFile || uploading}
                      className="w-100"
                    >
                      {uploading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Subiendo a Google Cloud...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-cloud-upload me-2"></i>
                          Subir a Google Cloud Storage
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Opción 2: Enlace manual */}
              <div className="col-md-6">
                <div className="card h-100">
                  <div className="card-header bg-secondary text-white">
                    <h6 className="mb-0">
                      <i className="bi bi-link-45deg me-2"></i>
                      Enlace manual
                    </h6>
                  </div>
                  <div className="card-body">
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">
                        URL del archivo
                      </Form.Label>
                      <Form.Control
                        type="url"
                        value={fileUrl}
                        onChange={(e) => setFileUrl(e.target.value)}
                        placeholder="https://storage.googleapis.com/..."
                        disabled={uploading || selectedFile}
                      />
                      <Form.Text className="text-muted">
                        Pega aquí el enlace directo al archivo
                      </Form.Text>
                    </Form.Group>

                    {fileUrl && !selectedFile && (
                      <div className="alert alert-info">
                        <i className="bi bi-info-circle me-2"></i>
                        <strong>Vista previa:</strong>
                        <br />
                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                          {fileUrl.length > 50 ? fileUrl.substring(0, 50) + '...' : fileUrl}
                        </a>
                      </div>
                    )}

                    <Button 
                      variant="secondary" 
                      onClick={() => saveFileUrlToTask()}
                      disabled={!fileUrl || loading || selectedFile}
                      className="w-100"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check me-2"></i>
                          Guardar enlace
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Archivo actual si existe */}
            {selectedTask?.fileUrl && (
              <div className="mt-3">
                <div className="alert alert-success">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <i className="bi bi-file-earmark-pdf me-2"></i>
                      <strong>Archivo actual:</strong>
                    </div>
                    <a 
                      href={selectedTask.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-success"
                    >
                      <i className="bi bi-box-arrow-up-right me-1"></i>
                      Ver archivo
                    </a>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="outline-secondary" 
              onClick={() => {
                setShowFileModal(false);
                setSelectedFile(null);
                setFileUrl("");
              }}
              disabled={uploading}
            >
              Cancelar
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal de comentarios */}
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
                        <i className="bi bi-file-earmark-pdf me-2"></i>
                        <strong>Archivo PDF adjunto:</strong>
                      </div>
                      <a 
                        href={selectedTask.fileUrl} 
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

                {/* Lista de comentarios */}
                <div className="mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {(!selectedTask.comentarios || selectedTask.comentarios.length === 0) ? (
                    <div className="text-center text-muted py-4">
                      <i className="bi bi-chat-left display-1 opacity-25"></i>
                      <p className="mt-2">No hay comentarios</p>
                      <small>Sé el primero en comentar esta tarea</small>
                    </div>
                  ) : (
                    <div className="list-group list-group-flush">
                      {selectedTask.comentarios.map((comentario, index) => (
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
                <Form onSubmit={(e) => { e.preventDefault(); addComment(); }}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      <i className="bi bi-chat-left-dots me-2"></i>
                      Nuevo comentario
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Escribe tu comentario aquí..."
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-end gap-2">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setShowComments(false)}
                    >
                      Cerrar
                    </Button>
                    <Button 
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
                    </Button>
                  </div>
                </Form>
              </>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default Kanban;
