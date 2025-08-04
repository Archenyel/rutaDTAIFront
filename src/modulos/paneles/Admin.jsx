import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import api from "../../api/api";
import "./Admin.css";

const Modal = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div className="modal show d-block" tabIndex="-1" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

const Admin = () => {
  const [students, setStudents] = useState([]);
  const [projects, setProjects] = useState([]);

  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [studentForm, setStudentForm] = useState({ nombre: "", email: "", proyecto: "", matricula: "", carrera: "", semestre: "" });

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [projectForm, setProjectForm] = useState({ nombre: "", inicio: "", entrega: "", encargado: "", descripcion: "" });

  // Nuevo estado para modal de asignación
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [availableStudents, setAvailableStudents] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);

  // Estados de carga y errores
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [apiError, setApiError] = useState("");

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchStudents();
    fetchProjects();
  }, []);

  // Funciones para cargar datos desde la API
  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const response = await api.get('/usuarios?rol=2');
      setStudents(response.data);
    } catch (error) {
      console.error("Error al cargar alumnos:", error);
      setApiError("Error al cargar los alumnos");
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchProjects = async () => {
    setLoadingProjects(true);
    try {
      const response = await api.get('/proyectos');
      setProjects(response.data);
    } catch (error) {
      console.error("Error al cargar proyectos:", error);
      setApiError("Error al cargar los proyectos");
    } finally {
      setLoadingProjects(false);
    }
  };

  // Función para obtener detalles de un proyecto específico con alumnos asignados
  const fetchProjectDetails = async (projectId) => {
    try {
      const response = await api.get(`/proyectos/${projectId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener detalles del proyecto:", error);
      throw error;
    }
  };

  // --- Funciones comunes ---
  const closeModals = () => {
    setShowStudentModal(false);
    setShowProjectModal(false);
    setShowAssignModal(false);
    setEditStudent(null);
    setEditProject(null);
    setSelectedProject(null);
    setStudentForm({ nombre: "", email: "", proyecto: "", matricula: "", carrera: "", semestre: "" });
    setProjectForm({ nombre: "", inicio: "", entrega: "", encargado: "", descripcion: "" });
    setAvailableStudents([]);
    setAssignedStudents([]);
    setApiError("");
  };

  // --- CRUD Alumnos ---
  const handleAddStudent = () => {
    setEditStudent(null);
    setStudentForm({ nombre: "", email: "", proyecto: "", matricula: "", carrera: "", semestre: "" });
    setApiError("");
    setShowStudentModal(true);
  };

  const handleEditStudent = (student) => {
    setEditStudent(student);
    setStudentForm(student);
    setApiError("");
    setShowStudentModal(true);
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este alumno?")) {
      setIsLoading(true);
      try {
        await api.delete(`auth/eliminar/${id}`);
        setStudents((prev) => prev.filter((s) => s.id !== id));
      } catch (error) {
        console.error("Error al eliminar alumno:", error);
        setApiError("Error al eliminar el alumno");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudentForm((prev) => ({ ...prev, [name]: value }));
    if (apiError) setApiError("");
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError("");

    try {
      if (editStudent) {
        // Editar alumno existente
        const response = await api.put(`/alumnos/${editStudent.id}`, studentForm);
        setStudents((prev) =>
          prev.map((s) => (s.id === editStudent.id ? response.data : s))
        );
      } else {
        // Crear nuevo alumno
        const response = await api.post('/alumnos', studentForm);
        setStudents((prev) => [...prev, response.data]);
      }
      closeModals();
    } catch (error) {
      console.error("Error al guardar alumno:", error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error || 
                            "Error en el servidor";
        setApiError(errorMessage);
      } else if (error.request) {
        setApiError("Error de conexión. Verifica tu conexión a internet.");
      } else {
        setApiError("Error inesperado. Inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- CRUD Proyectos ---
  const handleAddProject = () => {
    setEditProject(null);
    setProjectForm({ nombre: "", inicio: "", entrega: "", encargado: "", descripcion: "" });
    setApiError("");
    setShowProjectModal(true);
  };

  const handleEditProject = (project) => {
    setEditProject(project);
    setProjectForm(project);
    setApiError("");
    setShowProjectModal(true);
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este proyecto?")) {
      setIsLoading(true);
      try {
        await api.delete(`/proyectos/${id}`);
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Error al eliminar proyecto:", error);
        setApiError("Error al eliminar el proyecto");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectForm((prev) => ({ ...prev, [name]: value }));
    if (apiError) setApiError("");
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setApiError("");

    try {
      if (editProject) {
        // Editar proyecto existente
        const response = await api.patch(`/proyectos/${editProject.id}`, projectForm);
        setProjects((prev) =>
          prev.map((p) => (p.id === editProject.id ? response.data : p))
        );
      } else {
        // Crear nuevo proyecto
        const response = await api.post('/proyectos', projectForm);
        setProjects((prev) => [...prev, response.data]);
      }
      closeModals();
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error || 
                            "Error en el servidor";
        setApiError(errorMessage);
      } else if (error.request) {
        setApiError("Error de conexión. Verifica tu conexión a internet.");
      } else {
        setApiError("Error inesperado. Inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // --- Funciones de asignación de alumnos ---
  const handleManageStudents = async (project) => {
    setIsLoading(true);
    setApiError("");
    
    try {
      // Obtener detalles del proyecto con alumnos asignados
      const projectDetails = await fetchProjectDetails(project.id);
      const assignedStudentIds = projectDetails.alumnos || [];
      
      // Separar alumnos asignados y disponibles
      const assigned = students.filter(student => assignedStudentIds.includes(student.id));
      const available = students.filter(student => !assignedStudentIds.includes(student.id));
      
      setSelectedProject(project);
      setAssignedStudents(assigned);
      setAvailableStudents(available);
      setShowAssignModal(true);
    } catch (error) {
      console.error("Error al cargar detalles del proyecto:", error);
      setApiError("Error al cargar los detalles del proyecto");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignStudent = async (studentId) => {
    setIsLoading(true);
    setApiError("");

    try {
      await api.put('/proyectos/asignarAlumno', {
        idProyecto: selectedProject.id,
        idAlumno: studentId
      });

      // Mover alumno de disponibles a asignados
      const studentToMove = availableStudents.find(s => s.id === studentId);
      setAssignedStudents(prev => [...prev, studentToMove]);
      setAvailableStudents(prev => prev.filter(s => s.id !== studentId));

    } catch (error) {
      console.error("Error al asignar alumno:", error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error || 
                            "Error al asignar alumno";
        setApiError(errorMessage);
      } else {
        setApiError("Error de conexión al asignar alumno");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    setIsLoading(true);
    setApiError("");

    try {
      await api.put('/proyectos/quitarAlumno', {
        idProyecto: selectedProject.id,
        idAlumno: studentId
      });

      // Mover alumno de asignados a disponibles
      const studentToMove = assignedStudents.find(s => s.id === studentId);
      setAvailableStudents(prev => [...prev, studentToMove]);
      setAssignedStudents(prev => prev.filter(s => s.id !== studentId));

    } catch (error) {
      console.error("Error al quitar alumno:", error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error || 
                            "Error al quitar alumno";
        setApiError(errorMessage);
      } else {
        setApiError("Error de conexión al quitar alumno");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="header-custom text-white">
        <div className="container-fluid py-4">
          <div className="row">
            <div className="col">
              <h1 className="h4 fw-bold mb-0">RutaDTAI</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mt-5">
        <h2>Panel de Administrador</h2>
        <p>CRUD de alumnos y proyectos</p>

        {/* Mensaje de error global */}
        {apiError && !showStudentModal && !showProjectModal && !showAssignModal && (
          <div className="alert alert-danger" role="alert">
            {apiError}
            <button 
              type="button" 
              className="btn-close float-end" 
              onClick={() => setApiError("")}
            ></button>
          </div>
        )}

        {/* Botones */}
        <button 
          className="btn btn-primary mb-3 me-2" 
          onClick={handleAddStudent}
          disabled={isLoading || loadingStudents}
        >
          Agregar Alumno
        </button>
        <button 
          className="btn btn-primary mb-3" 
          onClick={handleAddProject}
          disabled={isLoading || loadingProjects}
        >
          Agregar Proyecto
        </button>

        {/* Tabla de Alumnos */}
        <h4 className="mt-4">Alumnos</h4>
        {loadingStudents ? (
          <div className="text-center py-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando alumnos...</p>
          </div>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Matrícula</th>
                <th>Proyecto Asignado</th>
                <th style={{ width: "150px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>{s.nombre}</td>
                  <td>{s.email}</td>
                  <td>{s.matricula}</td>
                  <td>{s.proyecto || "No asignado"}</td>
                  <td>
                    <button 
                      className="btn btn-warning btn-sm me-2" 
                      onClick={() => handleEditStudent(s)}
                      disabled={isLoading}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => handleDeleteStudent(s.id)}
                      disabled={isLoading}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && !loadingStudents && (
                <tr>
                  <td colSpan="5" className="text-center">
                    No hay alumnos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Tabla de Proyectos */}
        <h4 className="mt-5">Proyectos</h4>
        {loadingProjects ? (
          <div className="text-center py-4">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando proyectos...</p>
          </div>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha Inicio</th>
                <th>Fecha Entrega</th>
                <th>Encargado</th>
                <th style={{ width: "200px" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.nombre}</td>
                  <td>{p.inicio}</td>
                  <td>{p.entrega}</td>
                  <td>{p.encargado}</td>
                  <td>
                    <button 
                      className="btn btn-info btn-sm me-1" 
                      onClick={() => handleManageStudents(p)}
                      disabled={isLoading}
                      title="Gestionar alumnos"
                    >
                      👥
                    </button>
                    <button 
                      className="btn btn-warning btn-sm me-1" 
                      onClick={() => handleEditProject(p)}
                      disabled={isLoading}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => handleDeleteProject(p.id)}
                      disabled={isLoading}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && !loadingProjects && (
                <tr>
                  <td colSpan="5" className="text-center">
                    No hay proyectos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Alumno */}
      {showStudentModal && (
        <Modal onClose={closeModals}>
          <form onSubmit={handleStudentSubmit} className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editStudent ? "Editar Alumno" : "Agregar Alumno"}</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={closeModals}
                disabled={isLoading}
              ></button>
            </div>
            <div className="modal-body">
              {apiError && (
                <div className="alert alert-danger" role="alert">
                  {apiError}
                </div>
              )}
              
              <div className="mb-3">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={studentForm.nombre}
                  onChange={handleStudentChange}
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={studentForm.email}
                  onChange={handleStudentChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Matrícula *</label>
                <input
                  type="text"
                  name="matricula"
                  className="form-control"
                  value={studentForm.matricula}
                  onChange={handleStudentChange}
                  required
                  disabled={isLoading}
                  placeholder="Número de matrícula"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Carrera</label>
                <input
                  type="text"
                  name="carrera"
                  className="form-control"
                  value={studentForm.carrera}
                  onChange={handleStudentChange}
                  disabled={isLoading}
                  placeholder="Carrera del alumno"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Semestre</label>
                <input
                  type="text"
                  name="semestre"
                  className="form-control"
                  value={studentForm.semestre}
                  onChange={handleStudentChange}
                  disabled={isLoading}
                  placeholder="Semestre actual"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={closeModals}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </span>
                    {editStudent ? "Guardando..." : "Agregando..."}
                  </>
                ) : (
                  editStudent ? "Guardar cambios" : "Agregar"
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Proyecto */}
      {showProjectModal && (
        <Modal onClose={closeModals}>
          <form onSubmit={handleProjectSubmit} className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{editProject ? "Editar Proyecto" : "Agregar Proyecto"}</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={closeModals}
                disabled={isLoading}
              ></button>
            </div>
            <div className="modal-body">
              {apiError && (
                <div className="alert alert-danger" role="alert">
                  {apiError}
                </div>
              )}
              
              <div className="mb-3">
                <label className="form-label">Nombre del Proyecto *</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={projectForm.nombre}
                  onChange={handleProjectChange}
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Descripción</label>
                <textarea
                  name="descripcion"
                  className="form-control"
                  value={projectForm.descripcion}
                  onChange={handleProjectChange}
                  disabled={isLoading}
                  rows="3"
                  placeholder="Descripción del proyecto"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha de Inicio *</label>
                <input
                  type="date"
                  name="inicio"
                  className="form-control"
                  value={projectForm.inicio}
                  onChange={handleProjectChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Fecha de Entrega *</label>
                <input
                  type="date"
                  name="entrega"
                  className="form-control"
                  value={projectForm.entrega}
                  onChange={handleProjectChange}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Encargado *</label>
                <input
                  type="text"
                  name="encargado"
                  className="form-control"
                  value={projectForm.encargado}
                  onChange={handleProjectChange}
                  required
                  disabled={isLoading}
                  placeholder="Nombre del encargado"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={closeModals}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </span>
                    {editProject ? "Guardando..." : "Agregando..."}
                  </>
                ) : (
                  editProject ? "Guardar cambios" : "Agregar"
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Asignación de Alumnos */}
      {showAssignModal && selectedProject && (
        <Modal onClose={closeModals}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Gestionar Alumnos - {selectedProject.nombre}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={closeModals}
                disabled={isLoading}
              ></button>
            </div>
            <div className="modal-body">
              {apiError && (
                <div className="alert alert-danger" role="alert">
                  {apiError}
                </div>
              )}

              <div className="row">
                {/* Alumnos Disponibles */}
                <div className="col-md-6">
                  <h6 className="border-bottom pb-2">Alumnos Disponibles</h6>
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {availableStudents.length === 0 ? (
                      <p className="text-muted">No hay alumnos disponibles</p>
                    ) : (
                      availableStudents.map((student) => (
                        <div key={student.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                          <div>
                            <small className="fw-bold">{student.nombre}</small><br />
                            <small className="text-muted">{student.email}</small>
                          </div>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleAssignStudent(student.id)}
                            disabled={isLoading}
                            title="Asignar al proyecto"
                          >
                            ➕
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Alumnos Asignados */}
                <div className="col-md-6">
                  <h6 className="border-bottom pb-2">Alumnos Asignados</h6>
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    {assignedStudents.length === 0 ? (
                      <p className="text-muted">No hay alumnos asignados</p>
                    ) : (
                      assignedStudents.map((student) => (
                        <div key={student.id} className="d-flex justify-content-between align-items-center mb-2 p-2 border rounded bg-light">
                          <div>
                            <small className="fw-bold">{student.nombre}</small><br />
                            <small className="text-muted">{student.email}</small>
                          </div>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRemoveStudent(student.id)}
                            disabled={isLoading}
                            title="Quitar del proyecto"
                          >
                            ➖
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {isLoading && (
                <div className="text-center mt-3">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Procesando...</span>
                  </div>
                  <span className="ms-2">Procesando...</span>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={closeModals}
                disabled={isLoading}
              >
                Cerrar
              </button>
            </div>
          </div>
        </Modal>
      )}
      
    </>
    
  );
};

export default Admin;
